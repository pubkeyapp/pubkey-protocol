import { createInterface } from 'readline'

export async function readInput(message: string): Promise<string> {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question(message, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}
