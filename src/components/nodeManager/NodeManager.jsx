export default function NodeManager({ nodes, onOpenAddNode, onRefresh, onNodeAction }) {
  return (
    <div className="panel active">
      <div className="section-title">🖥️ Node Manager</div>
      <div className="section-sub">Monitor and manage cluster nodes</div>
      
      <div className="toolbar">
        <button className="btn btn-primary" onClick={onOpenAddNode}>+ Add Node</button>
        <button className="btn btn-ghost btn-sm" onClick={onRefresh}>↻ Refresh All</button>
      </div>
      
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'14px'}}>
        {nodes.map(n => {
          const p = Math.round((n.used/n.cap)*100);
          const fc = p>85 ? 'fill-red' : p>60 ? 'fill-yellow' : 'fill-green';
          return (
            <div key={n.id} className="node-detail">
              <div className="nd-header">
                <div className="nd-name">🖥️ {n.name}</div>
                <span className={`badge badge-${n.status}`}>{n.status}</span>
              </div>
              <div className="metric-row"><span className="metric-label">Role</span><span className="metric-value">{n.role}</span></div>
              <div className="metric-row"><span className="metric-label">Files</span><span className="metric-value">{n.files}</span></div>
              <div className="metric-row"><span className="metric-label">Latency</span><span className={`metric-value ${n.lat>20?'warn':'ok'}`}>{n.lat}ms</span></div>
              <div className="metric-row"><span className="metric-label">Capacity</span><span className="metric-value">{n.cap} GB</span></div>
              <div className="usage-bar-wrap" style={{marginTop:'10px'}}>
                <div className="usage-label"><span>Storage</span><span>{p}%</span></div>
                <div className="usage-track"><div className={`usage-fill ${fc}`} style={{width:`${p}%`}}></div></div>
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'12px',flexWrap:'wrap'}}>
                {n.status === 'online' ? 
                  <button className="btn btn-danger btn-sm" onClick={()=>onNodeAction('offline', n.id)}>Take Offline</button> :
                  <button className="btn btn-primary btn-sm" onClick={()=>onNodeAction('online', n.id)}>Bring Online</button>
                }
                <button className="btn btn-ghost btn-sm" onClick={()=>onNodeAction('ping', n.id)}>Ping</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>onNodeAction('rebalance', n.id)}>Rebalance</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
