import { Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { PubKeyProfileCreateInput } from '../data-access'
import { PubkeyProtocolUiCreateForm } from './pubkey-protocol-ui-create-form'

export function PubkeyProtocolUiCreateButton({
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
          children: <PubkeyProtocolUiCreateForm submit={submit} />,
        })
      }
    >
      Create
    </Button>
  )
}
