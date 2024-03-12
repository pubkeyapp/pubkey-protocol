import { useDisclosure } from '@mantine/hooks'
import { UiHeader, UiHeaderLink, UiLayout } from '@pubkey-ui/core'
import { ReactNode } from 'react'

import { AccountUiChecker } from './features/account/ui/account-ui-checker'
import { AccountUiKeypairChecker } from './features/account/ui/account-ui-keypair-checker'
import { ClusterChecker } from './features/cluster/cluster-ui'

export function AppLayout({
  children,
  links,
  profile,
}: {
  children: ReactNode
  links: UiHeaderLink[]
  profile: ReactNode
}) {
  const [opened, { toggle }] = useDisclosure(false)
  return (
    <UiLayout header={<UiHeader opened={opened} toggle={toggle} links={links} profile={profile} />}>
      <ClusterChecker>
        <AccountUiChecker />
        <AccountUiKeypairChecker />
      </ClusterChecker>
      {children}
    </UiLayout>
  )
}
