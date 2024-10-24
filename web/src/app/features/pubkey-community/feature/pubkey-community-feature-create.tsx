import { toastError, UiBack, UiCard, UiPage } from '@pubkey-ui/core'
import { useNavigate } from 'react-router-dom'
import { PubkeyProtocolCommunityAuthorityGuard } from '../../pubkey-protocol/data-access/pubkey-protocol-community-authority-guard'
import { useMutationCommunityCreate } from '../data-access'
import { PubkeyProtocolUiCommunityCreateForm } from '../ui'

export function PubkeyCommunityFeatureCreate() {
  const mutation = useMutationCommunityCreate()
  const navigate = useNavigate()

  return (
    <UiPage leftAction={<UiBack />} title="Create Community">
      <UiCard>
        <PubkeyProtocolCommunityAuthorityGuard>
          <PubkeyProtocolUiCommunityCreateForm
            submit={(input) =>
              mutation
                .mutateAsync(input)
                .then((res) => navigate(`../${res.input.slug}`))
                .catch((err) => toastError(`Error: ${err}`))
            }
          />
        </PubkeyProtocolCommunityAuthorityGuard>
      </UiCard>
    </UiPage>
  )
}
