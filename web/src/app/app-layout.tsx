import { AppShell, Loader, rem } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { UiHeader, UiHeaderLink } from '@pubkey-ui/core'
import { ReactNode, Suspense } from 'react'
import { ClusterChecker } from './features/cluster/cluster-ui'
import { KeypairUiBalanceChecker, WalletUiBalanceChecker } from './features/keypair/ui'
import { AppFooter } from './ui/app-footer'

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
    <AppShell
      footer={{ height: rem(56) }}
      header={{ height: rem(56) }}
      padding="md"
      styles={{ main: { overflow: 'auto' } }}
    >
      <AppShell.Header>
        <UiHeader opened={opened} toggle={toggle} links={links} profile={profile} />
      </AppShell.Header>
      <AppShell.Main>
        <Suspense fallback={<Loader />}>
          <ClusterChecker>
            <WalletUiBalanceChecker />
            <KeypairUiBalanceChecker />
          </ClusterChecker>
          {children}
        </Suspense>
        <AppShell.Footer>
          <AppFooter />
        </AppShell.Footer>
      </AppShell.Main>
    </AppShell>
  )
}
