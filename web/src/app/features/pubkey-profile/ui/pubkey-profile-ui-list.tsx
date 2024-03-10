import { SimpleGrid } from '@mantine/core'
import { UiAlert, UiDebug, UiInfo, UiLoader, UiStack } from '@pubkey-ui/core'
import { usePubkeyProfileProgram } from '../data-access'
import { PubkeyProfileUiCard } from './pubkey-profile-ui-card'

export function PubkeyProfileUiList() {
  const { profileAccounts, getProgramAccount, pointerAccounts } = usePubkeyProfileProgram()

  if (getProgramAccount.isLoading) {
    return <UiLoader />
  }
  if (!getProgramAccount.data?.value) {
    return (
      <UiAlert
        message={
          <span>
            Program account not found. Make sure you have deployed the program and are on the correct cluster.
          </span>
        }
      />
    )
  }

  return (
    <UiStack>
      {profileAccounts.isLoading ? (
        <UiLoader />
      ) : profileAccounts.data?.length ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {profileAccounts.data?.map((account) => (
            <PubkeyProfileUiCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </SimpleGrid>
      ) : (
        <UiInfo title="No Profiles" message="No Profiles found. Create one above to get started." />
      )}
      <UiDebug
        data={{
          gpa: getProgramAccount.data,
          profileAccounts: profileAccounts.data,
          pointerAccounts: pointerAccounts.data,
          err: profileAccounts.error,
        }}
      />
    </UiStack>
  )
}
