import { UiBack, UiInfo, UiPage } from '@pubkey-ui/core'

export default function DevRoutes() {
  return (
    <UiPage leftAction={<UiBack />} title="Development">
      <UiInfo message={'This is the Developer page. It is not currently used.'} />
    </UiPage>
  )
}
