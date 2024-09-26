import { PubkeyProtocolSdk } from '@pubkey-protocol/sdk'
import { useQuery } from '@tanstack/react-query'
import { Cluster } from '../../cluster/cluster-data-access'

export function useQueryGetProgramAccount({ cluster, sdk }: { cluster: Cluster; sdk: PubkeyProtocolSdk }) {
  return useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => sdk.getProgramAccount(),
    retry: false,
  })
}
