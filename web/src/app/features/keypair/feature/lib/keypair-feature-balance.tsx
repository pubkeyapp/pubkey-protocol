import { Title, TitleProps } from '@mantine/core'
import { PublicKey } from '@solana/web3.js'
import { useGetBalance } from '../../data-access'
import { KeypairUiBalanceSol } from '../../ui'

export function KeypairFeatureBalance({ address, ...props }: { address: PublicKey } & TitleProps) {
  const query = useGetBalance({ address })

  return (
    <Title onClick={() => query.refetch()} {...props}>
      {query.data ? <KeypairUiBalanceSol balance={query.data} /> : '...'} SOL
    </Title>
  )
}
