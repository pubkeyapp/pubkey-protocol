import { ActionIcon, Group, Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { toastError, UiCard, UiStack } from '@pubkey-ui/core'
import { IconTrash } from '@tabler/icons-react'
import { UiAbout } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { useMutationCommunitySignerAdd, useMutationCommunitySignerRemove, useQueryCommunityGet } from '../data-access'
import { PubkeyProtocolUiCommunitySignerForm } from '../ui'
import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureSigners({ community }: { community: PubKeyCommunity }) {
  const query = useQueryCommunityGet({ community: community.slug })
  const mutationAdd = useMutationCommunitySignerAdd({ community })
  const mutationRemove = useMutationCommunitySignerRemove({ community })

  return (
    <UiCard>
      <UiAbout
        title="About Signers"
        content={[
          'The signers can sign transactions for this community. They are managed by the community authority.',
          'They are intended to be used by a backend service to sign transactions on behalf of the community.',
        ]}
      />
      <PubkeyProtocolUiCommunityAuthorityGuard
        community={community}
        render={({ disabled }) => (
          <UiStack>
            <Text size="sm">Signers</Text>
            {community.signers.map((signer) => (
              <Group key={signer.toString()} justify="space-between">
                <Group align="center" gap={4}>
                  <ExplorerLink size="xs" ff="mono" path={`account/${signer}`} label={signer.toString()} />
                </Group>
                <ActionIcon
                  disabled={disabled}
                  size="xs"
                  variant="light"
                  color="red"
                  onClick={() => {
                    return mutationRemove
                      .mutateAsync({ signer: signer.toString() })
                      .then(() => query.refetch())
                      .catch((err) => toastError(err))
                  }}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              </Group>
            ))}

            <PubkeyProtocolUiCommunitySignerForm
              community={community}
              disabled={disabled}
              submit={(input) =>
                mutationAdd
                  .mutateAsync(input)
                  .then(async (res) => {
                    console.log('res', res)
                    await query.refetch()
                  })
                  .catch((err) => toastError(`Error: ${err}`))
              }
            />
          </UiStack>
        )}
      />
    </UiCard>
  )
}
