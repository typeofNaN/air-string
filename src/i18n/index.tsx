/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import zh from './zh-CN.json'
import en from './en-US.json'

type Locale = 'zh-CN' | 'en-US'
const dictionaries = { 'zh-CN': zh, 'en-US': en }

interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof typeof zh) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh-CN')
  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t: (key) => dictionaries[locale][key] }),
    [locale],
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}
