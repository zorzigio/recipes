export const storage = {
  get<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): T {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      const parsed = JSON.parse(raw) as unknown
      if (validate && !validate(parsed)) return fallback
      return parsed as T
    } catch {
      return fallback
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore localStorage write errors
    }
  },
}
