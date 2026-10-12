import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { chapters, formatTime, project, scenes, sources } from './data/content'
import { SceneContent, PresentationBudget } from './components/Scenes'
import { Icon } from './components/Icons'
import { usePresentation, useReducedMotion, useStageScale } from './hooks/usePresentation'
import { useI18n } from './i18n/I18nProvider'
gsap.registerPlugin(Flip)

export default function App() {
  const { language, setLanguage, t } = useI18n()
  const reducedPreference = useReducedMotion()
  const { scale, narrow } = useStageScale()
  const [readerOverride, setReaderOverride] = useState<boolean | null>(null)
  const [motionPaused, setMotionPaused] = useState(false)
  const reading = readerOverride ?? narrow
  const reduced = reducedPreference || motionPaused
  const { index, scene, goToIndex, goTo, sceneRef, transitioning } = usePresentation(reduced, reading)
  const [panel, setPanel] = useState<'scenes' | 'sources' | null>(null)
  const [notice, setNotice] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const nav = useRef<HTMLElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const activeChapter = scene.chapter === 'closing' ? 'overview' : scene.chapter

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else setNotice('Fullscreen is unavailable in this browser. Use its presentation or full-screen menu.')
    } catch { setNotice('Fullscreen was not enabled. Try the fullscreen button or your browser menu.') }
  }
  useEffect(() => { const update = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener('fullscreenchange', update); return () => document.removeEventListener('fullscreenchange', update) }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || panel || document.querySelector('dialog[open], .media-focus')) return
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, video, [contenteditable="true"], [data-local-keys]')) return
      if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); goToIndex(index + 1) }
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); goToIndex(index - 1) }
      else if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen() }
      else if (event.key === 'Escape' && document.fullscreenElement) { void document.exitFullscreen().catch(() => setNotice('Use your browser control to exit fullscreen.')) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goToIndex, panel])

  useEffect(() => { if (panel && !dialog.current?.open) dialog.current?.showModal(); else if (!panel && dialog.current?.open) dialog.current.close() }, [panel])
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 6000); return () => window.clearTimeout(timer) }, [notice])
  useEffect(() => { document.title = `${t(scene.title)} · AEGIS` }, [scene.title, t])

  useLayoutEffect(() => {
    const selected = nav.current?.querySelector<HTMLElement>(`[data-chapter="${activeChapter}"]`)
    if (!selected || !indicator.current) return
    const state = Flip.getState(indicator.current)
    gsap.set(indicator.current, { left: selected.offsetLeft, top: selected.offsetTop, width: selected.offsetWidth, height: selected.offsetHeight })
    if (!reduced) Flip.from(state, { duration: .48, ease: 'power3.out', absolute: false })
  }, [activeChapter, reduced, reading, scale])

  useEffect(() => {
    const element = stage.current
    if (!element || reduced || reading || !window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const move = (e: PointerEvent) => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const bounds = element.getBoundingClientRect(); const x = ((e.clientX-bounds.left)/bounds.width - .5)*10, y = ((e.clientY-bounds.top)/bounds.height - .5)*10; element.style.setProperty('--parallax-x', `${x}px`); element.style.setProperty('--parallax-y', `${y}px`) }) }
    const reset = () => { element.style.setProperty('--parallax-x', '0px'); element.style.setProperty('--parallax-y', '0px') }
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', reset)
    return () => { cancelAnimationFrame(frame); element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); reset() }
  }, [reduced, reading])

  return <div className={`app ${reading ? 'reading-mode' : 'presentation-mode'}`} data-motion={reduced ? 'off' : 'on'}>
    <a className="skip-link" href="#scene-content" onClick={e => { e.preventDefault(); sceneRef.current?.focus() }}>Skip to scene</a>
    <div className="presentation-fit" style={reading ? undefined : { width: 1920*scale, height: 1080*scale }}>
      <div ref={stage} className={`presentation-stage chapter-${scene.chapter}`} style={reading ? undefined : { transform: `scale(${scale})` }}>
        <div className="ambient-shapes" aria-hidden="true"><div className="ambient-violet" /><div className="ambient-coral" /><div className="ambient-blue" /><div className="ambient-dots" /></div>
        <header className="masthead">
          <button className="university-brand" onClick={() => goTo('cover')} aria-label="Suranaree University of Technology — return to cover"><img src="/assets/branding/sut-standard.png" alt="SUT original emblem" width="78" height="98" /><span>Suranaree<br />University<br /><span>of Technology</span></span></button>
          <nav className="chapter-nav" aria-label="Presentation chapters" ref={nav}><span className="nav-indicator" ref={indicator} aria-hidden="true" />{chapters.map(chapter => <button key={chapter.id} data-chapter={chapter.id} aria-current={activeChapter === chapter.id ? 'page' : undefined} onClick={() => goTo(chapter.scene)}>{chapter.label}</button>)}</nav>
          <div className="masthead-label"><span className="masthead-line" /><p>FINAL PROJECT<br />PRESENTATION</p></div>
        </header>
        <main id="scene-content" ref={sceneRef} tabIndex={-1} className={`scene scene-${scene.id}`} data-scene-id={scene.id} aria-label={`Scene ${index+1} of ${scenes.length}: ${scene.title}`} aria-busy={transitioning}>
          <SceneContent key={scene.id} id={scene.id} goTo={goTo} />
        </main>
        <footer className="presentation-footer">
          <div className="footer-identity"><span className="footer-rule" /><strong>AEGIS</strong><span className="footer-dots" aria-hidden="true"><i /><i /><i /></span></div>
          <div className="scene-status"><span className="scene-counter"><b>{String(index+1).padStart(2,'0')}</b><span>/ {scenes.length}</span></span><div><span className="scene-name">{scene.id === 'cover' ? 'Opening' : scene.id === 'ending' ? 'Closing' : `${scene.number} · ${scene.title}`}</span><div className="scene-progress" aria-hidden="true"><span style={{ width: `${(index+1)/scenes.length*100}%` }} /></div></div></div>
          <div className="utility-controls"><div className="language-switch" role="group" aria-label={t('Presentation language')}><button type="button" lang="th" aria-label={t('Thai language')} aria-pressed={language === 'th'} className={language === 'th' ? 'active' : ''} onClick={() => setLanguage('th')}>TH</button><span aria-hidden="true">|</span><button type="button" lang="en" aria-label={t('English language')} aria-pressed={language === 'en'} className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div><button onClick={() => setPanel('scenes')} aria-label={`Open all ${scenes.length} scenes`} title="All scenes"><Icon name="menu" size={24} /></button><button onClick={() => setPanel('sources')} aria-label="Open report sources and speaker notes" title="Sources & speaker notes"><Icon name="book" size={24} /></button><button onClick={() => setReaderOverride(!reading)} aria-label={reading ? 'Switch to 16:9 presentation view' : 'Switch to reading view'} title={reading ? '16:9 view' : 'Reading view'}><Icon name={reading ? 'monitor' : 'layers'} size={24} /></button><button onClick={() => setMotionPaused(!motionPaused)} aria-label={motionPaused ? 'Resume decorative motion' : 'Pause decorative motion'} aria-pressed={motionPaused || reducedPreference} title={reducedPreference ? 'System reduced motion is enabled' : motionPaused ? 'Resume motion' : 'Pause motion'}><Icon name={motionPaused || reducedPreference ? 'play' : 'pause'} size={23} /></button><button onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title="Fullscreen (F)"><Icon name="fullscreen" size={24} /></button></div>
          <div className="navigation-controls"><button className="previous-button" onClick={() => goToIndex(index-1)} disabled={index === 0 || transitioning} aria-label="Previous scene"><Icon name="left" size={28} /><span>Previous</span></button><span className="nav-divider" /><button className="next-button" onClick={() => goToIndex(index+1)} disabled={index === scenes.length-1 || transitioning} aria-label="Next scene"><Icon name="right" size={30} /><span>Next</span></button></div>
        </footer>
      </div>
    </div>
    <div className="sr-only" aria-live="polite" aria-atomic="true">Scene {index+1} of {scenes.length}. {scene.title}</div>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification"><Icon name="close" size={18} /></button></div>}
    <dialog className={`presentation-dialog dialog-${panel}`} ref={dialog} onClose={() => setPanel(null)} onClick={e => { if (e.target === dialog.current) setPanel(null) }} aria-labelledby="dialog-title">
      <div className="dialog-header"><div><span className="dialog-kicker">AEGIS PRESENTATION</span><h2 id="dialog-title">{panel === 'scenes' ? 'Choose a scene' : 'Sources & speaker notes'}</h2></div><button className="dialog-close" onClick={() => setPanel(null)} aria-label="Close panel"><Icon name="close" size={23} /></button></div>
      {panel === 'scenes' ? <><div className="dialog-budget"><Icon name="gauge" size={20} /><PresentationBudget /><span>Speaking targets, including demo slots</span></div><div className="scene-picker">{scenes.map((item,i) => <button key={item.id} className={i === index ? 'current' : ''} onClick={() => { setPanel(null); goToIndex(i) }} aria-current={i === index ? 'step' : undefined}><span>{String(i+1).padStart(2,'0')}</span><strong>{item.title}</strong><small>{formatTime(item.seconds)}</small><Icon name="right" size={18} /></button>)}</div><div className="keyboard-help"><span><kbd>←</kbd><kbd>→</kbd> Navigate</span><span><kbd>F</kbd> Fullscreen</span><span><kbd>Esc</kbd> Close / exit fullscreen</span></div></> : panel === 'sources' ? <><div className="source-scene"><span>SCENE {String(index+1).padStart(2,'0')} · {formatTime(scene.seconds)} speaking target</span><h3>{scene.title}</h3><p>{scene.notes}</p></div><h3 className="source-subheading">Report references</h3><p className="report-name">Final report · {project.report}</p><div className="source-list">{scene.sources.map(id => { const source = sources[id]; return <article key={id}><div><strong>{source.sections}</strong><span className={`source-status ${source.status}`}>{source.status === 'reported' ? 'Reported evidence' : source.status === 'limited' ? 'Scope / limitation' : 'Pending verification'}</span></div><h4>{source.title}</h4><p>{source.note}</p></article> })}</div><p className="source-disclaimer">These summaries reference the final report. Assessment and development evidence stay separate. Missing real media is labeled in place.</p></> : null}
    </dialog>
  </div>
}
