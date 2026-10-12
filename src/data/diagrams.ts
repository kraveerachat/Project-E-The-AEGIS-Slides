export interface DiagramNode { id: string; x: number; y: number; w?: number; title: string; subtitle: string; icon: string; tone?: string; detail: string; planned?: boolean }
export interface DiagramEdge { from: string; to: string; planned?: boolean; label?: string }
export interface Diagram { label: string; source: string; nodes: DiagramNode[]; edges: DiagramEdge[] }
export const diagrams: Record<string, Diagram> = {
  network: {
    label: 'NAS-centered network topology', source: '§3.6.1–3.6.4 · §4.2.12',
    nodes: [
      { id: 'wan', x: 175, y: 70, title: 'WAN / upstream', subtitle: 'External network', icon: 'cloud', detail: 'Upstream Internet access. Private access uses resource-scoped Twingate; this diagram does not imply inbound port forwarding.' },
      { id: 'router', x: 600, y: 70, title: 'MikroTik hEX lite', subtitle: 'RB750r2 · Edge router', icon: 'router', tone: 'purple', detail: 'Routes traffic between VLANs and the upstream network. Its 100 Mbps physical trunk limits the tested routed paths; management-plane/firewall hardening is not fully verified.' },
      { id: 'switch', x: 1030, y: 70, title: 'TP-Link switch', subtitle: 'TL-SG105E · 802.1Q', icon: 'network', tone: 'blue', detail: 'Port 1 tagged trunk; port 2 Server VLAN 10; port 3 Detector VLAN 20; port 4 Reserved VLAN 40; port 5 Management VLAN 30. Ports 3/4 were Link Down at the field check.' },
      { id: 'nas', x: 175, y: 300, title: 'Ubuntu / NAS', subtitle: 'VLAN 10 · Server', icon: 'server', tone: 'purple', detail: 'Beelink Mini S hosts Ubuntu and Docker services. Drive file data and Monitor clip archives stay separate; applications do not share one database.' },
      { id: 'edge', x: 460, y: 300, title: 'Edge Nodes', subtitle: 'VLAN 20 · Detector', icon: 'camera', tone: 'coral', detail: 'Windows edge devices process their own webcams and communicate with Monitor over the report-defined protected paths.' },
      { id: 'admin', x: 745, y: 300, title: 'Administration', subtitle: 'VLAN 30 · Management', icon: 'monitor', tone: 'blue', detail: 'A separate management zone for administration. A configured VLAN is not proof that every deny path has been tested.' },
      { id: 'response', x: 1030, y: 300, title: 'Reserved port', subtitle: 'VLAN 40 · Reserved', icon: 'layers', tone: 'muted', planned: true, detail: 'Port 4 has PVID 40 and is reserved. No physical response application is included in the implemented project scope.' },
    ],
    edges: [{ from: 'wan', to: 'router' }, { from: 'router', to: 'switch', label: '100 Mbps trunk' }, { from: 'switch', to: 'nas' }, { from: 'switch', to: 'edge' }, { from: 'switch', to: 'admin' }, { from: 'switch', to: 'response', planned: true }],
  },
  drive: {
    label: 'AEGIS Drive application boundaries', source: '§3.8.6–3.8.10',
    nodes: [
      { id: 'client', x: 180, y: 100, title: 'Browser client', subtitle: 'LAN or Twingate resource', icon: 'monitor', detail: 'Network reachability is only the first layer. Drive still authenticates the session and authorizes each file request.' },
      { id: 'hub', x: 570, y: 100, title: 'HTTPS / HUB', subtitle: 'Ubuntu · NGINX', icon: 'secure', tone: 'purple', detail: 'The shared HTTPS/HUB entry forwards requests to the appropriate application. A shared entry does not merge application databases.' },
      { id: 'api', x: 965, y: 100, title: 'Drive API', subtitle: 'Session · RBAC · ownership', icon: 'key', tone: 'blue', detail: 'Application sessions, role-based access and object-level file ownership checks authorize requests before data is returned.' },
      { id: 'vault', x: 180, y: 285, title: 'Private Vault', subtitle: 'Encryption in the browser', icon: 'vault', tone: 'purple', detail: 'Argon2id derives the key-encryption key. Each file gets a separate AES-256-GCM data key. The server does not hold a plaintext recovery key.' },
      { id: 'storage', x: 570, y: 285, title: 'Persistent files', subtitle: 'Files + Vault ciphertext', icon: 'storage', tone: 'purple', detail: 'File bytes persist beyond the container lifecycle. Vault content reaches the server as ciphertext; file metadata and permissions belong to Drive.' },
      { id: 'db', x: 965, y: 285, title: 'Drive PostgreSQL', subtitle: 'Application metadata', icon: 'database', tone: 'blue', detail: 'Drive metadata, accounts and policy records are separate from Monitor data. This is not a shared database for all three ideas.' },
    ],
    edges: [{ from: 'client', to: 'hub' }, { from: 'hub', to: 'api' }, { from: 'api', to: 'storage' }, { from: 'api', to: 'db' }, { from: 'client', to: 'vault' }, { from: 'vault', to: 'storage', label: 'Ciphertext via authorized API' }],
  },
  monitor: {
    label: 'AEGIS Monitor edge and archive flow', source: '§3.9 · §4.5',
    nodes: [
      { id: 'camera', x: 170, y: 95, title: 'Physical webcam', subtitle: 'Bound to its Edge Node', icon: 'camera', tone: 'coral', detail: 'Each Windows node uses its own physical webcam. Changing a logical camera alias does not move the physical camera to another node.' },
      { id: 'engine', x: 560, y: 95, title: 'Detection Engine', subtitle: 'YOLO · YuNet · SFace', icon: 'detection', tone: 'coral', detail: 'Inference happens on the Windows edge device. Face recognition labels image content; it does not authenticate the web session.' },
      { id: 'monitor', x: 970, y: 95, title: 'Monitor Web / API', subtitle: 'Sessions · camera rights', icon: 'monitor', tone: 'purple', detail: 'Authorizes viewers, receives events/heartbeat and proxies live MJPEG. Identity Agent pairs the browser with its node; SSH forwarding protects node-server paths.' },
      { id: 'record', x: 170, y: 285, title: 'SegmentRecorder', subtitle: 'Full or partial video clip', icon: 'files', tone: 'coral', detail: 'Closes full 300-second segments or partial clips when demand ends. Reported clips do not contain microphone audio.' },
      { id: 'archive', x: 560, y: 285, title: 'Monitor archive', subtitle: 'SCP / SSH · SHA-256', icon: 'archive', tone: 'purple', detail: 'Clip bytes are transferred and checked, then registered in Monitor metadata. This archive is separate from Drive personal file storage.' },
      { id: 'metadata', x: 970, y: 285, title: 'Monitor DB', subtitle: 'PostgreSQL metadata', icon: 'database', tone: 'blue', detail: 'Monitor maintains its own data boundary. Archive playback, seeking and download were reported; a complete API/role audit remains open.' },
    ],
    edges: [{ from: 'camera', to: 'engine' }, { from: 'engine', to: 'monitor', label: 'Live / events' }, { from: 'engine', to: 'record' }, { from: 'record', to: 'archive', label: 'Clip + checksum' }, { from: 'archive', to: 'metadata' }, { from: 'monitor', to: 'metadata' }],
  },
  security: {
    label: 'Assessment trust boundaries', source: '§3.7 · §3.10.1–3.10.2',
    nodes: [
      {id:'client',x:170,y:95,title:'Authorized client',subtitle:'Arch Linux · assessor',icon:'monitor',detail:'One authorized client and ordinary Drive account define this assessment vantage point.'},
      {id:'resource',x:560,y:95,title:'Network resource',subtitle:'Twingate authorization',icon:'key',tone:'blue',detail:'OFF/ON observations establish resource reachability from the tested client, not every Internet or VLAN boundary.'},
      {id:'transport',x:970,y:95,title:'Transport / TLS',subtitle:'HTTPS · gateway',icon:'secure',tone:'purple',detail:'TLS is assessed through Twingate and the HTTPS gateway. Backend services and hostname/SAN validation have separate scope.'},
      {id:'session',x:170,y:285,title:'Session / RBAC',subtitle:'Authentication · role',icon:'fingerprint',tone:'purple',detail:'Session replay after logout and two administrator endpoints were tested with one ordinary account.'},
      {id:'object',x:560,y:285,title:'Object authorization',subtitle:'Files · shares · cameras',icon:'vault',tone:'coral',detail:'Assessor file checks use the owned CANARY. Cross-user IDOR is NOT TESTED; developer ownership tests are separate evidence.'},
      {id:'data',x:970,y:285,title:'Data integrity',subtitle:'65-byte CANARY · SHA-256',icon:'storage',tone:'blue',detail:'Matching hash and byte comparison verify only the uploaded and downloaded CANARY file.'},
    ],
    edges:[{from:'client',to:'resource'},{from:'resource',to:'transport'},{from:'transport',to:'session'},{from:'session',to:'object'},{from:'object',to:'data'}],
  },
}
