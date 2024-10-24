import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { UiStack } from '@pubkey-ui/core'
import { PubKeyCommunityCreateInput } from '../data-access'

export function PubkeyProtocolUiCommunityCreateForm({
  submit,
}: {
  submit: (input: PubKeyCommunityCreateInput) => Promise<void>
}) {
  const form = useForm<PubKeyCommunityCreateInput>({ initialValues: { name: '' } })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values }))}>
      <UiStack>
        <TextInput name="name" label="Name" {...form.getInputProps('name')} />
        <Group justify="right">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}
