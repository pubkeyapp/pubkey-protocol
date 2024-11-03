import { Box, Button, Text } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { toastError, UiCard, UiInfo, UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { UiAbout } from '../../../ui'
import { ExplorerLink } from '../../cluster/cluster-ui'
import {
  useMutationCommunityUpdateAuthorityApprove,
  useMutationCommunityUpdateAuthorityDecline,
  useMutationCommunityUpdateAuthorityRequest,
  useQueryCommunityGet,
} from '../data-access'
import { PubkeyProtocolUiCommunityAuthorityForm } from '../ui'

import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureAuthority({ community }: { community: PubKeyCommunity }) {
  const { publicKey } = useWallet()
  const query = useQueryCommunityGet({ community: community.slug })
  const mutationApprove = useMutationCommunityUpdateAuthorityApprove({ community })
  const mutationDecline = useMutationCommunityUpdateAuthorityDecline({ community })
  const mutationRequest = useMutationCommunityUpdateAuthorityRequest({ community })

  return (
    <UiCard>
      <UiAbout
        title="About Authority"
        content={
          'The authority is the wallet that is managing the community. It manages signers, providers and can update the community details.'
        }
      />
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
                  return mutationApprove
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
                  return mutationDecline.mutateAsync({ authority: community.authority }).then(() => query.refetch())
                }}
              >
                Decline
              </Button>
            </Button.Group>
          </UiStack>
        </div>
      ) : (
        <PubkeyProtocolUiCommunityAuthorityGuard
          community={community}
          render={({ disabled }) => (
            <PubkeyProtocolUiCommunityAuthorityForm
              disabled={disabled}
              community={community}
              submit={(input) =>
                mutationRequest
                  .mutateAsync(input)
                  .then(async () => {
                    await query.refetch()
                  })
                  .catch((err) => toastError(`Error: ${err}`))
              }
            />
          )}
        />
      )}
    </UiCard>
  )
}
