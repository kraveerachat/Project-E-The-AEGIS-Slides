import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { thaiPhrases } from './th'

export type Language = 'th' | 'en'
const STORAGE_KEY = 'aegis-presentation-language'
const translatableAttributes = ['aria-label', 'title', 'alt', 'placeholder'] as const
type Original = { english: string; translated: string }
const originalText = new WeakMap<Text, Original>()
const originalAttributes = new WeakMap<Element, Map<string, Original>>()

function localized(input: string, language: Language): string {
  if (language === 'en') return input
  const phrase = input.trim()
  const translated = thaiPhrases[phrase as keyof typeof thaiPhrases]
  if (translated) return input.replace(phrase, translated)
  const planned = phrase.match(/^(\d+:\d+) planned · 15 min maximum$/)
  if (planned) return `${planned[1]} ตามแผน · สูงสุด 15 นาที`
  const media = phrase.match(/^AEGIS · (.+)$/)
  if (media) return `AEGIS · ${localized(media[1], language)}`
  const actual = phrase.match(/^Actual AEGIS (.+)$/)
  if (actual) return `ภาพจริงจาก AEGIS: ${localized(actual[1], language)}`
  const recorded = phrase.match(/^Recorded demonstration of (.+)$/)
  if (recorded) return `วิดีโอสาธิต ${localized(recorded[1], language)}`
  const leadingDot = phrase.match(/^· (.+)$/)
  if (leadingDot && thaiPhrases[leadingDot[1] as keyof typeof thaiPhrases]) return `· ${localized(leadingDot[1], language)}`
  const awaiting = phrase.match(/^(.+): (file unavailable|awaiting real media)$/)
  if (awaiting) return `${localized(awaiting[1], language)}: ${localized(awaiting[2], language)}`
  const diagram = phrase.match(/^(.+)\. Reported connections are solid; reserved integration is dashed\.$/)
  if (diagram) return `${localized(diagram[1], language)} เส้นทึบแสดงความสัมพันธ์ตามรายงาน เส้นประแสดงส่วนที่เตรียมไว้`
  const node = phrase.match(/^(.+)\. (VLAN \d+ · .+|RB750r2 · .+|LAN or Twingate resource|Ubuntu · NGINX|Session · RBAC · ownership|Encryption in the browser|Files \+ Vault ciphertext|Application metadata|Bound to its Edge Node|YOLO · YuNet · SFace|Sessions · camera rights|Full or partial video clip|SCP \/ SSH · SHA-256|PostgreSQL metadata)$/)
  if (node) return `${localized(node[1], language)} · ${localized(node[2], language)}`
  const scene = phrase.match(/^Scene (\d+) of 17(?:: (.+))?\.?$/)
  if (scene) return `ฉาก ${scene[1]} จาก 17${scene[2] ? `: ${thaiPhrases[scene[2] as keyof typeof thaiPhrases] ?? scene[2]}` : ''}${phrase.endsWith('.') ? '.' : ''}`
  const footer = phrase.match(/^(\d{2}) · (.+)$/)
  if (footer) return `${footer[1]} · ${localized(footer[2], language)}`
  const pair = phrase.match(/^(.+?)\. (.+)$/)
  if (pair && (thaiPhrases[pair[1] as keyof typeof thaiPhrases] || thaiPhrases[pair[2] as keyof typeof thaiPhrases])) return `${localized(pair[1], language)} · ${localized(pair[2], language)}`
  const sourceScene = phrase.match(/^SCENE (\d+) · (.+) speaking target$/)
  if (sourceScene) return `ฉาก ${sourceScene[1]} · เวลาเสนอ ${sourceScene[2]}`
  return input
}

function localizeDocument(language: Language) {
  const root = document.getElementById('root')
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const value = node.nodeValue ?? ''
    const previous = originalText.get(node)
    const english = previous && value === previous.translated ? previous.english : value
    const translated = localized(english, language)
    originalText.set(node, { english, translated })
    if (value !== translated) node.nodeValue = translated
  }
  for (const element of [root, ...root.querySelectorAll('*')]) {
    let state = originalAttributes.get(element)
    if (!state) { state = new Map(); originalAttributes.set(element, state) }
    for (const attribute of translatableAttributes) {
      const value = element.getAttribute(attribute)
      if (value === null) continue
      const previous = state.get(attribute)
      const english = previous && value === previous.translated ? previous.english : value
      const translated = localized(english, language)
      state.set(attribute, { english, translated })
      if (value !== translated) element.setAttribute(attribute, translated)
    }
  }
}

function savedLanguage(): Language {
  try { return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'th' } catch { return 'th' }
}

type I18nContextValue = { language: Language; setLanguage: (language: Language) => void; t: (english: string) => string }
const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(savedLanguage)
  const languageRef = useRef(language)
  languageRef.current = language
  useEffect(() => { document.documentElement.lang = language; try { localStorage.setItem(STORAGE_KEY, language) } catch { /* Storage may be disabled. */ } }, [language])
  useLayoutEffect(() => {
    localizeDocument(language)
    const root = document.getElementById('root')
    if (!root) return
    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => { scheduled = false; localizeDocument(languageRef.current) })
    })
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...translatableAttributes] })
    return () => observer.disconnect()
  }, [language])
  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t: english => localized(english, language) }), [language])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('I18nProvider is missing')
  return context
}
