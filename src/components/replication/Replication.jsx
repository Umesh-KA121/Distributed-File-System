export default function Replication({ files, nodes, onRebalance }) {
  const hr = files.reduce((s,f) => s+f.replicas.filter(r=>r===1).length, 0);
  const repPct = files.length ? Math.round((hr/Math.max(files.length*3,1))*100) : 100;
  const nNames = nodes.map(n=>n.name);

  return (
    <div className="panel active">
      <div className="section-title">🔁 Replication Manager</div>
      <div className="section-sub">Configure replication policies and monitor replica health</div>
      
      <div className="cards-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        <div className="stat-card c1"><div className="stat-label">Replication Factor</div><div className="stat-value blue">3×</div><div className="stat-change">copies per file</div></div>
        <div className="stat-card c2"><div className="stat-label">Healthy Replicas</div><div className="stat-value green">{hr}</div><div className="stat-change">{repPct}%</div></div>
        <div className="stat-card c3"><div className="stat-label">Pending Sync</div><div className="stat-value yellow">0</div><div className="stat-change">queued</div></div>
      </div>
      
      <div className="card-wrap">
        <div className="card-header">
          <div className="card-title">REPLICA MAP</div>
          <button className="btn btn-primary btn-sm" onClick={onRebalance}>⚖ Rebalance</button>
        </div>
        <table>
          <thead><tr><th>File</th><th>Primary</th><th>Replica 1</th><th>Replica 2</th><th>Status</th></tr></thead>
          <tbody>
            {files.map(f => {
              const reps = nNames.filter(n => n !== f.node).slice(0,2);
              const ok = f.replicas.every(r=>r===1);
              return (
                <tr key={f.id}>
                  <td className="td-name">📄 {f.name}</td>
                  <td style={{color:'var(--accent)',fontFamily:'var(--mono)',fontSize:'11px'}}>{f.node}</td>
                  <td style={{color:'var(--accent2)',fontFamily:'var(--mono)',fontSize:'11px'}}>{reps[0]||'—'}</td>
                  <td style={{color:'var(--accent2)',fontFamily:'var(--mono)',fontSize:'11px'}}>{reps[1]||'—'}</td>
                  <td><span className={`badge ${ok?'badge-online':'badge-degraded'}`}>{ok?'HEALTHY':'DEGRADED'}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
