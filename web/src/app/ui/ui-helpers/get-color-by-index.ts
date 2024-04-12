export const colorByIndex = ['violet', 'indigo', 'blue', 'green', 'teal', 'cyan', 'pink', 'red', 'orange']
export function getColorByIndex(index: number, colors: string[] = colorByIndex) {
  return colors[index % colors.length]
}
