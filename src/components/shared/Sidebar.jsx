export default function Sidebar({ activeTab, onSwitchTab, nodes }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation</div>
        <div className={`nav-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>onSwitchTab('dashboard')}><span className="icon">⬡</span>Dashboard</div>
        <div className={`nav-item ${activeTab==='files'?'active':''}`} onClick={()=>onSwitchTab('files')}><span className="icon">📁</span>File Manager</div>
        <div className={`nav-item ${activeTab==='nodes'?'active':''}`} onClick={()=>onSwitchTab('nodes')}><span className="icon">🖥️</span>Node Manager</div>
        <div className={`nav-item ${activeTab==='replication'?'active':''}`} onClick={()=>onSwitchTab('replication')}><span className="icon">🔁</span>Replication</div>
        <div className={`nav-item ${activeTab==='fault'?'active':''}`} onClick={()=>onSwitchTab('fault')}><span className="icon">🛡️</span>Fault Tolerance</div>
        <div className={`nav-item ${activeTab==='integrity'?'active':''}`} onClick={()=>onSwitchTab('integrity')}><span className="icon">🔒</span>Integrity Check</div>
        <div className={`nav-item ${activeTab==='logs'?'active':''}`} onClick={()=>onSwitchTab('logs')}><span className="icon">📋</span>System Logs</div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Nodes</div>
        <div className="node-list">
          {nodes.map(n => (
            <div key={n.id} className={`node-card ${n.status}`} onClick={()=>onSwitchTab('nodes')}>
              <div className="node-name">{n.name}<span className={`badge badge-${n.status}`}>{n.status}</span></div>
              <div className="node-meta"><span>{n.role}</span><span>{Math.round((n.used/n.cap)*100)}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
