import { ActionIcon, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IdentityProvider, PubKeyProfile } from '@pubkey-protocol/anchor'
import { GetProfileByProvider, GetProfileByUsername } from '@pubkey-protocol/sdk'
import { toastError, toastInfo, toastSuccess, UiCard, UiStack } from '@pubkey-ui/core'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { getEnumOptions } from '../../../ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { PubkeyProtocolUiProfile } from '../ui'

export function PubkeyProfileFeatureSearch() {
  return (
    <UiStack>
      <UiCard title="Search by Username">
        <SearchByUsername />
      </UiCard>
      <UiCard title="Search by Provider">
        <SearchByProvider />
      </UiCard>
    </UiStack>
  )
}

function SearchByProvider() {
  const [result, setResult] = useState<PubKeyProfile | null>(null)
  const { sdk } = usePubKeyProtocol()
  const form = useForm<GetProfileByProvider>({
    initialValues: {
      provider: IdentityProvider.Solana,
      providerId: '',
    },
  })

  async function submit({ provider, providerId }: GetProfileByProvider) {
    setResult(null)
    sdk
      .getProfileByProvider({ provider, providerId })
      .then((profile) => {
        toastSuccess(`Found ${profile.username}`)
        setResult(profile)
      })
      .catch((err) => {
        toastError(`Provider ${provider} ${providerId} not found`)
        console.log('err', err)
      })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <Select
          data={getEnumOptions(IdentityProvider)}
          name="provider"
          label="Provider"
          {...form.getInputProps('provider')}
        />

        <TextInput
          name="providerId"
          label="Provider ID"
          {...form.getInputProps('providerId')}
          rightSection={
            <ActionIcon variant="light" type="submit">
              <IconSearch size="16" />
            </ActionIcon>
          }
        />

        {result ? (
          <UiCard>
            <PubkeyProtocolUiProfile profile={result} to={`/profiles/${result.username}`} />
          </UiCard>
        ) : null}
      </UiStack>
    </form>
  )
}

function SearchByUsername() {
  const [result, setResult] = useState<PubKeyProfile | null>(null)
  const { sdk } = usePubKeyProtocol()
  const form = useForm<GetProfileByUsername>({ initialValues: { username: '' } })

  async function submit({ username }: GetProfileByUsername) {
    setResult(null)
    sdk
      .getProfileByUsernameNullable({ username })
      .then((profile) => {
        if (profile) {
          toastSuccess(`Found ${profile.username}`)
          setResult(profile)
        } else {
          toastInfo(`Profile not found`)
        }
      })
      .catch((err) => {
        toastError(`User ${username} not found`)
        console.log('err', err)
      })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput
          name="username"
          label="Username"
          {...form.getInputProps('username')}
          rightSection={
            <ActionIcon variant="light" type="submit">
              <IconSearch size="16" />
            </ActionIcon>
          }
        />
        {result ? (
          <UiCard>
            <PubkeyProtocolUiProfile profile={result} to={`/profiles/${result.username}`} />{' '}
          </UiCard>
        ) : null}
      </UiStack>
    </form>
  )
}
