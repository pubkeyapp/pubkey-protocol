import { useDisclosure } from '@mantine/hooks'
import { UiHeader, UiHeaderLink, UiLayout } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { AccountChecker } from './features/account/account-ui'
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
        <AccountChecker />
      </ClusterChecker>
      {children}
    </UiLayout>
  )
}
