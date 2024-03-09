import { Button, Group, Text } from '@mantine/core'
import { UiCard, UiCardTitle, UiGroup, UiStack } from '@pubkey-ui/core'
import { useKeypair } from '../../data-access'
import { KeypairUiModal, KeypairUiTable } from '../../ui'

export function KeypairListFeature() {
  const { generateKeypair } = useKeypair()
  return (
    <UiStack>
      <UiCard
        title={
          <UiGroup>
            <UiCardTitle>Keypairs</UiCardTitle>
            <Group justify="end">
              <Button onClick={generateKeypair}>Generate Keypair</Button>
              <KeypairUiModal />
            </Group>
          </UiGroup>
        }
      >
        <UiStack>
          <Text>You can store your keys in the browser's local storage.</Text>
          <Text>These keypairs are used to manage your tokens.</Text>
        </UiStack>
      </UiCard>
      <KeypairUiTable />
    </UiStack>
  )
}
