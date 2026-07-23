import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {},
) {
  const { freezeOnceVisible = true, ...opts } = options
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const frozen = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || (freezeOnceVisible && frozen.current)) return
    const observer = new IntersectionObserver(([e]) => {
      if (!e) return
      setEntry(e)
      if (e.isIntersecting && freezeOnceVisible) { frozen.current = true; observer.disconnect() }
    }, opts)
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, freezeOnceVisible, opts.threshold, opts.root, opts.rootMargin])

  return { isIntersecting: entry?.isIntersecting ?? false }
}