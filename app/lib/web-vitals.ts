import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals'

// Small EventTarget used to dispatch web-vitals to any listener in the app
const vitalsTarget = (typeof window !== 'undefined' && 'EventTarget' in window) ? new EventTarget() : null

export type WebVitalEvent = {
  name: string
  value: number
  delta: number
  id?: string
  metric?: Metric
}

export function addWebVitalsListener(cb: (ev: CustomEvent<WebVitalEvent>) => void) {
  if (!vitalsTarget) return () => {}
  const handler = (e: Event) => cb(e as CustomEvent<WebVitalEvent>)
  vitalsTarget.addEventListener('web-vital', handler as EventListener)
  return () => vitalsTarget.removeEventListener('web-vital', handler as EventListener)
}

function dispatchVital(metric: Metric) {
  if (!vitalsTarget) return
  const payload: WebVitalEvent = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    metric,
  }
  // debug log to help confirm metrics are emitted
  try { console.debug('[web-vitals] dispatch', payload.name, payload.value) } catch (e) {}
  vitalsTarget.dispatchEvent(new CustomEvent('web-vital', { detail: payload }))
}

// Dispatch a synthetic/fallback metric (value in the same units as web-vitals Metric.value)
function dispatchSynthetic(name: string, value: number) {
  if (!vitalsTarget) return
  const payload: WebVitalEvent = { name, value, delta: 0 }
  try { console.debug('[web-vitals] dispatchSynthetic', name, value) } catch (e) {}
  vitalsTarget.dispatchEvent(new CustomEvent('web-vital', { detail: payload }))
}

export function reportWebVitals() {
  try {
    onLCP((metric: Metric) => dispatchVital(metric))
    // INP replaces FID for modern web-vitals
    onINP((metric: Metric) => dispatchVital(metric))
    onCLS((metric: Metric) => dispatchVital(metric))
    onFCP((metric: Metric) => dispatchVital(metric))
    onTTFB((metric: Metric) => dispatchVital(metric))
    // Fallback: if some metrics fired before listeners were registered, try to read them from Performance entries
    try {
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        // LCP
        try {
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint') as PerformanceEntry[]
          if (lcpEntries && lcpEntries.length) {
            const last = lcpEntries[lcpEntries.length - 1] as any
            const val = (last && (last.renderTime ?? last.startTime ?? last.time)) ?? null
            if (val != null) dispatchSynthetic('LCP', val)
          }
        } catch (e) {}

        // FCP (paint)
        try {
          const paints = performance.getEntriesByType('paint') as PerformanceEntry[]
          const fcp = paints && paints.find((p: any) => p.name === 'first-contentful-paint') as any
          if (fcp) dispatchSynthetic('FCP', fcp.startTime ?? fcp.start ?? fcp.duration ?? 0)
        } catch (e) {}

        // TTFB via Navigation Timing if available
        try {
          const nav = (performance as any).timing || (performance as any).getEntriesByType && (performance as any).getEntriesByType('navigation')?.[0]
          if (nav) {
            const navigationStart = nav.navigationStart ?? nav.startTime ?? 0
            const responseStart = nav.responseStart ?? nav.responseStart ?? 0
            const ttfb = responseStart - navigationStart
            if (ttfb > 0) dispatchSynthetic('TTFB', ttfb)
          }
        } catch (e) {}
      }
    } catch (e) {}
  } catch (e) {
    // ignore in non-browser environments
  }
}
