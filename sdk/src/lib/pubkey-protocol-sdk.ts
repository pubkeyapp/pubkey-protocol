import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  convertAnchorIdentityProvider,
  convertAnchorIdentityProviders,
  convertToAnchorIdentityProvider,
  getPubKeyCommunityPda,
  getPubKeyPointerPda,
  getPubKeyProfilePda,
  getPubkeyProtocolProgram,
  IdentityProvider,
  PUBKEY_PROTOCOL_PROGRAM_ID,
  PubKeyCommunity,
  PubKeyPointer,
  PubKeyProfile,
  PubkeyProtocol,
} from '@pubkey-protocol/anchor'
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import { slugify } from './slugify'
import { getCommunityAvatarUrl, getProfileAvatarUrl } from './utils'

export type PublicKeyString = PublicKey | string

export interface PubKeyProfileSdkOptions {
  readonly connection: Connection
  readonly programId?: PublicKey
  readonly provider: AnchorProvider
}

export interface GetProfileByProvider {
  provider: IdentityProvider
  providerId: string
}

export interface GetProfileByUsername {
  username: string
}

export interface AddIdentityOptions {
  authority: PublicKey
  feePayer: PublicKey
  username: string
  providerId: string
  provider: IdentityProvider
  name: string
}

export interface RemoveIdentityOptions {
  authority: PublicKey
  feePayer: PublicKey
  username: string
  providerId: string
  provider: IdentityProvider
}

export interface RemoveAuthorityOptions {
  authorityToRemove: PublicKeyString
  authority: PublicKeyString
  feePayer: PublicKeyString
  username: string
}

export interface AddAuthorityOptions {
  newAuthority: PublicKeyString
  authority: PublicKeyString
  feePayer: PublicKeyString
  username: string
}

export interface CommunityCreateInput {
  avatarUrl: string
  name: string
  slug: string
}

export interface CommunityCreateOptions {
  authority: PublicKey
  avatarUrl?: string
  feePayer: PublicKey
  name: string
  slug?: string
}

export interface ProfileCreateOptions {
  avatarUrl?: string
  authority: PublicKey
  feePayer: PublicKey
  name: string
  username?: string
}

export interface UpdateCommunityOptions {
  authority: PublicKey
  avatarUrl?: string
  discord?: string
  farcaster?: string
  feePayer: PublicKey
  github?: string
  name?: string
  slug: string
  telegram?: string
  website?: string
  x?: string
}

export interface ProfileUpdateOptions {
  avatarUrl: string
  authority: PublicKeyString
  feePayer: PublicKeyString
  name: string
  username: string
}

export class PubkeyProtocolSdk {
  private readonly connection: Connection
  private readonly program: Program<PubkeyProtocol>
  private readonly provider: AnchorProvider
  readonly programId: PublicKey

  constructor(options: PubKeyProfileSdkOptions) {
    this.connection = options.connection
    this.provider = options.provider
    this.programId = options.programId || PUBKEY_PROTOCOL_PROGRAM_ID
    this.program = getPubkeyProtocolProgram(this.provider)
  }

  async communityCreate(options: CommunityCreateOptions): Promise<{
    input: CommunityCreateInput
    tx: VersionedTransaction
  }> {
    const slug = options.slug?.length ? options.slug : slugify(options.name)
    const avatarUrl = options.avatarUrl || getCommunityAvatarUrl(slug)
    const [community] = this.pdaCommunity({ slug })

    const input: CommunityCreateInput = {
      avatarUrl,
      name: options.name,
      slug,
    }
    const ix = await this.program.methods
      .communityCreate(input)
      .accountsStrict({
        authority: options.authority,
        feePayer: options.feePayer,
        community,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = await this.createTransaction({ ix, feePayer: options.feePayer })

    return { input, tx }
  }

  async communityGet(options: { community: PublicKey }): Promise<PubKeyCommunity> {
    return this.program.account.community.fetch(options.community).then(
      (account) =>
        ({
          ...account,
          publicKey: options.community,
          providers: convertAnchorIdentityProviders(account.providers),
        } as PubKeyCommunity),
    )
  }

  async communityGetAll(): Promise<PubKeyCommunity[]> {
    return this.program.account.community.all().then((accounts) =>
      accounts.map(
        ({ account, publicKey }) =>
          ({
            ...account,
            publicKey,
            providers: convertAnchorIdentityProviders(account.providers),
          } as PubKeyCommunity),
      ),
    )
  }

  async communityGetBySlug(options: { slug: string }): Promise<PubKeyCommunity> {
    const [community] = this.pdaCommunity({ slug: options.slug })

    return this.communityGet({ community: community })
  }

  async communityProviderDisable(options: {
    authority: PublicKeyString
    provider: IdentityProvider
    feePayer: PublicKeyString
    slug: string
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .communityProviderDisable({ provider: convertToAnchorIdentityProvider(options.provider) })
      .accountsStrict({
        authority,
        feePayer,
        systemProgram: SystemProgram.programId,
        community,
      })
      .instruction()

    const tx = await this.createTransaction({ ix, feePayer })

    return { tx }
  }

  async communityProviderEnable(options: {
    authority: PublicKeyString
    provider: IdentityProvider
    feePayer: PublicKeyString
    slug: string
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .communityProviderEnable({ provider: convertToAnchorIdentityProvider(options.provider) })
      .accountsStrict({
        authority,
        feePayer,
        systemProgram: SystemProgram.programId,
        community,
      })
      .instruction()

    const tx = await this.createTransaction({ ix, feePayer })

    return { tx }
  }

  async communityUpdate(options: UpdateCommunityOptions) {
    const [community] = this.pdaCommunity({ slug: options.slug })

    const input = {
      avatarUrl: options.avatarUrl?.length ? options.avatarUrl : null,
      discord: options.discord?.length ? options.discord : null,
      farcaster: options.farcaster?.length ? options.farcaster : null,
      github: options.github?.length ? options.github : null,
      name: options.name?.length ? options.name : null,
      telegram: options.telegram?.length ? options.telegram : null,
      website: options.website?.length ? options.website : null,
      x: options.x?.length ? options.x : null,
    }
    const ix = await this.program.methods
      .communityUpdateDetails(input)
      .accountsStrict({
        authority: options.authority,
        community,
      })
      .instruction()

    const tx = await this.createTransaction({ ix, feePayer: options.feePayer })

    return { input, tx }
  }

  async communityUpdateAuthorityCancel(options: {
    authority: PublicKeyString
    feePayer: PublicKeyString
    slug: string
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const ix = await this.program.methods
      .communityUpdateAuthorityCancel()
      .accountsStrict({ authority: new PublicKey(options.authority), community })
      .instruction()

    return this.createTransaction({ ix, feePayer: new PublicKey(options.feePayer) })
  }

  async communityUpdateAuthorityFinalize(options: {
    feePayer: PublicKeyString
    newAuthority: PublicKeyString
    slug: string
  }): Promise<VersionedTransaction> {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const ix = await this.program.methods
      .communityUpdateAuthorityFinalize()
      .accountsStrict({ community, newAuthority: new PublicKey(options.newAuthority) })
      .instruction()

    return this.createTransaction({ ix, feePayer: new PublicKey(options.feePayer) })
  }

  async communityUpdateAuthorityInitiate(options: {
    slug: string
    newAuthority: PublicKeyString
    authority: PublicKeyString
    feePayer: PublicKeyString
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const ix = await this.program.methods
      .communityUpdateAuthorityInitiate({ newAuthority: new PublicKey(options.newAuthority) })
      .accountsStrict({ authority: new PublicKey(options.authority), community })
      .instruction()

    return this.createTransaction({ ix, feePayer: new PublicKey(options.feePayer) })
  }

  async getProgramAccount(): Promise<AccountInfo<ParsedAccountData>> {
    return this.connection
      .getParsedAccountInfo(this.programId)
      .then((res) => res.value as AccountInfo<ParsedAccountData>)
  }

  async pointerGetAll(): Promise<PubKeyPointer[]> {
    return this.program.account.pointer.all().then((accounts) =>
      accounts.map(({ account, publicKey }) => ({
        publicKey,
        provider: convertAnchorIdentityProvider(account.provider),
        providerId: account.providerId,
        bump: account.bump,
        profile: account.profile,
      })),
    )
  }

  async pointerGet(options: { pointer: PublicKey }) {
    return this.program.account.pointer.fetch(options.pointer)
  }

  async pointerGetNullable(options: { pointer: PublicKey }) {
    return this.program.account.pointer.fetchNullable(options.pointer)
  }

  async profilesGetAll(): Promise<PubKeyProfile[]> {
    return this.program.account.profile.all().then((accounts) =>
      accounts.map(({ account, publicKey }) => ({
        publicKey,
        authorities: account.authorities,
        avatarUrl: account.avatarUrl,
        bump: account.bump,
        identities: account.identities.map((identity) => ({
          ...identity,
          provider: convertAnchorIdentityProvider(identity.provider),
        })),
        feePayer: account.feePayer,
        name: account.name,
        username: account.username,
      })),
    )
  }

  async profileGet(options: { profile: PublicKey }): Promise<PubKeyProfile> {
    return this.program.account.profile.fetch(options.profile).then((res) => {
      const identities = res.identities.map((identity) => ({
        ...identity,
        provider: convertAnchorIdentityProvider(identity.provider),
      }))

      return {
        ...res,
        publicKey: options.profile,
        identities,
      }
    })
  }

  async profileGetNullable(options: { profile: PublicKey }): Promise<PubKeyProfile | null> {
    return this.program.account.profile.fetchNullable(options.profile).then((res) => {
      if (!res) {
        return null
      }
      const identities = res.identities.map((identity) => ({
        ...identity,
        provider: convertAnchorIdentityProvider(identity.provider),
      }))

      return {
        ...res,
        publicKey: options.profile,
        identities,
      }
    })
  }

  async profileGetByProvider(options: GetProfileByProvider): Promise<PubKeyProfile> {
    const [pointer] = this.pdaPointer(options)

    const { profile } = await this.pointerGet({ pointer })

    return this.profileGet({ profile })
  }

  async profileGetByProviderNullable(options: GetProfileByProvider): Promise<PubKeyProfile | null> {
    const [pointer] = this.pdaPointer(options)

    const { profile } = await this.pointerGet({ pointer })

    return this.profileGetNullable({ profile })
  }

  async profileGetByUsername(options: GetProfileByUsername): Promise<PubKeyProfile> {
    const [profile] = this.pdaProfile({ username: options.username })

    return this.profileGet({ profile })
  }

  async profileGetByUsernameNullable(options: GetProfileByUsername): Promise<PubKeyProfile | null> {
    const [profile] = this.pdaProfile({ username: options.username })

    return this.profileGetNullable({ profile })
  }

  async profileAuthorityAdd(options: AddAuthorityOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)
    const newAuthority = new PublicKey(options.newAuthority)

    const ix = await this.program.methods
      .profileAuthorityAdd({ newAuthority })
      .accountsStrict({
        authority,
        feePayer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ ix, feePayer })
  }

  async profileAuthorityRemove(options: RemoveAuthorityOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authorityToRemove = new PublicKey(options.authorityToRemove)
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileAuthorityRemove({ authorityToRemove })
      .accountsStrict({ authority, feePayer, profile })
      .instruction()

    return this.createTransaction({ ix, feePayer })
  }

  async profileCreate(options: ProfileCreateOptions) {
    const username = options.username?.length ? options.username : slugify(options.name)
    const [profile] = this.pdaProfile({ username })
    const [pointer] = this.pdaPointer({
      provider: IdentityProvider.Solana,
      providerId: options.authority.toString(),
    })
    const ix = await this.program.methods
      .profileCreate({
        avatarUrl: options.avatarUrl || getProfileAvatarUrl(username),
        name: options.name,
        username,
      })
      .accountsStrict({
        authority: options.authority,
        feePayer: options.feePayer,
        pointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ ix, feePayer: options.feePayer })
  }

  async profileUpdate(options: ProfileUpdateOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileUpdateDetails({ newAvatarUrl: options.avatarUrl, newName: options.name, authority })
      .accounts({ feePayer, profile })
      .instruction()

    return this.createTransaction({ ix, feePayer })
  }

  async profileIdentityAdd(options: AddIdentityOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const [pointer] = this.pdaPointer({ providerId: options.providerId, provider: options.provider })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .addIdentity({
        name: options.name,
        provider: convertToAnchorIdentityProvider(options.provider),
        providerId: options.providerId,
      })
      .accountsStrict({
        authority,
        feePayer,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ ix, feePayer })
  }

  async profileIdentityRemove(options: RemoveIdentityOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const [pointer] = this.pdaPointer({ providerId: options.providerId, provider: options.provider })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .removeIdentity({ providerId: options.providerId })
      .accountsStrict({
        authority,
        feePayer,
        pointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ ix, feePayer })
  }

  private async createTransaction({ ix, feePayer: payerKey }: { ix: TransactionInstruction; feePayer: PublicKey }) {
    const { blockhash: recentBlockhash } = await this.connection.getLatestBlockhash()

    return new VersionedTransaction(
      new TransactionMessage({
        instructions: [ix],
        payerKey,
        recentBlockhash,
      }).compileToV0Message(),
    )
  }

  pdaProfile(options: { username: string }): [PublicKey, number] {
    return getPubKeyProfilePda({ programId: this.programId, username: options.username })
  }

  pdaPointer(options: { provider: IdentityProvider; providerId: string }): [PublicKey, number] {
    return getPubKeyPointerPda({
      programId: this.programId,
      providerId: options.providerId,
      provider: options.provider,
    })
  }

  pdaCommunity(options: { slug: string }): [PublicKey, number] {
    return getPubKeyCommunityPda({ programId: this.programId, slug: options.slug })
  }
}
