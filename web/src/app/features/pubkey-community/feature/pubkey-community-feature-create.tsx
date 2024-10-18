import { toastError, UiCard } from '@pubkey-ui/core'
import { useNavigate } from 'react-router-dom'
import { useMutationCreateCommunity } from '../data-access'
import { PubkeyProtocolUiCommunityCreateForm } from '../ui'

export function PubkeyCommunityFeatureCreate() {
  const mutation = useMutationCreateCommunity()
  const navigate = useNavigate()
  return (
    <UiCard title="Create Community">
      <PubkeyProtocolUiCommunityCreateForm
        submit={(input) =>
          mutation
            .mutateAsync(input)
            .then((res) => navigate(`../${res.input.slug}`))
            .catch((err) => toastError(`Error: ${err}`))
        }
      />
    </UiCard>
  )
}
