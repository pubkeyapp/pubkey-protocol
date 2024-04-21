import { Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { PubKeyProfileCreateInput } from '../data-access'
import { PubkeyProfileUiCreateForm } from './pubkey-profile-ui-create-form'

export function PubkeyProfileUiCreateButton({
  loading,
  submit,
}: {
  loading: boolean
  submit: (input: PubKeyProfileCreateInput) => Promise<void>
}) {
  return (
    <Button
      loading={loading}
      variant="light"
      onClick={() =>
        modals.open({
          centered: true,
          title: 'Create Profile',
          children: <PubkeyProfileUiCreateForm submit={submit} />,
        })
      }
    >
      Create
    </Button>
  )
}
