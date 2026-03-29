export default function IntegrityCheck({ files, onRunCheck, onRepair }) {
  return (
    <div className="panel active">
      <div className="section-title">🔒 Integrity Check</div>
      <div className="section-sub">Verify SHA-256 checksums of all files across all replicas</div>
      
      <div className="toolbar">
        <button className="btn btn-primary" onClick={onRunCheck}>▶ Run Full Check</button>
        <button className="btn btn-ghost btn-sm" onClick={onRepair}>🔧 Repair Corrupted</button>
      </div>
      
      <div style={{marginTop:'16px'}}>
        {files.map(f => {
          const ok = f.replicas.every(r=>r===1);
          return (
            <div key={f.id} className="integrity-row">
              <span className="fname">📄 {f.name}</span>
              <span className="hash">{f.hash}a1f4b3e8c9d2f0a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2</span>
              <span className={`istatus ${ok?'ok':'fail'}`}>{ok?'VERIFIED':'CORRUPT'}</span>
            </div>
          )
        })}
      </div>
    </div>
  );
}
