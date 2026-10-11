import { useEffect, useRef, useState } from 'react'
import { assetById, assetUrl } from '../data/assets'
import type { Asset } from '../data/assets'
import { Icon } from './Icons'

export function MissingAssetPlaceholder({ asset, failed = false, compact = false }: { asset: Asset; failed?: boolean; compact?: boolean }) {
  return <div className={`missing-asset ${asset.type === 'video' ? 'missing-video' : ''} ${compact ? 'compact' : ''}`} role="img" aria-label={`${asset.label}: ${failed ? 'file unavailable' : 'awaiting real media'}`}>
    <div className="placeholder-orbit orbit-one" aria-hidden="true" /><div className="placeholder-orbit orbit-two" aria-hidden="true" />
    <span className="placeholder-icon"><Icon name={asset.type === 'video' ? 'play' : 'monitor'} size={compact ? 32 : 52} /></span>
    <strong>{asset.type === 'video' ? 'UI demonstration video' : asset.label}</strong>
    <span className="placeholder-state">{failed ? 'Media unavailable · replace the supplied file' : asset.type === 'video' ? 'Real recording coming next' : 'Awaiting actual system screenshot'}</span>
    <span className="placeholder-spec">{asset.aspectRatio} {asset.type === 'video' ? 'VIDEO STAGE' : 'REAL UI EVIDENCE'}</span>
  </div>
}

export function RealScreenshotFrame({ assetId, compact = false }: { assetId: string; compact?: boolean }) {
  const asset = assetById(assetId)
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [assetId])
  return <figure className={`screenshot-frame ${compact ? 'compact-frame' : ''}`} data-asset-id={asset.id}>
    <div className="frame-chrome"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span>AEGIS · {asset.label}</span><span className="real-label">REAL UI</span></div>
    <div className="screenshot-viewport">
      {asset.status === 'AVAILABLE' && !failed ? <img src={assetUrl(asset)} alt={asset.alt} onError={() => setFailed(true)} loading="lazy" /> : <MissingAssetPlaceholder asset={asset} failed={failed} compact={compact} />}
    </div>
    <figcaption>{asset.status === 'AVAILABLE' && !failed ? 'Owner-supplied system capture' : 'Reserved for original AEGIS evidence — no simulated interface'}</figcaption>
  </figure>
}

export function SystemScreenshotGallery({ ids, initial = 0 }: { ids: string[]; initial?: number }) {
  const [selected, setSelected] = useState(initial)
  return <div className="screenshot-gallery">
    <RealScreenshotFrame key={ids[selected]} assetId={ids[selected]} />
    <div className="gallery-tabs" role="group" aria-label="Choose a system screenshot">
      {ids.map((id, index) => <button key={id} type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, '0')}</span>{assetById(id).label}</button>)}
    </div>
  </div>
}

export function VideoInsertFrame({ assetId, compact = false }: { assetId: string; compact?: boolean }) {
  const asset = assetById(assetId)
  const [failed, setFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => { const element = video.current; return () => element?.pause() }, [])
  const available = asset.status === 'AVAILABLE' && !failed
  return <figure className={`video-frame ${compact ? 'video-compact' : ''}`} data-asset-id={asset.id}>
    <div className="video-viewport">{available ? <video ref={video} controls playsInline preload="metadata" onError={() => setFailed(true)} aria-label={asset.alt}>
      <source src={assetUrl(asset)} type="video/mp4" onError={() => setFailed(true)} />
      {asset.captions && <track kind="captions" src={`/assets/${asset.captions}`} srcLang="en" label="English" />}
    </video> : <MissingAssetPlaceholder asset={asset} failed={failed} compact={compact} />}</div>
    <figcaption><span><Icon name="play" size={17} />{available ? 'Owner-supplied recording · playback is manual' : 'Recording stage · 16:9 · playback enabled when supplied'}</span></figcaption>
  </figure>
}

export function EvidencePanel({ title, children, status = 'reported' }: { title: string; children: React.ReactNode; status?: 'reported' | 'limited' | 'pending' }) {
  return <aside className={`evidence-panel evidence-${status}`}><span className="evidence-icon"><Icon name={status === 'reported' ? 'filecheck' : status === 'limited' ? 'help' : 'layers'} size={26} /></span><div><strong>{title}</strong><div>{children}</div></div></aside>
}
