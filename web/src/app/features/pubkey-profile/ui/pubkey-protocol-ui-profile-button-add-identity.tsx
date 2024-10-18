import { Button, Group, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { IdentityProvider, PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'
import { ellipsify, getEnumOptions } from '../../../ui'
import { useMutationAddIdentity } from '../data-access'

export interface PubKeyProfileAddIdentityInput {
  name: string
  providerId: string
  provider: IdentityProvider
}

export function PubkeyProtocolUiProfileButtonAddIdentity({ profile }: { profile: PubKeyProfile }) {
  const mutation = useMutationAddIdentity()

  async function submit({ provider, providerId, name }: PubKeyProfileAddIdentityInput) {
    return mutation.mutateAsync({
      name: name ?? ellipsify(providerId),
      providerId,
      provider,
      username: profile.username,
    })
  }

  return (
    <Button
      size="xs"
      variant="light"
      loading={mutation.isPending}
      onClick={() =>
        modals.open({
          title: 'Add Identity',
          children: <PubKeyProfileUiAddIdentityForm loading={mutation.isPending} submit={submit} />,
        })
      }
    >
      Add
    </Button>
  )
}

function PubKeyProfileUiAddIdentityForm({
  loading,
  submit,
}: {
  loading: boolean
  submit: (input: PubKeyProfileAddIdentityInput) => Promise<string>
}) {
  const form = useForm<PubKeyProfileAddIdentityInput>({
    initialValues: {
      name: '',
      provider: IdentityProvider.Solana,
      providerId: '',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <Select
          data={getEnumOptions(IdentityProvider)}
          name="provider"
          label="Provider"
          {...form.getInputProps('provider')}
        />
        <TextInput name="providerId" label="Provider ID" {...form.getInputProps('providerId')} />
        <TextInput name="name" label="Name" {...form.getInputProps('name')} />
        <Group justify="right">
          <Button loading={loading} type="submit">
            Save
          </Button>
        </Group>
      </UiStack>
    </form>
  )
}
