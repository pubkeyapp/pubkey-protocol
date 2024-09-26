import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { UiStack } from '@pubkey-ui/core'
import { PubKeyProfileCreateInput } from '../data-access'

export function PubkeyProtocolUiProfileCreateForm({
  submit,
}: {
  submit: (input: PubKeyProfileCreateInput) => Promise<void>
}) {
  const form = useForm<PubKeyProfileCreateInput>({ initialValues: { avatarUrl: '', name: '', username: '' } })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values, name: values.username }))}>
      <UiStack>
        <TextInput name="username" label="Username" {...form.getInputProps('username')} />
        <Group justify="right">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}
