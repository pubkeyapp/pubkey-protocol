export function unique(str: string) {
  return `${str}_${Math.random().toString(36).substring(2, 15)}`
}
