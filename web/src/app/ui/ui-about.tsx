import { Alert, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { ReactNode } from 'react'

export function UiAbout({
  children,
  content,
  title,
}: {
  children?: ReactNode
  content: string | string[]
  title: string
}) {
  const lines = Array.isArray(content) ? content : [content]
  return (
    <Alert variant="light" color="gray" title={title} icon={<IconInfoCircle size={16} />}>
      {lines.map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
      {children}
    </Alert>
  )
}
