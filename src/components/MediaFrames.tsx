import { useEffect, useId, useRef, useState } from 'react'
import { assetById, assetUrl, securityGallery } from '../data/assets'
import type { Asset } from '../data/assets'
import { Icon } from './Icons'

export function MissingAssetPlaceholder({ asset, failed = false, compact = false }: { asset: Asset; failed?: boolean; compact?: boolean }) {
  const photograph = asset.captureKind === 'photograph'
  return <div className={`missing-asset ${asset.type === 'video' ? 'missing-video' : ''} ${compact ? 'compact' : ''}`} role="img" aria-label={`${asset.label}: ${failed ? 'file unavailable' : 'awaiting real media'}`}>
    <div className="placeholder-orbit orbit-one" aria-hidden="true" /><div className="placeholder-orbit orbit-two" aria-hidden="true" />
    <span className="placeholder-icon"><Icon name={asset.type === 'video' ? 'play' : photograph ? 'camera' : 'monitor'} size={compact ? 32 : 52} /></span>
    <strong>{asset.type === 'video' ? 'UI demonstration video' : asset.label}</strong>
    <span className="placeholder-state">{failed ? 'Media unavailable · replace the supplied file' : asset.type === 'video' ? 'Real recording coming next' : photograph ? 'Awaiting original hardware photograph' : 'Awaiting actual system screenshot'}</span>
    <span className="placeholder-spec">{asset.aspectRatio} {asset.type === 'video' ? 'VIDEO STAGE' : photograph ? 'ORIGINAL PHOTOGRAPH' : 'REAL UI EVIDENCE'}</span>
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

export function VideoInsertFrame({ assetId, compact = false, browserChrome = false }: { assetId: string; compact?: boolean; browserChrome?: boolean }) {
  const asset = assetById(assetId)
  const [failed, setFailed] = useState(false)
  const [focused, setFocused] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const expand = useRef<HTMLButtonElement>(null)
  const frame = useRef<HTMLElement>(null)
  const previouslyFocused = useRef(false)
  useEffect(() => { const element = video.current; return () => element?.pause() }, [])
  useEffect(() => {
    if (!focused) {
      if (previouslyFocused.current) (expand.current ?? frame.current)?.focus()
      previouslyFocused.current = false
      return
    }
    previouslyFocused.current = true
    const inert: {element: HTMLElement; previous: boolean}[] = []
    let current = frame.current
    while (current?.parentElement && !current.classList.contains('presentation-stage')) {
      for (const sibling of current.parentElement.children) if (sibling !== current && sibling instanceof HTMLElement) { inert.push({element:sibling,previous:sibling.inert}); sibling.inert = true }
      current = current.parentElement
    }
    frame.current?.querySelector<HTMLButtonElement>('.video-focus-header button')?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); video.current?.pause(); setFocused(false) }
    }
    window.addEventListener('keydown', close, true)
    return () => { window.removeEventListener('keydown', close, true); inert.forEach(({element,previous}) => { element.inert = previous }) }
  }, [focused])
  const available = asset.status === 'AVAILABLE' && !failed
  const poster = asset.posterAssetId ? assetById(asset.posterAssetId) : undefined
  const posterAvailable = poster?.status === 'AVAILABLE' && !posterFailed
  const exit = () => { video.current?.pause(); setFocused(false); expand.current?.focus() }
  const mediaError = () => { setFailed(true); setFocused(false) }
  return <figure ref={frame} tabIndex={-1} className={`video-frame ${compact ? 'video-compact' : ''} ${focused ? 'media-focus' : ''}`} role={focused ? 'group' : undefined} aria-label={focused ? asset.label : undefined} data-asset-id={asset.id} data-local-keys>
    {browserChrome && <div className="frame-chrome video-chrome"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span>AEGIS · {asset.label}</span><span className="real-label">MP4 · 16:9</span></div>}
    {focused && <div className="video-focus-header"><strong>{asset.label}</strong><button onClick={exit} aria-label="Exit presentation video mode"><Icon name="close" size={23} /><span>Return to scene</span></button></div>}
    <div className="video-viewport">{available ? <video ref={video} controls playsInline preload="metadata" poster={posterAvailable ? assetUrl(poster!) : undefined} onPlay={() => setFocused(true)} onEnded={() => { setFocused(false); expand.current?.focus() }} onError={mediaError} aria-label={asset.alt}>
      <source src={assetUrl(asset)} type="video/mp4" onError={mediaError} />
      {asset.captions && <track kind="captions" src={`/assets/${asset.captions}`} srcLang="en" label="English" />}
    </video> : <MissingAssetPlaceholder asset={asset} failed={failed} compact={compact} />}</div>
    {available && <div className="video-static-frame">{posterAvailable ? <img src={assetUrl(poster!)} alt={poster!.alt} onError={() => setPosterFailed(true)} /> : <MissingAssetPlaceholder asset={asset} compact={compact} />}</div>}
    <figcaption><span><Icon name="play" size={17} />{available ? 'Owner-supplied recording · playback is manual' : 'Recording stage · 16:9 · playback enabled when supplied'}</span>{available && !focused && <button ref={expand} onClick={() => setFocused(true)} aria-label="Enter presentation video mode"><Icon name="fullscreen" size={18} /><span>Focus video</span></button>}</figcaption>
  </figure>
}

export function AssessmentEvidenceReview() {
  const dialog = useRef<HTMLDialogElement>(null)
  const id = useId()
  return <><button className="evidence-review-button" onClick={() => dialog.current?.showModal()}><Icon name="filecheck" size={20} /><span>Review evidence captures</span></button><dialog className="assessment-dialog" ref={dialog} aria-labelledby={id} data-local-keys onClick={event => { if (event.target === dialog.current) dialog.current.close() }}><div className="dialog-header"><h2 id={id}>Security assessment evidence</h2><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close evidence review"><Icon name="close" size={24} /></button></div><SystemScreenshotGallery ids={securityGallery} /><p>Awaiting owner-approved redacted captures. Report findings remain scoped to their recorded tests.</p></dialog></>
}

export function EvidencePanel({ title, children, status = 'reported' }: { title: string; children: React.ReactNode; status?: 'reported' | 'limited' | 'pending' }) {
  return <aside className={`evidence-panel evidence-${status}`}><span className="evidence-icon"><Icon name={status === 'reported' ? 'filecheck' : status === 'limited' ? 'help' : 'layers'} size={26} /></span><div><strong>{title}</strong><div>{children}</div></div></aside>
}
