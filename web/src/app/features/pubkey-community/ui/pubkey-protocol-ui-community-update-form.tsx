import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PubKeyCommunityUpdateInput } from '../data-access'

export function PubkeyProtocolUiCommunityUpdateForm({
  community,
  submit,
}: {
  community: PubKeyCommunity
  submit: (input: PubKeyCommunityUpdateInput) => Promise<void>
}) {
  const form = useForm<PubKeyCommunityUpdateInput>({
    initialValues: {
      avatarUrl: community.avatarUrl ?? '',
      discord: community.discord ?? '',
      farcaster: community.farcaster ?? '',
      github: community.github ?? '',
      name: community.name ?? '',
      slug: community.slug ?? '',
      telegram: community.telegram ?? '',
      website: community.website ?? '',
      x: community.x ?? '',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit({ ...values }))}>
      <UiStack>
        <TextInput
          description="This is the community's unique identifier. It cannot be changed."
          disabled
          label="Slug"
          name="slug"
          {...form.getInputProps('slug')}
        />
        <TextInput description="The community's name." name="name" label="Name" {...form.getInputProps('name')} />

        <TextInput
          description="Link to the community's avatar image."
          label="Avatar URL"
          {...form.getInputProps('avatarUrl')}
        />

        <TextInput
          description="Link to a Discord invite. Should start with https://discord.gg/"
          placeholder="https://discord.gg/..."
          name="discord"
          label="Discord"
          {...form.getInputProps('discord')}
        />
        <TextInput
          description="Link to a Farcaster channel. Should start with https://warpcast.com/"
          placeholder="https://warpcast.com/..."
          name="farcaster"
          label="Farcaster"
          {...form.getInputProps('farcaster')}
        />
        <TextInput
          description="Link to the community's Github repository. Should start with https://github.com/"
          placeholder="https://github.com/..."
          name="github"
          label="Github"
          {...form.getInputProps('github')}
        />
        <TextInput
          description="Link to the community's Telegram channel. Should start with https://t.me/"
          placeholder="https://t.me/..."
          name="telegram"
          label="Telegram"
          {...form.getInputProps('telegram')}
        />
        <TextInput
          description="Link to the community's website. Should start with https://"
          placeholder="https://..."
          name="website"
          label="Website"
          {...form.getInputProps('website')}
        />
        <TextInput
          description="Link to the community's X channel. Should start with https://x.com/"
          placeholder="https://x.com/..."
          name="x"
          label="X"
          {...form.getInputProps('x')}
        />
        <Group justify="right">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}
