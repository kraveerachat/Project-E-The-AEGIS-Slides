import { useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { assetById, assetUrl } from '../data/assets'
import { Icon } from './Icons'
import { MissingAssetPlaceholder } from './MediaFrames'

export function HardwarePhotoFrame({ assetId }: { assetId: string }) {
  const asset = assetById(assetId)
  const [failed, setFailed] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const available = asset.status === 'AVAILABLE' && !failed
  const width = assetId === 'equipment-setup' ? 3072 : 4096
  const height = assetId === 'equipment-setup' ? 4096 : 3072
  return <figure className="hardware-photo" data-asset-id={assetId} style={{ '--photo-ratio': width / height } as CSSProperties}>
    <button className="hardware-photo-button" onClick={() => dialog.current?.showModal()} disabled={!available} aria-label={`Inspect ${asset.label}`}>
      <span className="hardware-photo-viewport">{available ? <img className="hardware-photo-image" src={assetUrl(asset)} alt={asset.alt} width={width} height={height} onError={() => setFailed(true)} /> : <MissingAssetPlaceholder asset={asset} failed={failed} />}</span>
      {available && <span className="photo-inspect"><Icon name="fullscreen" size={20} /><span>Inspect original photograph</span></span>}
    </button>
    <figcaption><strong>{asset.label}</strong><span>Original owner photograph</span></figcaption>
    <dialog className="photo-dialog" ref={dialog} aria-labelledby={titleId} data-local-keys onClick={event => { if (event.target === dialog.current) dialog.current.close() }}>
      <div className="dialog-header"><h2 id={titleId}>{asset.label}</h2><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close photograph inspection"><Icon name="close" size={25} /></button></div>
      {available && <img src={assetUrl(asset)} alt={asset.alt} />}
      <p>Physical evidence only. Configuration and tests establish network behavior.</p>
    </dialog>
  </figure>
}
