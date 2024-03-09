import { Container, Text, Title } from '@mantine/core'
import { UiStack } from '@pubkey-ui/core'

import { ClusterUiModal, ClusterUiTable } from './cluster-ui'

export default function ClusterFeature() {
  return (
    <Container py="xl" my="xl">
      <UiStack align="center" gap="xl">
        <Title order={2}>Clusters</Title>
        <Text>Manage and select your Solana clusters</Text>
        <ClusterUiModal />
      </UiStack>

      <ClusterUiTable />
    </Container>
  )
}
