export function toPositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

// Own properties only, so a key like "constructor" can't resolve to Object.prototype.
export function getOwn<T>(record: Record<string, T>, key: string): T | null {
  return Object.hasOwn(record, key) ? record[key] : null
}
