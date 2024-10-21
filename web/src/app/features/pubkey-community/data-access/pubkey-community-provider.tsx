import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiError, UiLoader } from '@pubkey-ui/core'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryCommunityGetAll } from './use-query-community-get-all'

export type PubKeyCommunityMap = Record<string, PubKeyCommunity>

export function convertPubKeyCommunitiesToMap(communities: PubKeyCommunity[]): PubKeyCommunityMap {
  return communities.reduce(
    (map, community) => ({ ...map, [community.publicKey.toString()]: community }),
    {} as PubKeyCommunityMap,
  )
}

export interface PubKeyCommunityProviderContext {
  communities: PubKeyCommunity[]
  community: PubKeyCommunity
  communityMap: PubKeyCommunityMap
  setCommunity: (community: PubKeyCommunity) => void
}

const Context = createContext<PubKeyCommunityProviderContext>({} as PubKeyCommunityProviderContext)

export function PubKeyCommunityProvider({ children }: { children: ReactNode }) {
  const query = useQueryCommunityGetAll()

  const [community, setCommunity] = useState<PubKeyCommunity | undefined>(undefined)

  useEffect(() => {
    if (community || !query.data?.length) {
      return
    }
    if (query.data.length) {
      setCommunity(query.data[0])
    }
  }, [query.data, community])

  const communities = useMemo(() => query.data ?? [], [query.data])
  const communityMap = useMemo(() => convertPubKeyCommunitiesToMap(query.data ?? []), [query.data])

  if (query.isLoading) {
    return <UiLoader />
  }

  if (!query.data) {
    return <UiError message="No communities found" />
  }
  if (!community) {
    return <UiError message="No community found" />
  }

  const value: PubKeyCommunityProviderContext = {
    communities,
    communityMap,
    community,
    setCommunity: (community: PubKeyCommunity) => {
      setCommunity(community)
    },
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function usePubKeyCommunity() {
  return useContext(Context)
}
