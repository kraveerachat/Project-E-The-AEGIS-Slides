import { driveFeatures, formatTime, networkFunctions, project, securityFindings, totalSeconds } from '../data/content'
import { Icon } from './Icons'
import { AssessmentEvidenceReview, EvidencePanel, VideoInsertFrame } from './MediaFrames'
import { HardwarePhotoFrame } from './HardwarePhotoFrame'
import { TechnicalDiagramStage } from './TechnicalDiagramStage'
import { useI18n } from '../i18n/I18nProvider'

type SceneProps = { id: string; goTo: (id: string) => void }
function Heading({ title, subtitle, accent }: { title: string; subtitle?: string; accent?: string }) {
  return <div className="scene-heading reveal"><h1>{title}{accent && <> <span className="gradient-text">{accent}</span></>}</h1>{subtitle && <p>{subtitle}</p>}</div>
}
function Tag({ children, tone = 'purple', icon }: { children: React.ReactNode; tone?: string; icon?: string }) { return <span className={`tag tone-${tone}`}>{icon && <Icon name={icon} size={23} />}{children}</span> }
function FeatureCard({ icon, title, text, tone = 'purple' }: { icon: string; title: string; text: string; tone?: string }) { return <article className={`feature-card tone-${tone} reveal`}><span className="icon-tile"><Icon name={icon} size={35} /></span><div><h2>{title}</h2><p>{text}</p></div></article> }
function Wordmark({ small = false }: { small?: boolean }) { return <div className={`wordmark ${small ? 'wordmark-small' : ''}`}><img className="aegis-original-mark" src="/assets/branding/aegis-mark-dark-ink.png" alt="Original AEGIS project mark" /><span aria-label="AEGIS">AEGIS<i aria-hidden="true" /></span></div> }
function Star({ className = '' }: { className?: string }) { return <svg className={`star ${className}`} viewBox="0 0 80 80" aria-hidden="true"><path d="M40 0C44 29 51 36 80 40C51 44 44 51 40 80C36 51 29 44 0 40C29 36 36 29 40 0Z" /></svg> }
function Reference({ children }: { children: React.ReactNode }) { return <div className="source-chip"><Icon name="book" size={21} />{children}</div> }

function Cover({ goTo }: Pick<SceneProps,'goTo'>) {
  const { language } = useI18n()
  return <div className="cover-layout"><div className="cover-art" aria-hidden="true"><img src="/assets/generated/monument-arcs.png" alt="" /><div className="cover-art-wash" /></div><div className="cover-content"><div className="cover-wordmark reveal"><Wordmark /><Star className="cover-star" /></div>
    <h1 className="cover-title reveal">{language === 'th' ? project.thaiTitle : project.title}</h1>
    <div className="title-rule reveal" /><p className="presentation-label reveal">Final Project Presentation</p>
    <button className="primary-button reveal" onClick={() => goTo('background')}>Start presentation <span><Icon name="right" size={29} /></span></button>
    <div className="student-members reveal"><span className="micro-label">PRESENTED BY</span><div>{project.members.map(member => <span className="member-row" key={member.id}><b>{member.id}</b><span lang={language}>{member[language]}</span></span>)}</div></div>
  </div><div className="cover-side-note" aria-hidden="true">TECHNOLOGY<br />PEOPLE<br />LOCAL CONTROL<span /></div><div className="cover-caption">Illustrative artwork · based on the approved design reference</div></div>
}

function Background() {
  return <div className="background-layout"><div className="background-statement reveal"><h1>Local control.<br /><span className="gradient-text">Practical<br />purpose.</span></h1><p>Store locally. Observe at the edge.<br />Verify the access boundaries.</p><div className="short-rule" /><div className="v3-audience"><strong>Designed for smaller teams.</strong><div><Tag>SMEs</Tag><Tag>Small offices</Tag><Tag>Home offices</Tag><Tag>Family businesses</Tag></div></div></div>
    <div className="background-story"><div className="story-panel reveal"><Icon name="storage" size={54} /><h2>Bring the data closer.</h2><p>Keep files, monitoring and access under explicit local ownership.</p><div className="story-track"><span>Ownership</span><span>Access</span><span>Recovery</span></div></div><div className="problem-rows">{[
      ['storage','Manage local data','File lifecycle, protected sharing and recoverable storage.'],
      ['camera','Process at the edge','Analyze camera input locally and retain useful evidence.'],
      ['shield','Assess the boundaries','Evaluate network and web controls with scoped positive and negative tests.'],
    ].map(([icon,title,text],i) => <article className="reveal" key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div><Icon name={icon} /></article>)}</div></div></div>
}
const ideas = [
  { num:'01',name:'AEGIS Drive',title:'Store. Share.\nStay in control.',icon:'files',tone:'purple',scene:'drive-architecture',text:'File management, Private Vault, controlled sharing and recovery.',tags:['File lifecycle','Encrypted Vault','Access policies'] },
  { num:'02',name:'AEGIS Monitor',title:'Observe at\nthe edge.',icon:'camera',tone:'coral',scene:'monitor-architecture',text:'Camera analysis, live viewing, recording, archive and alerts.',tags:['Edge inference','Clip archive','Operator + SOC'] },
  { num:'03',name:'Security Assessment',title:'Model. Test.\nExplain.',icon:'shield',tone:'blue',scene:'security-scope',text:'Network and web application assessment with scoped findings and recommendations.',tags:['Threat boundaries','Passive + manual','Evidence + limits'] },
]
function Overview({ goTo }: Pick<SceneProps,'goTo'>) {
  return <><div className="overview-top"><div className="overview-intro reveal"><Wordmark small /><h1>One foundation.<br /><span className="gradient-text">Three distinct ideas.</span></h1><p>Shared infrastructure.<br />Separate services, data and permissions.</p></div><div className="overview-art reveal"><img src="/assets/generated/monument-arcs.png" alt="Decorative monument and colored arches" /><Star /></div></div><div className="overview-cards">{ideas.map(idea => <button className={`idea-card tone-${idea.tone} reveal`} key={idea.num} onClick={() => goTo(idea.scene)}><div className="idea-card-top"><span className="icon-tile"><Icon name={idea.icon} size={36} /></span><span>IDEA {idea.num}</span></div><h2>{idea.name}</h2><h3>{idea.title}</h3><p>{idea.text}</p><div className="idea-card-bottom"><ul>{idea.tags.map(tag => <li key={tag}><Icon name="check" size={18} />{tag}</li>)}</ul><span className="round-arrow"><Icon name="right" size={27} /></span></div></button>)}</div><div className="overview-baseline reveal"><Icon name="server" size={32} /><strong>Ubuntu / NAS</strong><span>Shared compute & network</span><i /><span>Drive data</span><span>Monitor data</span><span>IDEA 3 · assessment</span></div></>
}
function Network() {
  return <><Heading title="The network behind AEGIS." subtitle="Designed zones. Documented ports. Field observations kept separate." /><div className="network-layout"><TechnicalDiagramStage kind="network" /><aside className="network-sidebar"><div className="hardware-card reveal"><Icon name="router" size={48} /><h2>Router + managed switch</h2><p>RB750r2 · TL-SG105E<br />802.1Q tagged trunk</p></div><div className="port-list reveal"><h3>Four zones</h3>{[['10','Server','purple'],['20','Detector','coral'],['30','Management','blue'],['40','Reserved','muted']].map(([n,label,tone]) => <div key={n}><span className={`vlan-number tone-${tone}`}>{n}</span><span>{label}</span></div>)}</div><p className="small-note">Ports 3 and 4 were Link Down during the field check. VLAN membership does not prove reachability.</p></aside></div></>
}
function Hardware() {
  return <>
    <Heading title="Actual Hardware & Network Setup" subtitle="From Network Design to Physical Implementation" />
    <div className="hardware-story">
      <div className="hardware-main-photo"><HardwarePhotoFrame assetId="equipment-setup" /></div>
      <div className="hardware-support"><HardwarePhotoFrame assetId="lan-cable-switch" /></div>
    </div>
    <div className="equipment-callouts" role="group" aria-label="Installed equipment">
      {[['router','MikroTik hEX lite RB750r2','Router'],['network','TP-Link TL-SG105E','Managed switch'],['server','Beelink Mini S','Ubuntu / NAS Server']].map(([icon,title,role],i) =>
        <div className="hardware-label" key={title}><span>0{i+1}</span><Icon name={icon} size={28} /><div><strong>{title}</strong><small>{role}</small></div></div>)}
    </div>
    <div className="photo-evidence-band"><span className="physical-indicator" aria-hidden="true" /><p>Physical installation evidence. Speed, VLAN and reachability require configuration and tests.</p><Reference>§3.6.3 · Fig. 3.6-12 / 3.6-13</Reference></div>
  </>
}
function ServerSetup() {
  return <><Heading title="One host." accent="Separate service boundaries." subtitle="Beelink Mini S · Ubuntu Server · persistent data beyond containers" /><div className="server-layout"><section className="server-foundation reveal"><div className="server-host"><span className="nas-icon"><Icon name="server" size={83} /></span><div><h2>Ubuntu / NAS</h2><p>Shared compute and storage infrastructure</p></div></div><div className="server-services">{[['secure','HUB / NGINX','HTTPS entry and routing'],['files','AEGIS Drive','File and policy boundary'],['camera','AEGIS Monitor','Live and archive boundary'],['database','PostgreSQL','Separate application databases']].map(([icon,title,text]) => <article key={title}><Icon name={icon} size={32} /><h3>{title}</h3><p>{text}</p></article>)}</div><div className="storage-boundary"><Icon name="storage" size={32} /><div><strong>Persistent volumes and mounts</strong><p>Database, Drive files and Monitor clips keep separate storage roles.</p></div></div><div className="server-networks"><Tag>Macvlan · LAN attachment</Tag><Tag tone="blue">Bridge · container communication</Tag></div></section><aside className="server-side"><EvidencePanel title="Connector stays separate"><p>Twingate runs outside the core application Compose stack.</p></EvidencePanel><EvidencePanel title="Recovery evidence"><p>2 manual backup rounds and 2 isolated restore rounds are reported.</p></EvidencePanel><EvidencePanel title="Resilience remains limited" status="limited"><p>No installed RAID 1. Scheduled backup execution remains unverified.</p></EvidencePanel></aside></div><Reference>§3.6.4–3.6.6 · §4.2.1–4.2.9</Reference></>
}
function Access() {
  const paths = [
    {title:'Private service access',subtitle:'Authorized staff and operators',tone:'purple',tag:'Twingate',icon:'key',steps:[['users','Authorized client'],['network','Twingate resource'],['secure','HTTPS / HUB'],['fingerprint','App session'],['vault','Data authorization']],note:'Specific web or SSH resources. Network access does not replace application authorization.'},
    {title:'Controlled public sharing',subtitle:'Recipients of an approved share link',tone:'coral',tag:'Separate gateway',icon:'share',steps:[['users','External recipient'],['cloud','Cloudflare Tunnel'],['shield','Share gateway'],['key','Share policy'],['files','Authorized file']],note:'Password, expiry and revocation apply to the share. The full Drive application stays private.'},
  ]
  return <><Heading title="Access is a sequence of decisions." subtitle="Two entry paths. Different purposes. Authorization at each boundary." /><div className="access-paths">{paths.map(p => <article className={`access-card tone-${p.tone} reveal`} key={p.title}><div className="access-title"><span className="icon-tile"><Icon name={p.icon} size={36} /></span><div><h2>{p.title}</h2><p>{p.subtitle}</p></div><Tag tone={p.tone}>{p.tag}</Tag></div><div className="path-steps">{p.steps.map(([icon,label],i) => <div className="path-step" key={label}><span><Icon name={icon} size={33} /></span><strong>{label}</strong>{i<4 && <Icon name="right" className="step-arrow" size={25} />}</div>)}</div><p className="path-caption">{p.note}</p></article>)}</div><EvidencePanel title="Reachability has a tested scope" status="limited"><p>Twingate recovery eventually returned HTTP 200; an initial online state still timed out. A single path does not prove every deny boundary.</p></EvidencePanel></>
}
function NetworkFeatures() {
  return <><Heading title="Functions with evidence." accent="Resilience with limits." /><div className="matrix-layout"><div className="technical-table-wrap reveal"><table className="technical-table"><thead><tr><th scope="col">Function</th><th scope="col">Role</th><th scope="col">Evidence</th></tr></thead><tbody>{networkFunctions.map(([name,role,evidence]) => <tr key={name}><th scope="row">{name}</th><td data-label="Role">{role}</td><td data-label="Evidence">{evidence}</td></tr>)}</tbody></table></div><aside className="matrix-side"><h2>One host.<br />One primary path.</h2><p>No Network Path Redundancy.</p><div className="resilience-line"><Icon name="router" size={44} /><span /><Icon name="network" size={44} /><span /><Icon name="server" size={44} /></div><EvidencePanel title="Evidence gaps" status="limited"><p>Detector deny paths, router hardening, scheduled backup and RAID 1 remain incomplete or unverified.</p></EvidencePanel></aside></div><Reference>§3.6.7 · §4.2.10–4.2.12 · §5.3.1</Reference></>
}
function Architecture({idea}:{idea:'drive'|'monitor'}) {
  const { language } = useI18n()
  const drive = idea === 'drive'
  const features = drive ? driveFeatures : [
    {icon:'detection',title:'Edge inference',text:'YOLO · YuNet · SFace on real Windows nodes.',tone:'coral'},
    {icon:'camera',title:'Operator + SOC',text:'Authorized demand and passive co-viewing.',tone:'purple'},
    {icon:'archive',title:'Clip archive',text:'SSH/SCP, SHA-256 and separate metadata.',tone:'blue'},
    {icon:'alert',title:'Event alerts',text:'Telegram notification with duplicate suppression.',tone:'coral'},
  ]
  return <><div className="chapter-heading reveal"><div><div className={`chapter-tag tone-${drive?'purple':'coral'}`}><span />IDEA {drive?'1':'2'}</div><h1>AEGIS <span className="gradient-text">{drive?'Drive':'Monitor'}</span></h1><p>{drive?'File control, from the browser to the NAS.':'Analyze locally. View securely. Preserve the evidence.'}</p></div><span className={`chapter-icon tone-${drive?'purple':'coral'}`}><Icon name={drive?'files':'camera'} size={65} /></span></div><TechnicalDiagramStage kind={idea} compact /><div className="architecture-features">{features.map((f, index) => <article className={`tone-${f.tone} reveal`} key={f.title}><Icon name={f.icon} size={28} /><div><h2>{drive && language === 'th' ? driveFeatures[index].titleTh : f.title}</h2><p>{drive && language === 'th' ? driveFeatures[index].textTh : f.text}</p></div></article>)}</div>{!drive && <p className="architecture-caveat">Face recognition analyzes imagery; it does not authenticate web login.</p>}</>
}
function Demo({idea}:{idea:'idea1'|'idea2'}) {
  const drive = idea === 'idea1'
  const sequence = drive ? [
    ['monitor','Dashboard','Open the authorized account.'],
    ['folder','File Management','Browse folders and files.'],
    ['vault','Private Vault','Open the protected vault.'],
    ['share','Secure Shares','Review password and expiry.'],
    ['restore','Share Revocation','Revoke a shared link.'],
  ] : [
    ['camera','Operator Live','Open the operator view.'],
    ['detection','AI Detection','Review a detection event.'],
    ['users','SOC Passive Monitoring','Review read-only monitoring.'],
    ['archive','Recording Archive','Inspect archived clips.'],
    ['alert','Telegram Alert / Logout','Review the alert, then sign out.'],
  ]
  return <>
    <Heading title={drive?'Inside AEGIS Drive.':'From live view to a traceable event.'} subtitle="90-second prepared recording · actual authorized behavior" />
    <div className={`demo-layout tone-${drive?'purple':'coral'}`}>
      <VideoInsertFrame assetId={`${idea}-demo`} browserChrome />
      <aside className="demo-side">
        <div className="demo-sequence">
          <h2>The demonstration path</h2>
          <ol className="demo-timeline" role="list">{sequence.map(([icon,label,description],i) =>
            <li className="demo-step" key={label}><span className="demo-step-number">{String(i+1).padStart(2,'0')}</span><Icon name={icon} size={24} /><div><h3>{label}</h3><p>{description}</p></div></li>)}
          </ol>
        </div>
        <p className="demo-recording-note"><Icon name="play" size={20} /><span>Prepared sequence for the owner-supplied recording.</span></p>
      </aside>
    </div>
  </>
}
function NetworkResults() {
  return <><Heading title="Network evidence." accent="Defined test paths." subtitle="Field tests · 12 October 2026 · Management VLAN to NAS" /><div className="matrix-layout"><div className="technical-table-wrap reveal"><table className="technical-table"><thead><tr><th scope="col">Test</th><th scope="col">Observed result</th><th scope="col">Scope</th></tr></thead><tbody>{[
    ['T-51 · ICMP','50/50 replies · mean RTT 0.711 ms','One field path; 50 requests'],
    ['T-54 · iperf3','90.0 / 90.6 Mbps receiver','Forward / reverse; Retr 108 / 143'],
    ['LAN HTTPS','HTTP 200','Direct Ethernet path'],
    ['UFW deny observation','TCP 8099 timeout + BLOCK log','No listener at the target port'],
  ].map(([test,result,scope]) => <tr key={test}><th scope="row">{test}</th><td data-label="Observed result">{result}</td><td data-label="Scope">{scope}</td></tr>)}</tbody></table><p className="table-note">Measured behavior applies to the specified path and conditions.</p></div><aside className="matrix-side evidence-stack"><EvidencePanel title="Configuration checked"><p>Switch membership/PVID and router 100 Mbps full-duplex trunk were recorded.</p></EvidencePanel><EvidencePanel title="Deny attribution is limited" status="limited"><p>Twingate TCP success did not distinguish allowed ports. Direct-WAN failures did not separate ISP NAT from UFW.</p></EvidencePanel><EvidencePanel title="Still NOT TESTED" status="pending"><p>Detector-zone unauthorized-service deny paths.</p></EvidencePanel></aside></div><Reference>§4.2.10–4.2.12 · T-49–T-54 · §4.9.1–4.9.5</Reference></>
}
function Performance() {
  return <><Heading title="Measure the path." accent="Explain the trade-off." subtitle="File-transfer medians · MB/s · 3 repeats per size and direction" /><div className="performance-layout"><section className="technical-table-wrap reveal"><table className="technical-table performance-table"><thead><tr><th scope="col">File size</th><th scope="col">LAN upload</th><th scope="col">LAN download</th><th scope="col">Remote upload</th><th scope="col">Remote download</th></tr></thead><tbody>{[['100 MB','10.588','11.042','2.981','4.799'],['300 MB','10.752','11.068','3.080','5.050'],['1 GB','10.591','10.994','3.016','4.829']].map(([size,...values]) => <tr key={size}><th scope="row">{size}</th>{values.map((v,i) => <td data-label={['LAN upload','LAN download','Remote upload','Remote download'][i]} key={i}>{v}</td>)}</tr>)}</tbody></table><p className="table-note">18 LAN trials + 18 remote trials. Remote access uses Twingate.</p><div className="trunk-comparison"><Icon name="network" size={33} /><strong>1 Gbps switch access</strong><Icon name="right" size={24} /><strong>100 Mbps router trunk</strong></div></section><aside className="tradeoff-panel reveal"><h2>CLO6 · Adapt the technique.</h2><p>Shared infrastructure with separate data. Resource-scoped access. Passive-first and negative tests.</p><div className="short-rule" /><h3>Measure before scaling.</h3><p>The routed trunk limits this path. Remote bottlenecks remain unresolved.</p><small>Router CPU 11% was one snapshot, not a peak or average.</small></aside></div><Reference>§4.4.14 · §4.9.10–4.9.14 · §5.3.1</Reference></>
}
function SecurityScope() {
  return <><Heading title="Security Assessment:" accent="Scope & Threat Model" subtitle="Protect the data by examining the boundaries around it." /><div className="security-scope-layout"><TechnicalDiagramStage kind="security" /><aside className="scope-panel reveal"><Tag tone="blue" icon="shield">IDEA 3 · Assessment</Tag><h2>Authorized scope</h2><ul><li>Arch Linux assessment client</li><li>One ordinary Drive account</li><li>65-byte CANARY file</li></ul><h3>Threats considered</h3><p>Unauthenticated access, session replay, admin misuse, unauthorized files and configuration exposure.</p><EvidencePanel title="Excluded from this assessment" status="limited"><p>DoS, brute force, broad active scanning and other users’ data.</p></EvidencePanel></aside></div><Reference>§3.7 · §3.10.1–3.10.2 · §5.3.4</Reference></>
}
function SecurityMethodology() {
  return <><Heading title="Security Architecture" accent="& Methodology" subtitle="Passive-first. Limited requests. Traceable evidence." /><div className="methodology-layout"><div className="methodology-steps">{[
    ['network','Verify access','Twingate OFF/ON · DNS · HTTP status'],
    ['shield','Observe and challenge','OWASP ZAP passive · Burp manual requests'],
    ['filecheck','Verify data and transport','CANARY SHA-256 · testssl.sh · OpenSSL'],
    ['book','Review exposure and source','Nmap 80/443 only · Gitleaks current source'],
  ].map(([icon,title,text],i) => <article className="reveal" key={title}><span className="method-number">0{i+1}</span><Icon name={icon} size={35} /><div><h2>{title}</h2><p>{text}</p></div></article>)}</div><aside className="methodology-boundary reveal"><h2>Defense in depth</h2><div className="defense-layers">{['Network resource','Transport / TLS','App session / RBAC','Object authorization','Data integrity / recovery'].map((label,i) => <div key={label}><span>0{i+1}</span><strong>{label}</strong></div>)}</div><p>Each layer has its own tests and limitations.</p><div className="evidence-streams"><strong>Assessor evidence</strong><span>§4.6.1–4.6.14</span><strong>Development evidence</strong><span>§4.6.15–4.6.17</span></div><small>Development tests do not turn assessor NOT TESTED cases into PASS.</small></aside></div><Reference>§3.10.3–3.10.6 · §4.6 · §4.9.6–4.9.14</Reference></>
}
function SecurityFindings() {
  return <><Heading title="Security Assessment:" accent="Results & Findings" subtitle="A scoped result is evidence of a case, not certification of the system." /><div className="findings-table-wrap reveal"><table className="technical-table findings-table"><thead><tr><th scope="col">Status</th><th scope="col">Evidence / finding</th><th scope="col">Interpretation / next action</th></tr></thead><tbody>{securityFindings.map(f => <tr key={f.status}><td><span className={`assessment-status status-${f.status.toLowerCase().replace(' ','-')}`}>{f.status}</span></td><td data-label="Evidence / finding"><strong>{f.title}</strong><p>{f.result}</p></td><td data-label="Interpretation / next action">{f.next}</td></tr>)}</tbody></table></div><div className="assessment-summary"><p><strong>ZAP passive alert types</strong><span>High 0 · Medium 0 · Low 3 · Info 3</span><small>Alert types, not confirmed exploits.</small></p><p><strong>Development Public Share matrix</strong><span>74 PASS · 0 FAIL · 1 NOT TESTED / 75</span><small>Separate from assessor evidence.</small></p><div><AssessmentEvidenceReview /><Reference>§4.6.2–4.6.10 · §4.6.16</Reference></div></div></>
}
function Summary() {
  return <><Heading title="What we built." accent="What comes next." subtitle="Local data. Edge monitoring. Evidence-based assessment." /><div className="summary-layout"><div className="summary-built"><FeatureCard icon="storage" title="Local data control" text="Drive file lifecycle, encrypted Vault and controlled shares." /><FeatureCard icon="camera" title="Edge monitoring" text="Real camera lifecycle, archived clips and event alerts." tone="coral" /><FeatureCard icon="shield" title="Scoped security assessment" text="Network, web, source and integrity evidence with explicit limits." tone="blue" /></div><section className="next-panel reveal"><h2>The next validation steps</h2><div className="next-list">{[
    ['Capacity & resilience','Faster router path, off-host recovery and verified backup scheduling.'],
    ['Security follow-up','Header cleanup, credential-context review and broader assessor negative tests.'],
    ['Complete measurements','Recognition evaluation, live/alert latency and Archive API/role coverage.'],
  ].map(([title,text],i) => <article key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div><p className="integration-note"><Icon name="help" size={27} />Single host and primary path. No installed RAID 1 or network-path redundancy.</p></section></div><div className="closing-principle reveal"><span>Thank you · Questions & discussion</span><strong>Build the boundary. Test the behavior. Keep the evidence.</strong></div></>
}
function ThankYou() {
  const { language } = useI18n()
  return <div className="thank-you-layout">
    <div className="thank-you-art" aria-hidden="true"><img src="/assets/generated/monument-arcs.png" alt="" /></div>
    <div className="thank-you-content">
      <div className="thank-you-intro">
        <h1 className="thank-you-heading" aria-label={language === 'th' ? 'ขอบคุณ' : 'Thank You!'}>
          {language === 'th' ? <><span className="thank-you-word">ขอบ</span><span className="thank-you-word gradient-text">คุณ</span></> : <><span className="thank-you-word">Thank</span> <span className="thank-you-word gradient-text">You!</span></>}
        </h1>
        <p className="thank-you-attention">For your time and attention</p>
      </div>
      <div className="thank-you-project">
        <Wordmark small />
        <span className="thank-you-project-rule" aria-hidden="true" />
        <p>{project.title}</p>
      </div>
      <p className="thank-you-university">A Final Project by Suranaree University of Technology</p>
      <div className="thank-you-students" aria-label={language === 'th' ? 'ผู้จัดทำโครงงาน' : 'Project students'}>
        {project.members.map((member, index) => <article className={`thank-you-student thank-you-student-${index + 1}`} key={member.id}>
          <span className="thank-you-student-id">{member.id}</span>
          <h2 lang={language}>{member[language]}</h2>
          <p lang={language === 'th' ? 'en' : 'th'}>{language === 'th' ? member.en : member.th}</p>
          <span className="thank-you-student-rule" aria-hidden="true" />
        </article>)}
      </div>
      <div className="thank-you-closing">
        <div className="thank-you-questions"><strong>Questions &amp; Discussion</strong><span className="short-rule" aria-hidden="true" /></div>
        <p>Technology serves people.<br />Security strengthens our community.</p>
      </div>
    </div>
    <Star className="thank-you-star" />
  </div>
}
export function SceneContent({id,goTo}:SceneProps) {
  switch(id) {
    case 'cover': return <Cover goTo={goTo} />
    case 'background': return <Background />
    case 'overview': return <Overview goTo={goTo} />
    case 'network': return <Network />
    case 'hardware-setup': return <Hardware />
    case 'server-setup': return <ServerSetup />
    case 'access': return <Access />
    case 'network-features': return <NetworkFeatures />
    case 'drive-architecture': return <Architecture idea="drive" />
    case 'drive-demo': return <Demo idea="idea1" />
    case 'monitor-architecture': return <Architecture idea="monitor" />
    case 'monitor-demo': return <Demo idea="idea2" />
    case 'network-results': return <NetworkResults />
    case 'performance': return <Performance />
    case 'security-scope': return <SecurityScope />
    case 'security-methodology': return <SecurityMethodology />
    case 'security-findings': return <SecurityFindings />
    case 'summary': return <Summary />
    case 'thank-you': return <ThankYou />
    default: return <div><h1>Scene unavailable</h1><button onClick={() => goTo('cover')}>Return to cover</button></div>
  }
}
export function PresentationBudget() { return <span>{formatTime(totalSeconds)} planned · 15 min maximum</span> }
