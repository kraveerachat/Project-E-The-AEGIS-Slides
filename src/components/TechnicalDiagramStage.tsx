import { useId, useState } from 'react'
import { diagrams } from '../data/diagrams'
import type { DiagramNode } from '../data/diagrams'
import { Icon } from './Icons'

function pathBetween(a: DiagramNode, b: DiagramNode) {
  const horizontal = Math.abs(a.y - b.y) < 60
  if (horizontal) { const x1 = a.x + 132, x2 = b.x - 132; return `M${x1},${a.y} C${(x1+x2)/2},${a.y} ${(x1+x2)/2},${b.y} ${x2},${b.y}` }
  const y1 = a.y + 44, y2 = b.y - 44
  return `M${a.x},${y1} C${a.x},${(y1+y2)/2} ${b.x},${(y1+y2)/2} ${b.x},${y2}`
}
export function TechnicalDiagramStage({ kind, compact = false }: { kind: 'network' | 'drive' | 'monitor' | 'security'; compact?: boolean }) {
  const diagram = diagrams[kind]
  const [selected, setSelected] = useState(kind === 'network' ? 'nas' : kind === 'drive' ? 'api' : kind === 'monitor' ? 'engine' : 'session')
  const node = diagram.nodes.find(n => n.id === selected)!
  const arrowId = useId().replace(/:/g, '')
  const viewHeight = kind === 'network' ? 380 : 350
  return <section className={`diagram-stage ${compact ? 'diagram-compact' : ''}`} aria-label={diagram.label}>
    <div className="diagram-meta"><span><Icon name="network" size={21} />{diagram.label}</span><span>SELECT A NODE TO EXPLORE</span></div>
    <svg className="technical-diagram" viewBox={`0 0 1200 ${viewHeight}`} role="group" aria-label={`${diagram.label}. Reported connections are solid; reserved integration is dashed.`}>
      <defs><marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10" fill="currentColor" /></marker></defs>
      {diagram.edges.map((edge, i) => { const a = diagram.nodes.find(n => n.id === edge.from)!, b = diagram.nodes.find(n => n.id === edge.to)!, d = pathBetween(a,b); return <g key={`${edge.from}-${edge.to}`} className={`${edge.planned ? 'planned-connection' : 'reported-connection'} ${edge.from === selected || edge.to === selected ? 'selected-connection' : ''}`}>
        <path d={d} className="diagram-edge" markerEnd={`url(#${arrowId})`} />
        {!edge.planned && <path d={d} className="diagram-flow" style={{ animationDelay: `${i * -.6}s` }} />}
        {edge.label && <text className="edge-label" x={(a.x+b.x)/2} y={(a.y+b.y)/2 - (Math.abs(a.y-b.y)<60 ? edge.label.length > 20 ? 62 : 17 : 0)} textAnchor="middle">{edge.label}</text>}
      </g> })}
      {diagram.nodes.map(n => <g key={n.id} className={`diagram-node tone-${n.tone ?? 'neutral'} ${selected === n.id ? 'selected' : ''} ${n.planned ? 'planned-node' : ''}`} transform={`translate(${n.x - 132} ${n.y - 43})`} role="button" tabIndex={0} aria-pressed={selected === n.id} aria-label={`${n.title}. ${n.subtitle}`} onClick={() => setSelected(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(n.id) } }}>
        <rect width="264" height="86" rx="20" />
        <foreignObject x="17" y="24" width="38" height="38"><Icon name={n.icon} size={34} /></foreignObject>
        <text x="68" y="35" className="node-title">{n.title}</text><text x="68" y="59" className="node-subtitle">{n.subtitle}</text>
      </g>)}
    </svg>
    <div className="diagram-reading-nodes" role="group" aria-label="Explore diagram nodes">{diagram.nodes.map(n => <button key={n.id} aria-pressed={selected === n.id} onClick={() => setSelected(n.id)}><Icon name={n.icon} size={22} /><span><strong>{n.title}</strong><small>{n.subtitle}</small></span></button>)}</div>
    <div className="diagram-inspector" aria-live="polite"><span className={`icon-tile tone-${node.tone ?? 'purple'}`}><Icon name={node.icon} size={26} /></span><div><strong>{node.title}</strong><p>{node.detail}</p></div></div>
    <ul className="diagram-reading-edges" aria-label="Diagram relationships">{diagram.edges.map(edge => <li key={`${edge.from}-${edge.to}`}>{diagram.nodes.find(n => n.id === edge.from)?.title} → {diagram.nodes.find(n => n.id === edge.to)?.title}{edge.planned ? ' · prepared / pending' : edge.label ? ` · ${edge.label}` : ''}</li>)}</ul>
    <div className="diagram-legend"><span><i />Reported topology / data relationship</span><span><i className="dashed" />Prepared / pending verification</span><span>Illustrative flow · not live telemetry</span></div>
  </section>
}
