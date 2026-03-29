import { useState } from 'react';

export function AddNodeModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [cap, setCap] = useState('');
  const [role, setRole] = useState('replica');

  if (!isOpen) return null;

  const handleAdd = () => {
    onAdd(name, parseInt(cap) || 100, role);
    setName(''); setCap(''); setRole('replica');
  };

  return (
    <div className="modal-overlay open" onClick={(e)=>e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-title">Add New Node</div>
        <div className="modal-sub">Register a new storage node to the cluster</div>
        
        <div className="form-group">
          <label className="form-label">Node Name</label>
          <input type="text" className="form-input" placeholder="e.g. node-06" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Capacity (GB)</label>
          <input type="number" className="form-input" placeholder="e.g. 200" min="1" value={cap} onChange={e=>setCap(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="replica">Replica</option>
            <option value="primary">Primary</option>
          </select>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add Node</button>
        </div>
      </div>
    </div>
  );
}

export function FileDetailModal({ file, isOpen, onClose, onDownload }) {
  if (!isOpen || !file) return null;

  const typeIcons = { archive:'📦', disk:'💾', pdf:'📄', db:'🗄️', text:'📃', bin:'⚙️' };
  
  return (
    <div className="modal-overlay open" onClick={(e)=>e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-title">{file.name}</div>
        <div className="modal-sub">/{file.node}/{file.name}</div>
        
        <div>
          <div className="metric-row"><span className="metric-label">Size</span><span className="metric-value">{file.size}</span></div>
          <div className="metric-row"><span className="metric-label">Type</span><span className="metric-value">{typeIcons[file.type]||'📄'} {file.type}</span></div>
          <div className="metric-row"><span className="metric-label">Primary Node</span><span className="metric-value ok">{file.node}</span></div>
          <div className="metric-row"><span className="metric-label">SHA-256</span><span className="metric-value" style={{fontSize:'10px'}}>{file.hash}a4f3b...</span></div>
          <div className="metric-row"><span className="metric-label">Last Modified</span><span className="metric-value">{file.date}</span></div>
          <div className="metric-row"><span className="metric-label">Replicas</span><span className="metric-value ok">{file.replicas.filter(r=>r===1).length}/{file.replicas.length} healthy</span></div>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onDownload}>⬇ Download</button>
        </div>
      </div>
    </div>
  );
}
