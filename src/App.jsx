import { useState, useEffect } from 'react';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import RightPanel from './components/shared/RightPanel';
import ToastContainer from './components/shared/ToastContainer';
import { AddNodeModal, FileDetailModal } from './components/shared/Modals';

import Dashboard from './components/dashboard/Dashboard';
import FileManager from './components/fileManager/FileManager';
import NodeManager from './components/nodeManager/NodeManager';
import Replication from './components/replication/Replication';
import FaultTolerance from './components/faultTolerance/FaultTolerance';
import IntegrityCheck from './components/integrityCheck/IntegrityCheck';
import SystemLogs from './components/systemLogs/SystemLogs';

const INITIAL_NODES = [
  {id:'node-01',name:'node-01',status:'online',role:'primary',cap:200,used:140,files:3,lat:12},
  {id:'node-02',name:'node-02',status:'online',role:'replica',cap:200,used:98,files:2,lat:18},
  {id:'node-03',name:'node-03',status:'online',role:'replica',cap:200,used:112,files:1,lat:9},
  {id:'node-04',name:'node-04',status:'online',role:'replica',cap:200,used:76,files:1,lat:22},
  {id:'node-05',name:'node-05',status:'online',role:'replica',cap:200,used:54,files:1,lat:15},
];

const INITIAL_FILES = [
  {id:'f1',name:'kernel.tar.gz',size:'234 MB',sizeB:245366784,node:'node-01',date:'2025-03-22',type:'archive',replicas:[1,1,1],hash:'a3f82c1d9b'},
  {id:'f2',name:'filesystem.img',size:'1.2 GB',sizeB:1288490188,node:'node-02',date:'2025-03-21',type:'disk',replicas:[1,1,1],hash:'b7e91f3a2c'},
  {id:'f3',name:'report_final.pdf',size:'4.8 MB',sizeB:5033164,node:'node-01',date:'2025-03-20',type:'pdf',replicas:[1,1,1],hash:'c2d45b9e1f'},
  {id:'f4',name:'backup_2025.zip',size:'892 MB',sizeB:935525376,node:'node-03',date:'2025-03-19',type:'archive',replicas:[1,1,1],hash:'d9a17e2c4b'},
  {id:'f5',name:'database.sql',size:'56 MB',sizeB:58720256,node:'node-04',date:'2025-03-18',type:'db',replicas:[1,1,1],hash:'e4c83f7d5a'},
  {id:'f6',name:'source_code.tar',size:'128 MB',sizeB:134217728,node:'node-05',date:'2025-03-17',type:'archive',replicas:[1,1,1],hash:'f1b62a8c3e'},
  {id:'f7',name:'logs_march.txt',size:'12 MB',sizeB:12582912,node:'node-01',date:'2025-03-25',type:'text',replicas:[1,1,1],hash:'a8d34c1b7f'},
  {id:'f8',name:'model_weights.bin',size:'3.4 GB',sizeB:3650722816,node:'node-02',date:'2025-03-23',type:'bin',replicas:[1,1,1],hash:'b3e72f9d6c'},
];

const INITIAL_EVENTS = [
  {type:'replicate',title:'Replication',msg:"kernel.tar.gz → node-03"},
  {type:'recover',title:'Leader Election',msg:'node-01 elected as Raft leader'},
  {type:'upload',title:'Cluster Ready',msg:'5 nodes online, 8 files verified'},
];

function genHash(len) { return Array.from({length:len},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join(''); }
function fmtB(b){if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(1)+' KB';if(b<1073741824)return(b/1048576).toFixed(1)+' MB';return(b/1073741824).toFixed(2)+' GB'}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [ioData, setIoData] = useState([42,67,38,55,81,73,60]);
  const [toasts, setToasts] = useState([]);
  const [partitionActive, setPartitionActive] = useState(false);
  
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [detailFileId, setDetailFileId] = useState(null);
  
  // Initialization
  useEffect(() => {
    const t = new Date().toLocaleTimeString('en-US',{hour12:false});
    setEvents(INITIAL_EVENTS.map(e => ({...e, time: t})));
    
    const initLogs = [
      ['success','DistFS cluster initialized'],['info','node-01 (primary) joined cluster'],
      ['info','node-02 (replica) joined'],['info','node-03 (replica) joined'],
      ['info','node-04 (replica) joined'],['info','node-05 (replica) joined'],
      ['success','Replication factor 3x set'],['success','8 files verified across 5 nodes'],
      ['info','Raft consensus: node-01 elected leader'],['success','Cluster health: 100% (5/5 nodes)']
    ].map(([type, msg], i) => ({
      time: new Date(Date.now() - (10-i)*30000).toLocaleTimeString('en-US',{hour12:false}),
      type, msg
    }));
    setLogs(initLogs.reverse());

    const int1 = setInterval(() => {
      setNodes(prev => prev.map(n => n.status==='online' ? {...n, lat: Math.max(3, n.lat+Math.floor(Math.random()*7)-3)} : n));
      setIoData(prev => [...prev.slice(1), Math.floor(Math.random()*80)+15]);
    }, 4000);

    const msgs=[['info','Heartbeat: all nodes responding'],['info','Lease renewed for primary node-01'],['info','Block 0x4f2a checksum verified'],['success','Replication lag <2ms across all nodes']];
    const int2 = setInterval(() => {
      const [tMsg, mMsg] = msgs[Math.floor(Math.random()*msgs.length)];
      addLog(tMsg, mMsg);
    }, 8000);

    return () => { clearInterval(int1); clearInterval(int2); };
  }, []);

  // Helpers
  const showToast = (msg, type='info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, msg, type}]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const addLog = (type, msg) => {
    const time = new Date().toLocaleTimeString('en-US',{hour12:false});
    setLogs(prev => [{time, type, msg}, ...prev].slice(0, 200));
  };
  
  const addEvent = (type, title, msg) => {
    const time = new Date().toLocaleTimeString('en-US',{hour12:false});
    setEvents(prev => [{type, title, msg, time}, ...prev].slice(0, 20));
  };

  const triggerReplication = (failId) => {
    const affected = files.filter(f=>f.node===failId);
    if(affected.length===0) return;
    const online = nodes.filter(n=>n.status==='online');
    affected.forEach((f, i) => {
      setTimeout(() => {
        setFiles(prev => {
          const nf = [...prev];
          const idx = nf.findIndex(file=>file.id===f.id);
          if(idx>-1 && online.length) {
            const nn = online[i%online.length];
            nf[idx] = {...nf[idx], node: nn.id};
            addLog('warn', `Re-replicating '${f.name}' to ${nn.id}`);
            addEvent('replicate', 'Re-Replication', `${f.name} → ${nn.id}`);
          }
          return nf;
        });
      }, i*500+800);
    });
  };

  // Actions
  const handleUpload = (newFiles) => {
    const online = nodes.filter(n=>n.status==='online');
    if(!online.length) { showToast('No online nodes!', 'error'); return; }
    newFiles.forEach((f, i) => {
      setTimeout(() => {
        const node = online[i%online.length];
        const ext = f.name.split('.').pop().toLowerCase();
        const type = ['zip','tar','gz'].includes(ext) ? 'archive':['pdf'].includes(ext)?'pdf':['sql'].includes(ext)?'db':['txt','log'].includes(ext)?'text':'bin';
        const newFile = {id:'f'+Date.now()+i, name:f.name, size:fmtB(f.size), sizeB:f.size, node:node.id, date:new Date().toISOString().slice(0,10), type, replicas:[1,1,1], hash:genHash(10)};
        setFiles(prev => [...prev, newFile]);
        setNodes(prev => prev.map(n => n.id===node.id ? {...n, files: n.files+1, used: Math.min(n.used+f.size/1048576, n.cap)} : n));
        addLog('success', `'${f.name}' uploaded to ${node.id} and replicated`);
        addEvent('upload', 'File Uploaded', `${f.name} → ${node.id}`);
        showToast(`'${f.name}' uploaded!`, 'success');
      }, i*300);
    });
  };

  const handleDeleteFiles = (ids) => {
    if(!ids.length) { showToast('No files selected', 'warn'); return; }
    setFiles(prev => prev.filter(f => !ids.includes(f.id)));
    addLog('warn', `${ids.length} file(s) deleted`);
    showToast(`${ids.length} file(s) deleted`, 'info');
  };

  const handleNodeAction = (action, id) => {
    if(action === 'offline') {
      setNodes(prev => prev.map(n => n.id===id ? {...n, status:'offline'} : n));
      addLog('error', `Node '${id}' taken offline`);
      addEvent('fail', 'Node Offline', `${id} taken offline`);
      showToast(`${id} offline`, 'warn');
      triggerReplication(id);
    } else if(action === 'online') {
      setNodes(prev => prev.map(n => n.id===id ? {...n, status:'degraded'} : n));
      addLog('warn', `Node '${id}' recovering...`);
      showToast(`${id} recovering...`, 'info');
      setTimeout(() => {
        setNodes(prev => prev.map(n => n.id===id ? {...n, status:'online'} : n));
        addLog('success', `Node '${id}' back online`);
        addEvent('recover', 'Node Recovered', `${id} back online`);
        showToast(`${id} back online!`, 'success');
      }, 2500);
    } else if(action === 'ping') {
      const n = nodes.find(n=>n.id===id);
      if(!n || n.status==='offline') { showToast(`${id} is offline`, 'error'); return; }
      const lat = Math.floor(Math.random()*40)+5;
      setNodes(prev => prev.map(nd => nd.id===id ? {...nd, lat} : nd));
      addLog('info', `PING ${id}: ${lat}ms RTT`);
      showToast(`${id}: ${lat}ms`, 'success');
    } else if(action === 'rebalance') {
      addLog('info', `Rebalancing ${id}...`); showToast(`Rebalancing ${id}`, 'info');
      setTimeout(() => { showToast(`${id} rebalanced!`, 'success'); addLog('success', `${id} rebalance done`); }, 1200);
    }
  };

  const handleAddNode = (name, cap, role) => {
    if(!name) { showToast('Node name required', 'warn'); return; }
    if(nodes.find(n=>n.id===name)) { showToast('Already exists', 'error'); return; }
    setNodes(prev => [...prev, {id:name, name, status:'online', role, cap, used:0, files:0, lat:Math.floor(Math.random()*30)+5}]);
    setIsAddNodeOpen(false);
    addLog('success', `Node '${name}' joined cluster (${cap}GB, ${role})`);
    addEvent('recover', 'Node Added', `${name} joined as ${role}`);
    showToast(`${name} added!`, 'success');
  };

  // Integrity Checking
  const handleRunIntegrity = () => {
    addLog('info', 'Full integrity check started...'); showToast('Running SHA-256 verification...', 'info');
    setTimeout(() => {
      const c = files.filter(f=>!f.replicas.every(r=>r===1));
      if(c.length) { addLog('error', `Integrity: ${c.length} corrupted file(s)`); showToast(`${c.length} corruption(s)!`, 'error'); }
      else { addLog('success', 'Integrity OK: all files verified'); showToast('All files verified!', 'success'); }
    }, files.length*200);
  };

  const handleRepairIntegrity = () => {
    const c = files.filter(f=>!f.replicas.every(r=>r===1));
    if(!c.length) { showToast('Nothing to repair', 'info'); return; }
    setFiles(prev => prev.map(f => ({...f, replicas:[1,1,1]})));
    addLog('success', `Repaired ${c.length} file(s)`); showToast(`${c.length} file(s) repaired!`, 'success');
  };

  const selFile = files.find(f=>f.id===detailFileId);

  return (
    <>
      <Header filesCount={files.length} onlineNodes={nodes.filter(n=>n.status==='online').length} totalNodes={nodes.length} />
      <div className="app">
        <Sidebar activeTab={activeTab} onSwitchTab={setActiveTab} nodes={nodes} />
        <main className="main">
          <div className="tab-bar">
            {['dashboard','files','nodes','replication','fault','integrity','logs'].map(t => (
              <div key={t} className={`tab ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            ))}
          </div>
          {activeTab === 'dashboard' && <Dashboard files={files} nodes={nodes} logs={logs} refreshNodeHealth={() => showToast('Refreshed!', 'info')} />}
          {activeTab === 'files' && <FileManager files={files} onUpload={handleUpload} onDelete={handleDeleteFiles} onShowFileDetail={(id)=>setDetailFileId(id)} />}
          {activeTab === 'nodes' && <NodeManager nodes={nodes} onOpenAddNode={()=>setIsAddNodeOpen(true)} onRefresh={()=>showToast('Refreshed!','info')} onNodeAction={handleNodeAction} />}
          {activeTab === 'replication' && <Replication files={files} nodes={nodes} onRebalance={()=>handleNodeAction('rebalance','cluster')} />}
          {activeTab === 'fault' && <FaultTolerance nodes={nodes} files={files} partitionActive={partitionActive} 
            onSimulateFail={(id)=>id&&handleNodeAction('offline',id)} 
            onRecoverNode={(id)=>id&&handleNodeAction('online',id)}
            onSimulatePartition={()=>{ setPartitionActive(true); addLog('error','Network partition detected!'); addEvent('fail','Network Partition','Cluster split'); showToast('Network partition!','error'); }}
            onHealPartition={()=>{ setPartitionActive(false); addLog('success','Partition healed'); addEvent('recover','Partition Healed','Topology restored'); showToast('Partition healed!','success'); }}
            onSimulateCorruption={id=>{
              if(!id)return;
              setFiles(prev=>prev.map(f=>f.id===id ? {...f, replicas:[0,1,1]} : f));
              const fName = files.find(f=>f.id===id)?.name;
              addLog('error', `CORRUPTION in '${fName}' replica-1`); addEvent('fail', 'Corruption Detected', `${fName} corrupted`); showToast(`Corruption in ${fName}!`, 'error');
              setTimeout(() => {
                setFiles(prev=>prev.map(f=>f.id===id ? {...f, replicas:[1,1,1]} : f));
                addLog('success', `'${fName}' auto-repaired`); addEvent('recover', 'Auto-Repair', `${fName} restored`); showToast(`'${fName}' repaired!`, 'success');
              }, 3000);
            }} 
          />}
          {activeTab === 'integrity' && <IntegrityCheck files={files} onRunCheck={handleRunIntegrity} onRepair={handleRepairIntegrity} />}
          {activeTab === 'logs' && <SystemLogs logs={logs} onClear={()=>{setLogs([]); showToast('Logs cleared','info');}} onExport={()=>{showToast('Logs exported','success');}} />}
        </main>
        <RightPanel ioData={ioData} nodes={nodes} events={events} />
      </div>

      <AddNodeModal isOpen={isAddNodeOpen} onClose={()=>setIsAddNodeOpen(false)} onAdd={handleAddNode} />
      <FileDetailModal file={selFile} isOpen={!!detailFileId} onClose={()=>setDetailFileId(null)} onDownload={()=>{showToast(`Downloading ${selFile?.name}`,'success'); addLog('info',`Download: ${selFile?.name}`); setDetailFileId(null);}} />
      <ToastContainer toasts={toasts} />
    </>
  );
}
