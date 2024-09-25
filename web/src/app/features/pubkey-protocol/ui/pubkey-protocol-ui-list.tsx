import { SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiInfo, UiStack } from '@pubkey-ui/core'

import { PubkeyProtocolUiListItem } from './pubkey-protocol-ui-list-item'

export function PubkeyProtocolUiList({ profiles, basePath }: { profiles: PubKeyProfile[]; basePath?: string }) {
  return (
    <UiStack>
      {profiles?.length ? (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {profiles?.map((account) => (
            <PubkeyProtocolUiListItem basePath={basePath} key={account.publicKey?.toString()} profile={account} />
          ))}
        </SimpleGrid>
      ) : (
        <UiInfo title="No Profiles" message="No Profiles found. Create one above to get started." />
      )}
    </UiStack>
  )
}
