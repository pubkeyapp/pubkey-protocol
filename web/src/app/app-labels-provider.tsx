import { Group, Text, TextProps } from '@mantine/core'
import { PUBKEY_PROTOCOL_PROGRAM_ID } from '@pubkey-protocol/anchor'
import { UiAnchor, UiCopy } from '@pubkey-ui/core'
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useKeypair } from './features/keypair/data-access'

import { ellipsify } from './ui/ellipsify'

export interface Label {
  name: string
  publicKey: string
}

export interface AppLabelsProviderContext {
  labels: Label[]
  labelMap: Map<string, Label>
  getLabel: (publicKey: string) => Label | undefined
}

const Context = createContext<AppLabelsProviderContext>({} as AppLabelsProviderContext)

const defaultLabels: Label[] = [
  { publicKey: PUBKEY_PROTOCOL_PROGRAM_ID.toString(), name: 'PubKey Protocol' },
  { publicKey: TOKEN_PROGRAM_ID.toString(), name: 'Token' },
  { publicKey: TOKEN_2022_PROGRAM_ID.toString(), name: 'Token 2022' },
]

export function AppLabelsProvider({ children }: { children: ReactNode }) {
  const { keypairs } = useKeypair()

  const keypairLabels = useMemo(
    () => keypairs.map((i) => ({ publicKey: i.publicKey.toString(), name: i.name })),
    [keypairs],
  )

  const labels = useMemo(
    () => [
      // Add more label sources here
      ...defaultLabels,
      ...keypairLabels,
    ],
    [keypairLabels],
  )

  const labelMap = useMemo(() => new Map<string, Label>(labels.map((i) => [i.publicKey, i])), [labels])

  const value: AppLabelsProviderContext = {
    labels,
    labelMap,
    getLabel: (publicKey: string) => labelMap.get(publicKey),
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useLabels() {
  return useContext(Context)
}

export function AppLabel({ publicKey, ...props }: TextProps & { publicKey: string }) {
  const { getLabel } = useLabels()

  return <Text {...props}>{getLabel(publicKey)?.name ?? ellipsify(publicKey)}</Text>
}

export function AppLabelLink({ publicKey, to }: { publicKey: string; to?: string }) {
  return (
    <UiAnchor to={to}>
      <Group gap="xs" align="center">
        <UiCopy text={publicKey} />
        <AppLabel publicKey={publicKey} />
      </Group>
    </UiAnchor>
  )
}
