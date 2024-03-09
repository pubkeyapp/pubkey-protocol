import { UiContainer, UiDashboardGrid } from '@pubkey-ui/core'
import { IconListDetails, IconServer } from '@tabler/icons-react'

export function DashboardFeature() {
  return (
    <UiContainer>
      <UiDashboardGrid
        links={[
          { to: '/account', label: 'Account', icon: IconListDetails },
          { to: '/clusters', label: 'Clusters', icon: IconServer },
        ]}
      />
    </UiContainer>
  )
}
