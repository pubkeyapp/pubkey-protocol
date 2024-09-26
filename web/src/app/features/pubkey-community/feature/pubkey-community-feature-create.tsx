import { toastError, toastSuccess, UiCard, UiPage } from '@pubkey-ui/core'
import { IconUserPlus } from '@tabler/icons-react'
import { useMutationCreateCommunity } from '../data-access'
import { PubkeyProtocolUiCommunityCreateForm } from '../ui'

export function PubkeyCommunityFeatureCreate() {
  const mutation = useMutationCreateCommunity()

  return (
    <UiPage leftAction={<IconUserPlus />} title="Create Community">
      <UiCard title="Create Community">
        <PubkeyProtocolUiCommunityCreateForm
          submit={(input) =>
            mutation
              .mutateAsync(input)
              .then(() => toastSuccess(`Community created`))
              .catch((err) => toastError(`Error: ${err}`))
          }
        />
      </UiCard>
    </UiPage>
  )
}
