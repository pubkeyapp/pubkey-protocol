import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'
import { convertPubKeyProfilesToMap, PubKeyProfileMap } from './convert-to-map'
import { losPda, pubkeyPda } from './dev-data-communities'
import { createDevIdentityGithub, createDevIdentitySolana, createDevProfile } from './index'

export const beemanPda = new PublicKey('BeeLReKDRAZS1bNv32gVXn5k8gQmfJJtSmDrTfVGF2R9')
export const harklPda = new PublicKey('HKL3NaGgrLaPAAxQrERJjT3LPgz48csGAaQmrGJxsQkr')

export const beeman: PubKeyProfile = createDevProfile({
  name: 'beeman 🅿️',
  username: 'beeman',
  identities: [
    createDevIdentityGithub({ communities: [pubkeyPda, losPda], providerId: '36491', name: 'beeman' }),
    createDevIdentitySolana({ communities: [pubkeyPda], providerId: 'BEEMANPx2jdmfR7jpn1hRdMuM2Vj4E3azBLb6RUBrCDY' }),
  ],
  publicKey: beemanPda,
})
export const harkl: PubKeyProfile = createDevProfile({
  name: 'harkl',
  identities: [
    createDevIdentityGithub({ communities: [pubkeyPda], providerId: '6491', name: 'harkl' }),
    createDevIdentitySolana({
      communities: [pubkeyPda, losPda],
      providerId: 'HKL3NaGgrLaPAAxQrERJjT3LPgz48csGAaQmrGJxsQkr',
    }),
  ],
  publicKey: harklPda,
})

export const profiles: PubKeyProfile[] = [beeman, harkl]
export const profileMap: PubKeyProfileMap = convertPubKeyProfilesToMap(profiles)
