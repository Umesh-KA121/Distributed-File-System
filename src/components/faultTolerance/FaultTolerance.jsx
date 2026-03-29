import { useState } from 'react';

export default function FaultTolerance({ nodes, files, partitionActive, onSimulateFail, onRecoverNode, onSimulatePartition, onHealPartition, onSimulateCorruption }) {
  const [failNode, setFailNode] = useState('');
  const [recNode, setRecNode] = useState('');
  const [corrFile, setCorrFile] = useState('');

  const onNodes = nodes.filter(n=>n.status==='online').length;
  const tot = nodes.length;
  const hr = files.reduce((s,f)=>s+f.replicas.filter(r=>r===1).length,0);
  const tr = files.reduce((s,f)=>s+f.replicas.length,0)||1;
  const score = Math.round(((onNodes/tot)*.5 + (hr/tr)*.5)*100);
  const scColor = score > 80 ? 'var(--green)' : score > 50 ? 'var(--yellow)' : 'var(--red)';

  const availableToFail = nodes.filter(n=>n.status==='online');
  const availableToRec = nodes.filter(n=>n.status!=='online');

  return (
    <div className="panel active">
      <div className="section-title">🛡️ Fault Tolerance</div>
      <div className="section-sub">Simulate failures, trigger recovery, and test system resilience</div>
      
      <div className="fault-card">
        <div className="fault-title">🔴 Node Failure Simulation</div>
        <div className="fault-desc">Simulate a node going offline. The system detects the failure, reroutes reads/writes to healthy replicas, and re-replicates to maintain the replication factor.</div>
        <div className="fault-actions">
          <select className="form-select" style={{width:'auto',flex:1}} value={failNode} onChange={e=>setFailNode(e.target.value)}>
            <option value="">Select node to fail...</option>
            {availableToFail.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button className="btn btn-danger" onClick={()=>onSimulateFail(failNode)}>Simulate Failure</button>
        </div>
      </div>
      
      <div className="fault-card">
        <div className="fault-title">🟢 Node Recovery</div>
        <div className="fault-desc">Bring a failed node back online. The system will sync missing data blocks, verify checksums, and restore the node to the active pool.</div>
        <div className="fault-actions">
          <select className="form-select" style={{width:'auto',flex:1}} value={recNode} onChange={e=>setRecNode(e.target.value)}>
            <option value="">Select node to recover...</option>
            {availableToRec.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={()=>onRecoverNode(recNode)}>Recover Node</button>
        </div>
      </div>
      
      <div className="fault-card">
        <div className="fault-title">⚡ Network Partition</div>
        <div className="fault-desc">Simulate a network partition between node groups. Tests split-brain prevention and consistency guarantees under CAP theorem constraints using Raft consensus.</div>
        <div className="fault-actions">
          <button className="btn btn-danger" onClick={onSimulatePartition}>Partition Network</button>
          <button className="btn btn-ghost btn-sm" onClick={onHealPartition}>Heal Partition</button>
        </div>
      </div>
      
      <div className="fault-card">
        <div className="fault-title">💾 Data Corruption Simulation</div>
        <div className="fault-desc">Inject bit-flip corruption into a file replica. Integrity system will detect via SHA-256 checksums and auto-recover from a clean replica.</div>
        <div className="fault-actions">
          <select className="form-select" style={{width:'auto',flex:1}} value={corrFile} onChange={e=>setCorrFile(e.target.value)}>
            <option value="">Select file to corrupt...</option>
            {files.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <button className="btn btn-danger" onClick={()=>onSimulateCorruption(corrFile)}>Inject Corruption</button>
        </div>
      </div>
      
      <div className="fault-card" style={{borderColor:'rgba(0,229,255,.2)'}}>
        <div className="fault-title" style={{color:'var(--accent)'}}>📊 Cluster Resilience Score</div>
        <div style={{fontFamily:'var(--mono)',fontSize:'13px',marginTop:'8px',lineHeight:2}}>
          <div style={{fontSize:'36px',fontWeight:800,color:scColor,lineHeight:1.2}}>
            {score}<span style={{fontSize:'16px',color:'var(--muted)'}}>/100</span>
          </div>
          <div style={{color:'var(--muted)',fontSize:'11px',marginTop:'6px'}}>
            Nodes: {onNodes}/{tot} online &nbsp;|&nbsp; Replicas: {hr}/{tr} healthy &nbsp;|&nbsp; Partition: {partitionActive?'⚠ ACTIVE':'✓ NONE'}
          </div>
        </div>
      </div>
    </div>
  );
}
