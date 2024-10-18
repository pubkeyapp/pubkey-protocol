import { Box, Button, Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { toastError, UiCard, UiInfo, UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import {
  useMutationCancelUpdateCommunityAuthority,
  useMutationFinalizeUpdateCommunityAuthority,
  useMutationInitiateUpdateCommunityAuthority,
  useQueryGetCommunityBySlug,
} from '../data-access'
import { PubkeyProtocolUiCommunityAuthorityForm } from '../ui'

import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureAuthority({ community }: { community: PubKeyCommunity }) {
  const { publicKey } = useWallet()
  const query = useQueryGetCommunityBySlug({ slug: community.slug })
  const mutationInitiate = useMutationInitiateUpdateCommunityAuthority({ community })
  const mutationFinalize = useMutationFinalizeUpdateCommunityAuthority({ community })
  const mutationCancel = useMutationCancelUpdateCommunityAuthority({ community })

  return (
    <UiCard>
      {community.pendingAuthority?.toString()?.length ? (
        <div>
          <UiStack>
            <Box>
              <Text span>Current Authority</Text>
              <ExplorerLink
                size="xs"
                ff="mono"
                path={`account/${community.authority}`}
                label={community.authority?.toString()}
              />
            </Box>

            <Box>
              <Text span>Pending Authority</Text>
              <ExplorerLink
                size="xs"
                ff="mono"
                path={`account/${community.pendingAuthority}`}
                label={community.pendingAuthority?.toString()}
              />
            </Box>

            {community.authority?.toString() === publicKey?.toString() ? (
              <UiInfo
                title="Connect Pending Authority Wallet"
                message={
                  <UiStack>
                    <Text>Connect the wallet of the pending authority to approve the change.</Text>
                    <ExplorerLink
                      size="xs"
                      ff="mono"
                      path={`account/${community.pendingAuthority}`}
                      label={community.pendingAuthority?.toString()}
                    />
                  </UiStack>
                }
              />
            ) : null}

            <Button.Group>
              <Button
                disabled={community.pendingAuthority?.toString() !== publicKey?.toString()}
                onClick={() => {
                  if (!community.pendingAuthority) {
                    return
                  }
                  return mutationFinalize
                    .mutateAsync({ newAuthority: community.pendingAuthority })
                    .then(() => query.refetch())
                }}
              >
                Approve
              </Button>
              <Button
                disabled={community.authority?.toString() !== publicKey?.toString()}
                onClick={() => {
                  if (!community.authority) {
                    return
                  }
                  return mutationCancel.mutateAsync({ authority: community.authority }).then(() => query.refetch())
                }}
              >
                Cancel
              </Button>
            </Button.Group>
          </UiStack>
        </div>
      ) : (
        <PubkeyProtocolUiCommunityAuthorityGuard community={community}>
          <PubkeyProtocolUiCommunityAuthorityForm
            community={community}
            submit={(input) =>
              mutationInitiate
                .mutateAsync(input)
                .then(async () => {
                  await query.refetch()
                })
                .catch((err) => toastError(`Error: ${err}`))
            }
          />
        </PubkeyProtocolUiCommunityAuthorityGuard>
      )}
    </UiCard>
  )
}
