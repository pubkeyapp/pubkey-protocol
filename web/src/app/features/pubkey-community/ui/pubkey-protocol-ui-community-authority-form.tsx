import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'

export function PubkeyProtocolUiCommunityAuthorityForm({
  community,
  submit,
}: {
  community: PubKeyCommunity
  submit: (input: { authority: string; newAuthority: string }) => Promise<void>
}) {
  const form = useForm<{ authority: string; newAuthority: string }>({
    initialValues: {
      authority: community.authority.toString(),
      newAuthority: '',
    },
    validate: (values) => {
      if (!values.newAuthority?.length) {
        return { newAuthority: 'New authority is required.' }
      }
      if (values.authority === values.newAuthority) {
        return { newAuthority: 'Authority cannot be the same as the current authority.' }
      }
      return {}
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values }))}>
      <UiStack>
        <TextInput
          description="The existing authority that is currently managing the community."
          disabled
          label="Authority"
          name="authority"
          {...form.getInputProps('authority')}
        />
        <TextInput
          description="The new authority that will be managing the community."
          required
          label="New Authority"
          name="newAuthority"
          {...form.getInputProps('newAuthority')}
        />
        <Group justify="right">
          <Button disabled={!form.isValid()} type="submit">
            Save
          </Button>
        </Group>
      </UiStack>
    </form>
  )
}
