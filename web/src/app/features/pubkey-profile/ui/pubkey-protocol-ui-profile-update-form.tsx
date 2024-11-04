import { Button, Divider, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { PubKeyProfileUpdateInput } from '../data-access'
import { PubkeyProtocolUiProfile } from './pubkey-protocol-ui-profile'

export function PubkeyProtocolUiProfileUpdateForm({
  profile,
  disabled,
  submit,
}: {
  profile: PubKeyProfile
  disabled?: boolean
  submit: (input: PubKeyProfileUpdateInput) => Promise<void>
}) {
  const form = useForm<PubKeyProfileUpdateInput>({
    initialValues: {
      avatarUrl: profile.avatarUrl ?? '',
      bio: profile.bio ?? '',
      name: profile.name ?? '',
      username: profile.username ?? '',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values }))}>
      <UiStack>
        <TextInput
          description="This is the profile's unique identifier. It cannot be changed."
          disabled
          label="Username"
          name="username"
          {...form.getInputProps('username')}
        />
        <TextInput
          disabled={disabled}
          description="The profile's name."
          name="name"
          label="Name"
          {...form.getInputProps('name')}
        />
        <TextInput
          disabled={disabled}
          description="The profile's bio."
          label="Description"
          name="bio"
          {...form.getInputProps('bio')}
        />
        <TextInput
          disabled={disabled}
          description="Link to the profile's avatar image."
          label="Avatar URL"
          {...form.getInputProps('avatarUrl')}
        />

        <Group justify="right">
          <Button disabled={disabled} type="submit">
            Save
          </Button>
        </Group>
        <Divider label="Preview" />
        <PubkeyProtocolUiProfile
          profile={{
            publicKey: PublicKey.default,
            avatarUrl: form.values.avatarUrl ?? profile.avatarUrl,
            bio: form.values.bio ?? profile.bio,
            name: form.values.name ?? profile.name,
            username: form.values.username,
            authorities: [],
            identities: [],
          }}
        />
      </UiStack>
    </form>
  )
}
