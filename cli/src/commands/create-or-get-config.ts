import { ensureBalance } from '../utils/ensure-balance'
import { getConfig } from '../utils/get-config'

export async function createOrGetConfig() {
  const { authority, configAuthority, connection, sdk } = await getConfig()
  const exists = await sdk.configGet({ nullable: true })

  if (exists?.configAuthority) {
    console.log(` -> Found config with authority ${exists?.configAuthority?.toString()}`)
    return { config: exists, signature: null }
  }

  await ensureBalance(connection, configAuthority.publicKey)

  const { tx: transaction } = await sdk.configInit({
    authority: configAuthority.publicKey,
    communityAuthority: authority.publicKey,
  })
  transaction.sign([configAuthority, authority])

  const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })

  console.log(
    ` -> Created config with authority ${configAuthority.publicKey.toString()}, community authority ${authority.publicKey.toString()}`,
  )
  return { config: await sdk.configGet({ nullable: true }), signature }
}
