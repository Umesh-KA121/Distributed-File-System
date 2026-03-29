export default function Dashboard({ files, nodes, logs, refreshNodeHealth }) {
  const onNodes = nodes.filter(n => n.status === 'online').length;
  const tc = nodes.reduce((s,n) => s+n.cap, 0);
  const tu = nodes.reduce((s,n) => s+n.used, 0);
  const storagePct = tc ? Math.round((tu/tc)*100) : 0;
  const hr = files.reduce((s,f) => s+f.replicas.filter(r=>r===1).length, 0);
  
  return (
    <div className="panel active">
      <div className="section-title">⬡ System Dashboard</div>
      <div className="section-sub">Real-time cluster health and activity overview</div>
      <div className="cards-grid">
        <div className="stat-card c1"><div className="stat-label">Total Files</div><div className="stat-value blue">{files.length}</div><div className="stat-change">across all nodes</div></div>
        <div className="stat-card c2"><div className="stat-label">Active Nodes</div><div className="stat-value green">{onNodes}</div><div className="stat-change">of {nodes.length} total</div></div>
        <div className="stat-card c3"><div className="stat-label">Storage Used</div><div className="stat-value yellow">{storagePct}%</div><div className="stat-change">{(tu/1024).toFixed(1)} GB / {(tc/1024).toFixed(1)} GB</div></div>
        <div className="stat-card c4"><div className="stat-label">Replicas OK</div><div className="stat-value purple">{hr}</div><div className="stat-change">healthy replicas</div></div>
      </div>
      
      <div className="card-wrap" style={{marginBottom:'20px'}}>
        <div className="card-header">
          <div className="card-title">NODE HEALTH OVERVIEW</div>
          <button className="btn btn-ghost btn-sm" onClick={refreshNodeHealth}>↻ Refresh</button>
        </div>
        <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'12px'}}>
          {nodes.map(n => {
            const p = Math.round((n.used/n.cap)*100);
            const fc = p>85 ? 'fill-red' : p>60 ? 'fill-yellow' : 'fill-green';
            const si = n.status==='online' ? '🟢' : n.status==='degraded' ? '🟡' : '🔴';
            return (
              <div key={n.id} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:'12px',fontWeight:700}}>{n.name}</span><span>{si}</span>
                </div>
                <div style={{fontFamily:'var(--mono)',fontSize:'10px',color:'var(--muted)',marginBottom:'6px'}}>{n.role} · {n.files} files · {n.lat}ms</div>
                <div className="usage-bar-wrap">
                  <div className="usage-label"><span>Storage</span><span>{p}%</span></div>
                  <div className="usage-track"><div className={`usage-fill ${fc}`} style={{width:`${p}%`}}></div></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="rep-viz">
        <div className="rep-topo-title">▸ REPLICATION TOPOLOGY</div>
        <div className="rep-nodes">
          {nodes.map((n, i) => {
            const role = i===0 ? 'primary':'replica';
            const cls = n.status==='offline' ? 'down' : role;
            const rLabel = n.status==='offline' ? 'down':role;
            const rClass = n.status==='offline' ? 'role-down' : i===0 ? 'role-primary':'role-replica';
            return (
              <div key={n.id} className={`rep-node ${cls}`}>
                <div className="rep-node-icon">🖥️</div>
                <div className="rep-node-name">{n.name}</div>
                <div className={`rep-node-role ${rClass}`}>{rLabel}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="terminal">
        <div className="term-header">
          <div className="tdots"><div className="tdot r"></div><div className="tdot y"></div><div className="tdot g"></div></div>
          <span>distfs-cluster — system.log</span>
        </div>
        <div className="term-body">
          {logs.length === 0 ? <div style={{color:'var(--muted)'}}>No logs.</div> : logs.map((l, i) => (
            <div key={i} className="log-line">
              <span className="log-time">{l.time}</span>
              <span className={`log-${l.type}`}>[{l.type.toUpperCase().padEnd(7)}]</span> {l.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
