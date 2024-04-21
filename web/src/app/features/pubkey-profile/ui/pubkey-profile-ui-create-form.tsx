import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { UiStack } from '@pubkey-ui/core'
import { PubKeyProfileCreateInput } from '../data-access'

export function PubkeyProfileUiCreateForm({ submit }: { submit: (input: PubKeyProfileCreateInput) => Promise<void> }) {
  const form = useForm<PubKeyProfileCreateInput>({ initialValues: { avatarUrl: '', username: '' } })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput name="username" label="Username" {...form.getInputProps('username')} />
        <TextInput name="avatarUrl" label="AvatarUrl" type="url" {...form.getInputProps('avatarUrl')} />
        <Group justify="right">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}
