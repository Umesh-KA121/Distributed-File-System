export default function Header({ filesCount, onlineNodes, totalNodes }) {
  const nodeRatio = totalNodes > 0 ? onlineNodes / totalNodes : 0;
  const dotColor = nodeRatio === 1 ? 'var(--green)' : nodeRatio > 0.6 ? 'var(--yellow)' : 'var(--red)';
  return (
    <header>
      <div className="logo">Dist<span>FS</span> <span style={{fontSize:'11px',opacity:.4}}>v2.0</span></div>
      <div className="header-stats">
        <div className="hstat"><div className="dot green"></div>Cluster Online</div>
        <div className="hstat"><div className="dot" style={{background:dotColor,boxShadow:`0 0 6px ${dotColor}`}}></div><span>{onlineNodes}/{totalNodes} Nodes</span></div>
        <div className="hstat">{filesCount} Files</div>
      </div>
    </header>
  );
}
