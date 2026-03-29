# DistFS — Distributed File System 🚀

## 📌 Overview
DistFS is an interactive simulation of a Distributed File System designed to demonstrate how modern large-scale storage systems operate. It provides a comprehensive UI to visualize and manage distributed storage concepts such as file replication, node management, fault tolerance, and data integrity.

The project mimics real-world distributed systems by simulating cluster behavior, node failures, replication strategies, and recovery mechanisms.

---

## 🎯 Key Features

### 🖥️ Cluster Dashboard
- Real-time monitoring of nodes, storage usage, and system health
- Visualization of cluster activity and logs

### 📁 File Management
- Upload, delete, and manage files
- Distributed file placement across nodes
- Replica tracking and visualization

### 🖥️ Node Management
- Monitor node status (online/offline/degraded)
- Perform actions like ping, rebalance, and recovery
- Add new nodes dynamically

### 🔁 Replication System
- Configurable replication factor
- Replica health tracking
- Cluster rebalancing simulation

### 🛡️ Fault Tolerance
- Simulate node failures and recovery
- Network partition simulation (CAP theorem concepts)
- Automatic re-replication of data

### 🔒 Data Integrity
- SHA-256 checksum verification
- Corruption detection and repair mechanisms

### 📋 System Logs
- Real-time log streaming
- Filtering, exporting, and clearing logs

---

## 🧠 Concepts Demonstrated
- Distributed Systems Architecture  
- Data Replication & Consistency  
- Fault Tolerance & Recovery  
- CAP Theorem (Partition Handling)  
- Consensus Concepts (Raft simulation)  
- Data Integrity (Checksums)  

---

## 🛠️ Tech Stack
- Frontend: React (Vite)
- State Management: React Hooks
- Styling: Custom CSS (App.css, index.css)
- Architecture: Component-based modular design

---

## 🚧 Current Status
> This project is a frontend simulation of a distributed file system. Backend integration and real distributed node communication are planned for future development.

---

## 🚀 Future Enhancements
- Backend implementation (Node.js / Python)
- Real distributed node communication
- Persistent storage layer
- Advanced consensus algorithm (Raft implementation)
- Authentication and access control

---

## 💡 Inspiration
This project is inspired by real-world systems like:
- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}

---

## 👨‍💻 Author
Developed as a learning project to explore distributed systems and system design concepts.
