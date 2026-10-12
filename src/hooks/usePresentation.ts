import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { scenes, sceneAliases } from '../data/content'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const query = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(query.matches); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return reduced
}
export function useStageScale() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  useEffect(() => { const update = () => setSize({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update) }, [])
  return { scale: Math.min(size.width / 1920, size.height / 1080), narrow: size.width < 900 && size.height > size.width }
}
function initialScene() { const id = window.location.hash.replace(/^#\/?/, ''); const index = scenes.findIndex(scene => scene.id === (sceneAliases[id] ?? id)); return index < 0 ? 0 : index }

export function usePresentation(reduced: boolean, reading: boolean) {
  const [index, setIndex] = useState(initialScene)
  const [transitioning, setTransitioning] = useState(false)
  const sceneRef = useRef<HTMLDivElement>(null)
  const locked = useRef(false)
  const direction = useRef(1)
  const hasNavigated = useRef(false)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  const goToIndex = useCallback((next: number) => {
    if (next < 0 || next >= scenes.length || next === index || locked.current) return
    direction.current = next > index ? 1 : -1
    hasNavigated.current = true
    locked.current = true
    setTransitioning(true)
    timeline.current?.kill()
    if (reduced || reading || !sceneRef.current) { setIndex(next); return }
    timeline.current = gsap.timeline().to(sceneRef.current, { x: -direction.current * 110, opacity: 0, duration: .22, ease: 'power2.in', onComplete: () => setIndex(next) })
  }, [index, reduced, reading])
  const goTo = useCallback((id: string) => goToIndex(scenes.findIndex(scene => scene.id === id)), [goToIndex])

  useLayoutEffect(() => {
    const element = sceneRef.current
    if (!element) return
    timeline.current?.kill()
    window.history.replaceState(null, '', `#${scenes[index].id}`)
    document.title = `${scenes[index].title} — AEGIS Presentation`
    const complete = () => { locked.current = false; setTransitioning(false) }
    if (hasNavigated.current) { element.focus({ preventScroll: true }); if (reading) window.scrollTo({ top: 0, behavior: 'instant' }) }
    if (reduced || reading) { gsap.set(element, { x: 0, opacity: 1 }); complete(); return }
    const context = gsap.context(() => {
      timeline.current = gsap.timeline({ onComplete: complete })
        .fromTo(element, { x: hasNavigated.current ? direction.current * 95 : 0, opacity: .25 }, { x: 0, opacity: 1, duration: .55, ease: 'power3.out' })
      const children = element.querySelectorAll('.reveal')
      if (children.length) timeline.current.fromTo(children, { y: index === 0 ? 26 : 14, opacity: .25 }, { y: 0, opacity: 1, duration: .5, stagger: { amount: .18 }, ease: 'power3.out' }, .08)
      if (index === 0) timeline.current.fromTo('.cover-art', { scale: 1.045, opacity: .5 }, { scale: 1, opacity: 1, duration: .8, ease: 'power2.out' }, 0)
      if (scenes[index].id === 'hardware-setup') {
        timeline.current
          .fromTo('.hardware-main-photo .hardware-photo-viewport', { clipPath: 'inset(0% 100% 0% 0% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: .68, ease: 'power3.out' }, .12)
          .fromTo('.hardware-support .hardware-photo', { x: 38, opacity: .4 }, { x: 0, opacity: 1, duration: .52, ease: 'power3.out' }, .28)
          .fromTo('.hardware-label', { y: 12, opacity: .35 }, { y: 0, opacity: 1, duration: .4, stagger: .08, ease: 'power3.out' }, .48)
      }
    }, element)
    return () => { context.revert(); timeline.current?.kill() }
  }, [index, reduced, reading])

  useEffect(() => { const onHash = () => goToIndex(initialScene()); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [goToIndex])
  return { index, scene: scenes[index], goToIndex, goTo, sceneRef, transitioning }
}
