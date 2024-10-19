import { ActionIcon, Group } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { toastError, UiCard, UiStack } from '@pubkey-ui/core'
import { IconTrash } from '@tabler/icons-react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import {
  useMutationCommunitySignerAdd,
  useMutationCommunitySignerRemove,
  useQueryCommunityGetBySlug,
} from '../data-access'
import { PubkeyProtocolUiCommunitySignerForm } from '../ui'
import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureSigners({ community }: { community: PubKeyCommunity }) {
  const query = useQueryCommunityGetBySlug({ slug: community.slug })
  const mutationAdd = useMutationCommunitySignerAdd({ community })
  const mutationRemove = useMutationCommunitySignerRemove({ community })

  return (
    <UiCard>
      <PubkeyProtocolUiCommunityAuthorityGuard community={community}>
        <UiStack>
          {community.signers.map((signer) => (
            <Group key={signer.toString()} justify="space-between">
              <Group align="center" gap={4}>
                <ExplorerLink size="xs" ff="mono" path={`account/${signer}`} label={signer.toString()} />
              </Group>
              <ActionIcon
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
      </PubkeyProtocolUiCommunityAuthorityGuard>
    </UiCard>
  )
}
