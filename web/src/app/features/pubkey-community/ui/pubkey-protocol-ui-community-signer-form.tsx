import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'

export function PubkeyProtocolUiCommunitySignerForm({
  community,
  submit,
}: {
  community: PubKeyCommunity
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
    <form
      onSubmit={form.onSubmit((values) =>
        submit({ ...values }).then(() => {
          form.reset()
        }),
      )}
    >
      <UiStack>
        <TextInput
          description="Public key of the signer to add to the community."
          label="Signer"
          name="signer"
          {...form.getInputProps('signer')}
        />
        <Group justify="right">
          <Button disabled={!form.isValid()} type="submit">
            Add
          </Button>
        </Group>
      </UiStack>
    </form>
  )
}
