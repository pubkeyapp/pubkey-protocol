import { Title, TitleProps } from '@mantine/core'
import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '../account-data-access'

import { BalanceSol } from './balance-sol'

export function AccountUiBalance({ address, ...props }: { address: PublicKey } & TitleProps) {
  const query = useGetBalance({ address })

  return (
    <Title onClick={() => query.refetch()} {...props}>
      {query.data ? <BalanceSol balance={query.data} /> : '...'} SOL
    </Title>
  )
}
