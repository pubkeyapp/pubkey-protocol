export function unique(str: string) {
  return `${str}_${Math.random()
    .toString(36)
    .replace(/[^a-z]/gi, '')
    .substring(0, 5)}`
}
