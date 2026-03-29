import { useState } from 'react';

export default function SystemLogs({ logs, onClear, onExport }) {
  const [filterQ, setFilterQ] = useState('');
  const fl = filterQ.toLowerCase();
  const displayLogs = logs.filter(l => !fl || l.msg.toLowerCase().includes(fl));

  return (
    <div className="panel active">
      <div className="section-title">📋 System Logs</div>
      <div className="section-sub">Full event log stream from all nodes</div>
      
      <div className="toolbar">
        <input type="text" className="search-box" placeholder="🔍  Filter logs..." value={filterQ} onChange={e=>setFilterQ(e.target.value)} />
        <button className="btn btn-ghost btn-sm" onClick={onClear}>🗑 Clear</button>
        <button className="btn btn-ghost btn-sm" onClick={onExport}>⬇ Export</button>
      </div>
      
      <div className="terminal">
        <div className="term-header">
          <div className="tdots"><div className="tdot r"></div><div className="tdot y"></div><div className="tdot g"></div></div>
          <span>distfs-cluster — full event stream</span>
          <span style={{marginLeft:'auto',color:'var(--green)',fontSize:'10px'}}>● LIVE</span>
        </div>
        <div className="term-body" style={{maxHeight:'60vh'}}>
          {displayLogs.length === 0 ? <div style={{color:'var(--muted)'}}>No logs.</div> : displayLogs.map((l, i) => (
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
