import { Button, Group, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { PubKeyIdentityProvider, PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiStack } from '@pubkey-ui/core'
import { ellipsify, getEnumOptions } from '../../../ui'
import { useMutationAddIdentity } from '../data-access'

export interface PubKeyProfileAddIdentityInput {
  nickname: string
  providerId: string
  provider: PubKeyIdentityProvider
}

export function PubkeyProtocolUiProfileButtonAddIdentity({ profile }: { profile: PubKeyProfile }) {
  const mutation = useMutationAddIdentity()

  async function submit({ provider, providerId, nickname }: PubKeyProfileAddIdentityInput) {
    return mutation.mutateAsync({
      nickname: nickname ?? ellipsify(providerId),
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
      nickname: '',
      provider: PubKeyIdentityProvider.Solana,
      providerId: '',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <Select
          data={getEnumOptions(PubKeyIdentityProvider)}
          name="provider"
          label="Provider"
          {...form.getInputProps('provider')}
        />
        <TextInput name="providerId" label="Provider ID" {...form.getInputProps('providerId')} />
        <TextInput name="nickname" label="Nickname" {...form.getInputProps('nickname')} />
        <Group justify="right">
          <Button loading={loading} type="submit">
            Save
          </Button>
        </Group>
      </UiStack>
    </form>
  )
}
