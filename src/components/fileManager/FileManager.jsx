import { useState } from 'react';

const FICONS = { archive:'📦', disk:'💾', pdf:'📄', db:'🗄️', text:'📃', bin:'⚙️' };

export default function FileManager({ files, onUpload, onDelete, onShowFileDetail }) {
  const [filterQ, setFilterQ] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sel, setSel] = useState(new Set());
  const [drag, setDrag] = useState(false);

  let displayFiles = files.filter(f => f.name.toLowerCase().includes(filterQ.toLowerCase()));
  if(sortKey==='size') displayFiles.sort((a,b)=>b.sizeB-a.sizeB);
  else if(sortKey==='date') displayFiles.sort((a,b)=>b.date.localeCompare(a.date));
  else displayFiles.sort((a,b)=>a.name.localeCompare(b.name));

  const toggleFileSelect = (id) => {
    const next = new Set(sel);
    if(next.has(id)) next.delete(id); else next.add(id);
    setSel(next);
  };
  const toggleAll = (c) => {
    if(c) setSel(new Set(files.map(f=>f.id)));
    else setSel(new Set());
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    if(e.dataTransfer.files.length) onUpload(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="panel active">
      <div className="section-title">📁 File Manager</div>
      <div className="section-sub">Upload, manage and distribute files across the cluster</div>
      
      <div className={`upload-zone ${drag?'drag':''}`}
           onClick={() => document.getElementById('file-input').click()}
           onDragOver={(e)=>{e.preventDefault();setDrag(true)}}
           onDragLeave={(e)=>{e.preventDefault();setDrag(false)}}
           onDrop={handleDrop}>
        <input type="file" id="file-input" multiple onChange={(e)=>onUpload(Array.from(e.target.files))} />
        <div className="upload-icon">⬆</div>
        <div className="upload-title">Drop files here or click to upload</div>
        <div className="upload-sub">Files will be distributed and replicated across available nodes</div>
      </div>
      
      <div className="toolbar">
        <input type="text" className="search-box" placeholder="🔍  Search files..." value={filterQ} onChange={e=>setFilterQ(e.target.value)} />
        <button className="btn btn-ghost btn-sm" onClick={()=>setSortKey('name')}>Name ↕</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>setSortKey('size')}>Size ↕</button>
        <button className="btn btn-ghost btn-sm" onClick={()=>setSortKey('date')}>Date ↕</button>
      </div>
      
      <div className="card-wrap">
        <div className="card-header">
          <div className="card-title">DISTRIBUTED FILES</div>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>toggleAll(true)}>Select All</button>
            <button className="btn btn-danger btn-sm" onClick={()=>{onDelete(Array.from(sel)); setSel(new Set())}}>Delete Selected</button>
          </div>
        </div>
        <table>
          <thead><tr>
            <th><input type="checkbox" checked={sel.size === files.length && files.length>0} onChange={e=>toggleAll(e.target.checked)} /></th>
            <th>File Name</th><th>Size</th><th>Replicas</th><th>Primary Node</th><th>Modified</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {displayFiles.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center',color:'var(--muted)',padding:'32px',fontFamily:'var(--mono)',fontSize:'12px'}}>No files found</td></tr>
            ) : displayFiles.map(f => {
              const dots = f.replicas.map((r,i) => <div key={i} className={`rdot ${r===1?'ok':r===0?'fail':'pending'}`}></div>);
              return (
                <tr key={f.id} onClick={()=>onShowFileDetail(f.id)}>
                  <td><input type="checkbox" className="file-chk" checked={sel.has(f.id)} onChange={()=>toggleFileSelect(f.id)} onClick={e=>e.stopPropagation()} /></td>
                  <td><div className="td-name">{FICONS[f.type]||'📄'} {f.name}</div></td>
                  <td className="td-muted">{f.size}</td>
                  <td><div className="rep-dots">{dots}</div></td>
                  <td className="td-muted">{f.node}</td>
                  <td className="td-muted">{f.date}</td>
                  <td><div style={{display:'flex',gap:'6px'}}>
                    <button className="btn btn-ghost btn-sm" onClick={(e)=>{e.stopPropagation();onShowFileDetail(f.id, true)}}>⬇</button>
                    <button className="btn btn-danger btn-sm" onClick={(e)=>{e.stopPropagation();onDelete([f.id])}}>✕</button>
                  </div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
