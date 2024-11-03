import { ActionIcon, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IdentityProvider, ProfileGet, ProfileGetByProvider, PubKeyProfile } from '@pubkey-protocol/sdk'
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
  const form = useForm<ProfileGetByProvider>({
    initialValues: {
      provider: IdentityProvider.Solana,
      providerId: '',
    },
  })

  async function submit({ provider, providerId }: ProfileGetByProvider) {
    setResult(null)
    sdk
      .profileGetByProvider({ provider, providerId })
      .then((profile) => {
        if (!profile) {
          toastError(`Provider ${provider} ${providerId} not found`)
          return
        }
        toastSuccess(`Found ${profile?.username}`)
        setResult(profile)
      })
      .catch((err) => {
        toastError(`Error fetching provider ${provider} ${providerId}`)
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
  const form = useForm<ProfileGet>({ initialValues: { profile: '' } })

  async function submit({ profile }: ProfileGet) {
    setResult(null)
    sdk
      .profileGet({ profile, nullable: true })
      .then((profile) => {
        if (profile) {
          toastSuccess(`Found ${profile.username}`)
          setResult(profile)
        } else {
          toastInfo(`Profile not found`)
        }
      })
      .catch((err) => {
        toastError(`User ${profile} not found`)
        console.log('err', err)
      })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput
          name="profile"
          label="Username"
          {...form.getInputProps('profile')}
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
