import { ActionIcon, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { IconPlus } from '@tabler/icons-react'

export function PubkeyProtocolUiCommunitySignerForm({
  community,
  disabled,
  submit,
}: {
  community: PubKeyCommunity
  disabled?: boolean
  submit: (input: { signer: string }) => Promise<void>
}) {
  const form = useForm<{ signer: string }>({
    initialValues: {
      signer: '',
    },
    validate: (values) => {
      if (community.signers.map((signer) => signer.toString()).includes(values.signer)) {
        return { newAuthority: `Signer already exists` }
      }
      return {}
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values }).then(() => form.reset()))}>
      <UiStack>
        <TextInput
          disabled={disabled}
          description="Public key of the signer to add to the community."
          label="Signer"
          name="signer"
          required
          {...form.getInputProps('signer')}
          rightSection={
            <ActionIcon disabled={disabled || !form.isValid()} variant="light" color="green" type="submit">
              <IconPlus size="16" />
            </ActionIcon>
          }
        />
      </UiStack>
    </form>
  )
}
