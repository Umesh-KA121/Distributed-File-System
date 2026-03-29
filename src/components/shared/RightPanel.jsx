export default function RightPanel({ ioData, nodes, events }) {
  const maxIo = Math.max(...ioData, 1);
  return (
    <aside className="right-panel">
      <div className="rp-title">Cluster Activity</div>
      <div className="mini-chart">
        <div className="mini-chart-title">I/O Operations (last 7 cycles)</div>
        <div className="bar-chart">
          {ioData.map((v, i) => {
            const h = Math.round((v/maxIo)*46)+4;
            const c = v>70 ? 'var(--accent)' : v>45 ? 'var(--accent2)' : 'var(--border)';
            return <div key={i} className="bar" style={{height:`${h}px`,background:c}} title={`${v} ops`}></div>
          })}
        </div>
      </div>
      <div className="mini-chart">
        <div className="mini-chart-title">Storage per Node</div>
        <div>
          {nodes.map(n => {
            const p = Math.round((n.used/n.cap)*100);
            const fc = p>85 ? 'fill-red' : p>60 ? 'fill-yellow' : 'fill-green';
            return (
              <div key={n.id} className="usage-bar-wrap">
                <div className="usage-label">
                  <span style={{fontSize:'9px'}}>{n.name}</span>
                  <span>{p}%</span>
                </div>
                <div className="usage-track">
                  <div className={`usage-fill ${fc}`} style={{width:`${p}%`}}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="rp-title" style={{marginTop:'16px'}}>Recent Events</div>
      <div className="event-feed">
        {events.length === 0 ? <div style={{fontFamily:'var(--mono)',fontSize:'11px',color:'var(--muted)'}}>No events</div> : 
          events.slice(0,6).map((e, i) => (
            <div key={i} className="event-item">
              <div className={`event-type ${e.type}`}>{e.title}</div>
              <div className="event-msg">{e.msg}</div>
              <div className="event-time">{e.time}</div>
            </div>
          ))
        }
      </div>
    </aside>
  );
}
