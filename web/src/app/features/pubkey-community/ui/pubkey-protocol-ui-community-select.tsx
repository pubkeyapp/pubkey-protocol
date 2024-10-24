import { Button, Menu } from '@mantine/core'
import { Link } from 'react-router-dom'
import { usePubKeyCommunity } from '../data-access'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunitySelect() {
  const { communities, community, setCommunity } = usePubKeyCommunity()
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          size="xs"
          variant="light"
          leftSection={<PubkeyProtocolUiCommunityAvatar community={community} size="xs" />}
        >
          {community.name}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {communities.length ? (
          communities.map((item) => (
            <Menu.Item
              disabled={item.slug === community.slug}
              key={item.name}
              onClick={() => setCommunity(item)}
              leftSection={<PubkeyProtocolUiCommunityAvatar community={item} size="xs" />}
            >
              {item.name}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item component={Link} to="/communities">
            Manage Communities
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
