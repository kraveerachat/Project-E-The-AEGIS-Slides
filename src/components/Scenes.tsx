import { useState } from 'react'
import { driveFeatures, formatTime, project, totalSeconds } from '../data/content'
import { driveGallery, monitorGallery, securityGallery } from '../data/assets'
import { Icon } from './Icons'
import { EvidencePanel, SystemScreenshotGallery, VideoInsertFrame } from './MediaFrames'
import { TechnicalDiagramStage } from './TechnicalDiagramStage'
import { useI18n } from '../i18n/I18nProvider'

type SceneProps = { id: string; goTo: (id: string) => void }

function Heading({ title, subtitle, accent }: { title: string; subtitle?: string; accent?: string }) {
  return <div className="scene-heading reveal"><h1>{title}{accent && <> <span className="gradient-text">{accent}</span></>}</h1>{subtitle && <p>{subtitle}</p>}</div>
}
function Tag({ children, tone = 'purple', icon }: { children: React.ReactNode; tone?: string; icon?: string }) { return <span className={`tag tone-${tone}`}>{icon && <Icon name={icon} size={23} />}{children}</span> }
function FeatureCard({ icon, title, text, tone = 'purple' }: { icon: string; title: string; text: string; tone?: string }) {
  return <article className={`feature-card tone-${tone} reveal`}><span className="icon-tile"><Icon name={icon} size={35} /></span><div><h2>{title}</h2><p>{text}</p></div></article>
}
function Wordmark({ small = false }: { small?: boolean }) {
  return <div className={`wordmark ${small ? 'wordmark-small' : ''}`}><img className="aegis-original-mark" src="/assets/branding/aegis-mark-dark-ink.png" alt="Original AEGIS project mark" /><span aria-label="AEGIS">AEGIS<i aria-hidden="true" /></span></div>
}
function Star({ className = '' }: { className?: string }) { return <svg className={`star ${className}`} viewBox="0 0 80 80" aria-hidden="true"><path d="M40 0C44 29 51 36 80 40C51 44 44 51 40 80C36 51 29 44 0 40C29 36 36 29 40 0Z" /></svg> }

function Cover({ goTo }: Pick<SceneProps, 'goTo'>) {
  const { language } = useI18n()
  return <div className="cover-layout">
    <div className="cover-art" aria-hidden="true"><img src="/assets/generated/monument-arcs.png" alt="" /><div className="cover-art-wash" /></div>
    <div className="cover-content"><div className="cover-wordmark reveal"><Wordmark /><Star className="cover-star" /></div>
      <h1 className="cover-title reveal"><span className="gradient-text">Edge-Centric</span> Cyber-Physical<br />Security System</h1>
      <p className="cover-title-extension reveal">with Integrated IoT and Local Data Center</p>
      <div className="title-rule reveal" /><p className="presentation-label reveal">Final Project Presentation</p>
      <button className="primary-button reveal" onClick={() => goTo('background')}>Start presentation <span><Icon name="right" size={29} /></span></button>
      <div className="student-members reveal"><span className="micro-label">PRESENTED BY</span><div>{project.members.map(member => <span className="member-row" key={member.id}><b>{member.id}</b><span lang={language}>{member[language]}</span></span>)}</div></div>
    </div>
    <div className="cover-side-note" aria-hidden="true">TECHNOLOGY<br />PEOPLE<br />LOCAL CONTROL<span /></div>
    <div className="cover-caption">Illustrative artwork · based on the approved design reference</div>
  </div>
}

function Background() {
  return <div className="background-layout"><div className="background-statement reveal"><span className="large-outline-number" aria-hidden="true">01</span><h1>Own the data.<br /><span className="gradient-text">Understand<br />the risk.</span></h1><p>Local storage gives teams control.<br />Responsible access makes that control useful.</p><div className="short-rule" /><span className="section-caption">Project background & significance</span></div>
    <div className="background-story"><div className="story-panel reveal"><Icon name="storage" size={54} /><h2>Bring the data closer.</h2><p>Small teams need a place to keep important files, manage access and recover their work.</p><div className="story-track"><span>Ownership</span><span>Access</span><span>Recovery</span></div></div>
      <div className="problem-rows"><article className="reveal"><span>01</span><div><h3>Unclear boundaries</h3><p>A flat network can expose unrelated services.</p></div><Icon name="network" /></article><article className="reveal"><span>02</span><div><h3>Fragmented responsibility</h3><p>Backups, permissions and recovery need explicit ownership.</p></div><Icon name="users" /></article><article className="reveal"><span>03</span><div><h3>Claims without evidence</h3><p>A prototype must explain what was tested—and what remains open.</p></div><Icon name="filecheck" /></article></div>
    </div>
  </div>
}

function Objectives() {
  return <><Heading title="A focused prototype." accent="A practical purpose." subtitle="Local control, layered access and evidence that can be traced." />
    <div className="objectives-layout"><div className="objective-list">
      {[['01','Own the storage','Build a local NAS platform for files and application data.','storage'],['02','Define the boundaries','Separate network access, application identity and data permissions.','secure'],['03','Process at the edge','Analyze camera input on the device and retain useful evidence.','detection'],['04','Verify before claiming','Evaluate the prototype; reserve response claims for confirmed tests.','filecheck']].map(([n,title,text,icon]) => <article className="objective-row reveal" key={n}><span className="objective-number">{n}</span><div><h2>{title}</h2><p>{text}</p></div><Icon name={icon} size={34} /></article>)}
    </div><aside className="audience-panel reveal"><div className="orbit-art" aria-hidden="true"><div /><div /><Icon name="users" size={70} /></div><h2>Designed for<br />smaller teams.</h2><div className="audience-tags"><Tag>SMEs</Tag><Tag>Small offices</Tag><Tag>Home offices</Tag><Tag>Family businesses</Tag></div><p>A learning prototype under real budget and hardware constraints.</p></aside></div>
  </>
}

const ideas = [
  { num: '01', name: 'AEGIS Drive', title: 'Store. Share.\nStay in control.', icon: 'files', tone: 'purple', scene: 'drive-architecture', text: 'File management, Private Vault, controlled sharing and recovery.', tags: ['File lifecycle','Encrypted Vault','Access policies'] },
  { num: '02', name: 'AEGIS Monitor', title: 'Observe at\nthe edge.', icon: 'camera', tone: 'coral', scene: 'monitor-architecture', text: 'Camera analysis, live viewing, recording, archive and alerts.', tags: ['Edge inference','Clip archive','Operator + SOC'] },
  { num: '03', name: 'Cyber-Physical Security', title: 'Detect. Respond.\nVerify.', icon: 'shield', tone: 'blue', scene: 'security', text: 'Reserved for verified detection, response and hardware evidence.', tags: ['In development','Evidence pending'] },
]
function IdeaCard({ idea, goTo, compact = false }: { idea: typeof ideas[number]; goTo: (id: string) => void; compact?: boolean }) {
  return <button className={`idea-card tone-${idea.tone} ${compact ? 'idea-compact' : ''} reveal`} onClick={() => goTo(idea.scene)}><div className="idea-card-top"><span className="icon-tile"><Icon name={idea.icon} size={36} /></span><span>IDEA {idea.num}</span></div><h2>{idea.name}</h2>{!compact && <h3>{idea.title}</h3>}<p>{idea.text}</p><div className="idea-card-bottom">{!compact && <ul>{idea.tags.map(tag => <li key={tag}><Icon name={idea.num === '03' ? 'layers' : 'check'} size={18} />{tag}</li>)}</ul>}<span className="round-arrow"><Icon name="right" size={27} /></span></div></button>
}
function Overview({ goTo }: Pick<SceneProps, 'goTo'>) {
  return <><div className="overview-top"><div className="overview-intro reveal"><Wordmark small /><h1>One foundation.<br /><span className="gradient-text">Three distinct ideas.</span></h1><p>Local-first infrastructure.<br />Separate services, data and permissions.</p></div><div className="overview-art reveal"><img src="/assets/generated/monument-arcs.png" alt="Decorative monument and colored arches" /><Star /></div></div><div className="overview-cards">{ideas.map(idea => <IdeaCard key={idea.num} idea={idea} goTo={goTo} />)}</div><div className="overview-baseline reveal"><Icon name="server" size={32} /><strong>Ubuntu / NAS</strong><span>Shared compute & network</span><i /><span>Drive data</span><span>Monitor data</span><span className="pending-text">IDEA 3 · pending</span></div></>
}

function Network() {
  return <><Heading title="The network behind AEGIS." subtitle="A shared NAS host inside a network divided by responsibility." /><div className="network-layout"><TechnicalDiagramStage kind="network" /><aside className="network-sidebar"><div className="hardware-card reveal"><Icon name="server" size={48} /><h2>Beelink Mini S</h2><p>Ubuntu Server<br />Docker services<br />Persistent storage</p></div><div className="port-list reveal"><h3>Four zones</h3>{[['10','Server','purple'],['20','Detector','coral'],['30','Management','blue'],['40','Response area','muted']].map(([n,label,tone]) => <div key={n}><span className={`vlan-number tone-${tone}`}>{n}</span><span>{label}</span></div>)}</div><p className="small-note">VLAN 40 is prepared. Response hardware remains unverified. Internal addresses are omitted.</p></aside></div></>
}

function Access() {
  return <><Heading title="Access is a sequence of decisions." subtitle="Two entry paths. Different purposes. Authorization at every relevant boundary." /><div className="access-paths"><article className="access-card private-path reveal"><div className="access-title"><span className="icon-tile"><Icon name="key" size={36} /></span><div><h2>Private service access</h2><p>Authorized staff and operators</p></div><Tag>Twingate</Tag></div><div className="path-steps">{[['users','Authorized client'],['network','Twingate resource'],['secure','HTTPS / HUB'],['fingerprint','App session'],['vault','Data authorization']].map(([icon,label],i) => <div className="path-step" key={label}><span><Icon name={icon} size={33} /></span><strong>{label}</strong>{i<4 && <Icon name="right" className="step-arrow" size={25} />}</div>)}</div><p className="path-caption">Network authorization does not replace application login or file ownership checks.</p></article>
      <article className="access-card public-path reveal"><div className="access-title"><span className="icon-tile"><Icon name="share" size={36} /></span><div><h2>Controlled public sharing</h2><p>Recipients of an approved share link</p></div><Tag tone="coral">Separate gateway</Tag></div><div className="path-steps">{[['users','External recipient'],['cloud','Cloudflare Tunnel'],['shield','Share gateway'],['key','Share policy'],['files','Authorized file']].map(([icon,label],i) => <div className="path-step" key={label}><span><Icon name={icon} size={33} /></span><strong>{label}</strong>{i<4 && <Icon name="right" className="step-arrow" size={25} />}</div>)}</div><p className="path-caption">Password, expiry and revocation apply to the share. The full Drive application stays private.</p></article></div><EvidencePanel title="A layered design, with remaining checks" status="limited"><p>The report does not establish complete firewall isolation or router management-plane hardening.</p></EvidencePanel></>
}

function Shared({ goTo }: Pick<SceneProps, 'goTo'>) {
  return <><Heading title="Shared infrastructure." accent="Clear boundaries." subtitle="One physical foundation supports independently scoped application data." /><div className="shared-layout"><div className="nas-hero reveal"><div className="nas-orbit" aria-hidden="true" /><span className="nas-icon"><Icon name="server" size={112} strokeWidth={1.15} /></span><h2>Ubuntu / NAS</h2><p>Compute · networking · persistent storage</p><div className="nas-services"><Tag icon="network">VLANs</Tag><Tag icon="secure">HTTPS</Tag><Tag icon="key">Remote access</Tag></div><img src="/assets/branding/aegis-mark-dark-ink.png" className="nas-brand" alt="AEGIS project mark" /></div><div className="shared-ideas">{ideas.map(idea => <IdeaCard key={idea.num} idea={idea} goTo={goTo} compact />)}</div></div><div className="boundary-strip reveal"><Icon name="database" size={29} /><strong>Shared server ≠ shared database</strong><span>Drive files and Monitor archives have separate data and permission boundaries.</span></div></>
}

function Architecture({ idea }: { idea: 'drive' | 'monitor' }) {
  const drive = idea === 'drive'
  return <><div className="chapter-heading reveal"><div><div className={`chapter-tag tone-${drive ? 'purple' : 'coral'}`}><span />IDEA {drive ? '1' : '2'}</div><h1>AEGIS <span className="gradient-text">{drive ? 'Drive' : 'Monitor'}</span></h1><p>{drive ? 'File control, from the browser to the NAS.' : 'Analyze locally. View securely. Preserve the evidence.'}</p></div><span className={`chapter-icon tone-${drive ? 'purple' : 'coral'}`}><Icon name={drive ? 'files' : 'camera'} size={65} /></span></div>
      <TechnicalDiagramStage kind={idea} />
      <div className="architecture-footnotes"><Tag icon={drive ? 'vault' : 'detection'} tone={drive ? 'purple' : 'coral'}>{drive ? 'Browser-side Vault encryption' : 'Inference stays on the Edge Node'}</Tag><Tag icon="database">Separate application data</Tag><span>{drive ? 'Public sharing follows its own dedicated gateway path.' : 'Face recognition analyzes imagery; it does not authenticate web login.'}</span></div>
  </>
}

function DriveFeatures() {
  const [active, setActive] = useState(0)
  return <div className="features-layout"><div className="features-intro reveal"><div className="chapter-tag"><span />IDEA 1 · CORE FEATURES</div><h1>Control<br />every stage<br /><span className="gradient-text">of a file.</span></h1><p>AEGIS Drive turns local storage into a managed file lifecycle.</p><div className="lifecycle-mini"><span>Upload</span><Icon name="right" /><span>Protect</span><Icon name="right" /><span>Share</span></div><div className="feature-detail" aria-live="polite"><strong>{driveFeatures[active].title}</strong><p>{driveFeatures[active].detail}</p></div></div><div className="features-bento">{driveFeatures.map((feature,i) => <button className={`feature-choice tone-${feature.tone} ${i === active ? 'selected' : ''} reveal`} key={feature.title} onClick={() => setActive(i)} aria-pressed={i === active}><span className="icon-tile"><Icon name={feature.icon} size={45} /></span><h2>{feature.title}</h2><p>{feature.text}</p><span className="feature-more">Explore feature <Icon name="right" size={22} /></span></button>)}<div className="feature-limit reveal"><Icon name="help" size={27} /><span>32 GiB is a configured upload limit—not a verified maximum-size test. RAID 1 and scheduled backups remain unverified.</span></div></div></div>
}

function Demo({ idea }: { idea: 'idea1' | 'idea2' }) {
  const drive = idea === 'idea1'
  return <><Heading title={drive ? 'Inside AEGIS Drive.' : 'From live view to a traceable event.'} subtitle={drive ? 'File management, Private Vault and controlled sharing—through the actual application.' : 'Operator live view, edge detection, SOC and archive—through actual system captures.'} /><div className="demo-layout"><SystemScreenshotGallery ids={drive ? driveGallery : monitorGallery} /><div className="demo-side"><VideoInsertFrame assetId={`${idea}-demo`} /><div className="demo-sequence reveal"><h2>{drive ? 'The demonstration path' : 'The camera lifecycle'}</h2>{(drive ? [['folder','Manage files'],['vault','Open Private Vault'],['share','Create & revoke a share']] : [['camera','Viewer demand opens the camera'],['detection','Analyze & record at the edge'],['archive','Verify & register the clip']]).map(([icon,label],i) => <div key={label}><span>{i+1}</span><Icon name={icon} size={25} /><strong>{label}</strong></div>)}</div><p className="small-note">Original media will replace these reserved frames. Their dimensions are ready for recording.</p></div></div></>
}

function DriveResults() {
  return <><Heading title="Measured transfers." accent="Verified integrity." subtitle="Results reported in Round 11. Each figure stays within its tested scope." /><div className="results-layout"><section className="throughput-panel reveal"><div className="result-panel-heading"><h2>File transfer throughput</h2><span>MB/s</span></div><div className="chart-legend"><span><i className="upload-color" />Upload</span><span><i className="download-color" />Download</span></div><div className="bar-chart" role="img" aria-label="Direct LAN median upload 10.6 and download 11.0 megabytes per second. Remote Twingate upload 2.786 and download 4.206 megabytes per second.">{[{ label:'Direct LAN', note:'18 trials · 9 each direction · median', up:10.6,down:11.0 },{label:'Remote · Twingate',note:'Reported single-transfer observations',up:2.786,down:4.206}].map(row => <div className="chart-row" key={row.label}><h3>{row.label}</h3><span>{row.note}</span><div className="bar-track"><div className="bar bar-upload" style={{width:`${row.up/12*100}%`}} /><b>{row.up.toFixed(row.up<5?3:1)}</b></div><div className="bar-track"><div className="bar bar-download" style={{width:`${row.down/12*100}%`}} /><b>{row.down.toFixed(row.down<5?3:1)}</b></div></div>)}</div><p className="chart-note">The LAN results align with the 100 Mbps router trunk. The exact remote bottleneck is unresolved.</p></section><div className="evidence-stack"><EvidencePanel title="Bit-exact round trip"><p>A 1 MiB upload and download returned a matching SHA-256 hash.</p></EvidencePanel><EvidencePanel title="Sharing controls exercised"><p>Wrong-password and out-of-scope requests were denied. Revoked links stopped working.</p></EvidencePanel><EvidencePanel title="Recovery has a defined scope" status="limited"><p>Manual backup/restore has evidence. Scheduled execution and installed RAID 1 do not.</p></EvidencePanel><div className="source-chip"><Icon name="book" size={23} />§4.4.2 · §4.4.4 · §4.4.14 · §5.3</div></div></div></>
}

function MonitorResults() {
  return <><Heading title="A working lifecycle." accent="Defined limits." subtitle="Functional tests on two real Windows webcam nodes, as reported in Round 11." /><div className="monitor-results"><section className="clip-evidence reveal"><h2>Recorded and archived</h2><p>Three documented clip cases, with distinct conditions.</p><div className="clip-cases">{[['300','Full segment','Node A · completed recording'],['83','Logout segment','Node A · partial recording'],['150','External webcam','Node C · archived recording']].map(([duration,title,detail]) => <article key={duration}><div className="clip-symbol"><Icon name="play" size={28} /></div><div><strong>{duration}<small>sec</small></strong><h3>{title}</h3><p>{detail}</p></div><Icon name="check" className="clip-check" size={27} /></article>)}</div><div className="clip-chain"><span>SCP / SSH</span><Icon name="right" size={22} /><span>SHA-256</span><Icon name="right" size={22} /><span>Metadata</span><Icon name="right" size={22} /><span>Archive</span></div></section><div className="monitor-evidence-right"><div className="tested-list reveal"><h2>Reported functional checks</h2>{['Operator live & SOC passive viewing','Logout → idle → reopen','Clip playback, seeking & download','Unknown-face Telegram alerts'].map(text => <p key={text}><Icon name="check" size={25} />{text}</p>)}</div><EvidencePanel title="5 seconds = duplicate suppression" status="limited"><p>This is the alert cooldown that was tested. It is not a measured delivery latency.</p></EvidencePanel><EvidencePanel title="Measurement work remains" status="limited"><p>No statistical recognition accuracy or repeatable live latency/FPS dataset. Session expiry and full Archive API roles still need testing.</p></EvidencePanel></div></div></>
}

function Security() {
  return <><div className="security-heading reveal"><div className="chapter-tag tone-blue"><span />IDEA 3</div><h1>Cyber-Physical <br /><span className="gradient-text">Security.</span></h1><Tag tone="blue" icon="layers">In development · evidence pending</Tag></div><div className="security-layout"><div className="security-narrative"><h2>A reserved chapter.<br />An explicit evidence standard.</h2><p>Detection and response content will be replaced when the implementation and its tests are verified.</p><div className="security-steps">{[['Detection','Incident input and verified case'],['Response','Observed action and outcome'],['Hardware','Tested device and control evidence']].map(([title,text],i) => <div key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name="layers" size={26} /></div>)}</div><EvidencePanel title="Prepared does not mean proven" status="pending"><p>VLAN 40 is present in the report’s network topology. End-to-end response and hardware claims remain pending.</p></EvidencePanel></div><div className="security-media"><SystemScreenshotGallery ids={securityGallery} /><VideoInsertFrame assetId="idea3-demo" compact /></div></div></>
}

function Summary() {
  return <><Heading title="What we built." accent="What comes next." subtitle="A local-first prototype with separate boundaries and traceable evidence." /><div className="summary-layout"><div className="summary-built"><FeatureCard icon="storage" title="Local data control" text="Drive file lifecycle, encrypted Vault and controlled shares." /><FeatureCard icon="camera" title="Edge monitoring" text="Real camera lifecycle, archived clips and event alerts." tone="coral" /><FeatureCard icon="network" title="Shared foundations" text="Zoned network, Ubuntu services and resource-scoped access." tone="blue" /></div><section className="next-panel reveal"><h2>The next validation steps</h2><div className="next-list">{[['Capacity & resilience','Router throughput, off-host recovery and hardware redundancy.'],['Complete measurements','Live/alert latency, recognition evaluation and API/role coverage.'],['Verify the integration','Correlate event reception and response evidence at both ends.']].map(([title,text],i) => <article key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><p className="integration-note"><Icon name="flow" size={27} />The Drive event interface exists. Complete cross-system evidence is still pending.</p></section></div><div className="closing-principle reveal"><span>THE PROJECT PRINCIPLE</span><strong>Build the boundary. Test the behavior. Keep the evidence.</strong></div></>
}

function Ending({ goTo }: Pick<SceneProps, 'goTo'>) {
  const { language } = useI18n()
  return <div className="ending-layout"><div className="ending-art" aria-hidden="true"><img src="/assets/generated/monument-arcs.png" alt="" /></div><div className="ending-content"><Wordmark small /><h1 className="reveal">Thank you<span className="gradient-text">.</span></h1><p className="ending-subtitle reveal">Local control.<br />Clear boundaries.<br />Evidence-led engineering.</p><div className="ending-actions reveal"><button className="primary-button" onClick={() => goTo('overview')}>Explore the project <span><Icon name="right" /></span></button><button className="text-button" onClick={() => goTo('cover')}><Icon name="restore" size={23} />Back to the beginning</button></div><div className="ending-members reveal">{project.members.map(member => <span className="member-row" key={member.id}><b>{member.id}</b><span lang={language}>{member[language]}</span></span>)}</div><span className="ending-university">{project.university}</span></div><Star className="ending-star" /><div className="ending-prompt">Questions & discussion</div></div>
}

export function SceneContent({ id, goTo }: SceneProps) {
  switch (id) {
    case 'cover': return <Cover goTo={goTo} />
    case 'background': return <Background />
    case 'objectives': return <Objectives />
    case 'overview': return <Overview goTo={goTo} />
    case 'network': return <Network />
    case 'access': return <Access />
    case 'shared': return <Shared goTo={goTo} />
    case 'drive-architecture': return <Architecture idea="drive" />
    case 'drive-features': return <DriveFeatures />
    case 'drive-demo': return <Demo idea="idea1" />
    case 'drive-results': return <DriveResults />
    case 'monitor-architecture': return <Architecture idea="monitor" />
    case 'monitor-demo': return <Demo idea="idea2" />
    case 'monitor-results': return <MonitorResults />
    case 'security': return <Security />
    case 'summary': return <Summary />
    case 'ending': return <Ending goTo={goTo} />
    default: return <div><h1>Scene unavailable</h1><button onClick={() => goTo('cover')}>Return to cover</button></div>
  }
}
export function PresentationBudget() { return <span>{formatTime(totalSeconds)} planned · 15 min maximum</span> }
