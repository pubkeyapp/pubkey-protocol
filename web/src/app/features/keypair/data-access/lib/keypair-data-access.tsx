import { Keypair as SolanaKeypair } from '@solana/web3.js'
import { useQueryClient } from '@tanstack/react-query'

import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createContext, ReactNode, useContext } from 'react'
import { useBurnToken, useCloseAccount, useTransferToken } from '../../../account/account-data-access'
import { getDefaultFeePayer } from './get-default-fee-payer'

export function formatAmount(amount: number | string, decimals = 2) {
  return Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(parseFloat(amount.toString()))
}

function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export interface Keypair {
  name: string
  publicKey: string
  secretKey: string
  active?: boolean
  solana?: SolanaKeypair
}

const feePayer = getDefaultFeePayer()
export const defaultKeypairs: Keypair[] = [
  {
    name: 'Fee Payer',
    publicKey: feePayer.publicKey.toString(),
    secretKey: `[${feePayer.secretKey.join(',')}]`,
    solana: feePayer,
    active: true,
  },
]

const keypairAtom = atomWithStorage<Keypair>('ppl-keypair', defaultKeypairs[0])
const keypairsAtom = atomWithStorage<Keypair[]>('ppl-keypairs', defaultKeypairs)

const activeKeypairsAtom = atom<Keypair[]>((get) => {
  const keypairs = get(keypairsAtom)
  const keypair = get(keypairAtom)
  return keypairs.map((item) => ({
    ...item,
    active: item?.name === keypair?.name,
  }))
})

const activeKeypairAtom = atom<Keypair>((get) => {
  const keypairs = get(activeKeypairsAtom)

  return keypairs.find((item) => item.active) || keypairs[0]
})

export interface KeypairProviderContext {
  keypair: Keypair
  keypairs: Keypair[]
  addKeypair: (keypair: Keypair) => void
  deleteKeypair: (keypair: Keypair) => void
  importKeypair: (secret: string) => void
  setKeypair: (keypair: Keypair) => void
  generateKeypair: () => void
}

const Context = createContext<KeypairProviderContext>({} as KeypairProviderContext)

export function KeypairProvider({ children }: { children: ReactNode }) {
  const keypair = useAtomValue(activeKeypairAtom)
  const keypairs = useAtomValue(activeKeypairsAtom)
  const setKeypair = useSetAtom(keypairAtom)
  const setKeypairs = useSetAtom(keypairsAtom)

  function addNewKeypair(kp: SolanaKeypair) {
    const keypair: Keypair = {
      name: ellipsify(kp.publicKey.toString()),
      publicKey: kp.publicKey.toString(),
      secretKey: `[${kp.secretKey.join(',')}]`,
    }
    setKeypairs([...keypairs, keypair])
    if (!keypairs.length) {
      activateKeypair(keypair)
    }
  }

  function activateKeypair(keypair: Keypair) {
    const kp = SolanaKeypair.fromSecretKey(new Uint8Array(JSON.parse(keypair.secretKey)))
    setKeypair({ ...keypair, solana: kp })
  }

  function solanaInstance(kp: Keypair): Keypair {
    return {
      ...kp,
      solana: kp?.secretKey ? SolanaKeypair.fromSecretKey(new Uint8Array(JSON.parse(kp?.secretKey))) : undefined,
    }
  }

  const value: KeypairProviderContext = {
    keypair: solanaInstance(keypair),
    keypairs: keypairs.sort((a, b) => (a.name > b.name ? 1 : -1)).map((item) => solanaInstance(item)),
    addKeypair: (keypair: Keypair) => {
      setKeypairs([...keypairs, keypair])
    },
    deleteKeypair: (keypair: Keypair) => {
      setKeypairs(keypairs.filter((item) => item.name !== keypair.name))
    },
    importKeypair(secret: string) {
      addNewKeypair(SolanaKeypair.fromSecretKey(new Uint8Array(JSON.parse(secret))))
    },
    setKeypair: (keypair: Keypair) => activateKeypair(keypair),
    generateKeypair: () => addNewKeypair(SolanaKeypair.generate()),
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useKeypair() {
  return useContext(Context)
}

export function useKeypairTokenOperations({ keypair }: { keypair: SolanaKeypair }) {
  const client = useQueryClient()
  const tokenBurnMutation = useBurnToken({ address: keypair.publicKey })
  const tokenCloseMutation = useCloseAccount({ address: keypair.publicKey })
  const tokenSendMutation = useTransferToken({ address: keypair.publicKey })

  async function refresh() {
    await Promise.all([
      client.invalidateQueries({
        exact: false,
        queryKey: ['getTokenAccounts'],
      }),
      client.invalidateQueries({ exact: false, queryKey: ['getTokenBalance'] }),
      client.invalidateQueries({
        exact: false,
        queryKey: ['useGetAllTokenHolders'],
      }),
    ])
  }

  async function burnTokens(input: { amount: string; source: string; mint: string }) {
    await tokenBurnMutation.mutateAsync({ ...input, feePayer: keypair }).then(() => refresh())
  }

  async function closeAccount(input: { source: string; mint: string }) {
    await tokenCloseMutation.mutateAsync({ ...input, feePayer: keypair }).then(() => refresh())
  }

  async function sendTokens(input: { amount: string; source: string; destination: string; mint: string }) {
    await tokenSendMutation.mutateAsync({ ...input, feePayer: keypair }).then(() => refresh())
  }

  return {
    burnTokens,
    closeAccount,
    sendTokens,
  }
}
