import { Divider, Paper, Text } from '@mantine/core'
import { UiGroup, UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'

export function UiAppCard({ action, children, title }: { action?: ReactNode; children: ReactNode; title: string }) {
  return (
    <Paper withBorder py="sm">
      <UiStack>
        <UiGroup px="xs">
          <Text size="lg" fw={500}>
            {title}
          </Text>
          {action}
        </UiGroup>
        <Divider />
        {children}
      </UiStack>
    </Paper>
  )
}
