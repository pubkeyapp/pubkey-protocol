import { AnchorProvider, Program } from '@coral-xyz/anchor'
import {
  convertAnchorIdentityProvider,
  convertAnchorIdentityProviders,
  convertToAnchorIdentityProvider,
  getPubKeyCommunityPda,
  GetPubKeyCommunityPdaOptions,
  getPubKeyConfigPda,
  getPubKeyPointerPda,
  GetPubKeyPointerPdaOptions,
  getPubKeyProfilePda,
  GetPubKeyProfilePdaOptions,
  getPubkeyProtocolProgram,
  IdentityProvider,
  PUBKEY_PROTOCOL_PROGRAM_ID,
  PubKeyCommunity,
  PubKeyConfig,
  PubKeyPointer,
  PubKeyProfile,
  PubkeyProtocol,
  PublicKeyString,
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
import {
  CommunityAuthorityApproveOptions,
  CommunityAuthorityDecline,
  CommunityAuthorityRequest,
  CommunityCreateInput,
  CommunityCreateOptions,
  CommunityUpdateOptions,
  CreateTransactionOptions,
  ProfileAuthorityAddOptions,
  ProfileAuthorityRemoveOptions,
  ProfileCreateOptions,
  ProfileGetByProvider,
  ProfileGetByUsername,
  ProfileIdentityAddOptions,
  ProfileIdentityRemoveOptions,
  ProfileIdentityVerifyOptions,
  ProfileUpdateOptions,
  PubKeyProfileSdkOptions,
} from './pubkey-protocol-sdk-interfaces'
import { getAvatarUrlCommunity } from './utils/get-avatar-url-community'
import { getAvatarUrlProfile } from './utils/get-avatar-url-profile'
import { isValidPublicKey } from './utils/is-valid-public-key'
import { slugify } from './utils/slugify'

export class PubkeyProtocolSdk {
  private readonly connection: Connection
  private readonly program: Program<PubkeyProtocol>
  private readonly provider: AnchorProvider
  readonly programId: PublicKey

  constructor(options: PubKeyProfileSdkOptions) {
    this.connection = options.connection
    this.provider = options.provider
    this.programId = options.programId ? new PublicKey(options.programId) : PUBKEY_PROTOCOL_PROGRAM_ID
    this.program = getPubkeyProtocolProgram(this.provider)
  }

  async communityAuthorityApprove(options: CommunityAuthorityApproveOptions) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .communityAuthorityApprove()
      .accountsStrict({ community, newAuthority: new PublicKey(options.newAuthority) })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async communityAuthorityDecline(options: CommunityAuthorityDecline) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const feePayer = new PublicKey(options.feePayer)
    const ix = await this.program.methods
      .communityAuthorityDecline()
      .accountsStrict({ authority: new PublicKey(options.authority), community })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async communityAuthorityRequest(options: CommunityAuthorityRequest) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const feePayer = new PublicKey(options.feePayer)
    const ix = await this.program.methods
      .communityAuthorityRequest({ newAuthority: new PublicKey(options.newAuthority) })
      .accountsStrict({ authority: new PublicKey(options.authority), community })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async communityCreate(options: CommunityCreateOptions): Promise<{
    input: CommunityCreateInput
    tx: VersionedTransaction
  }> {
    const authority = new PublicKey(options.authority)
    const communityAuthority = new PublicKey(options.communityAuthority)
    const feePayer = authority
    const slug = options.slug?.length ? options.slug : slugify(options.name)
    const avatarUrl = options.avatarUrl || getAvatarUrlCommunity(slug)
    const [config] = this.pdaConfig()
    const [community] = this.pdaCommunity({ slug })

    const input: CommunityCreateInput = {
      avatarUrl,
      name: options.name,
      slug,
    }
    const ix = await this.program.methods
      .communityCreate(input)
      .accountsStrict({
        communityAuthority,
        authority,
        community,
        systemProgram: SystemProgram.programId,
        config,
      })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { input, tx }
  }

  async communityGetAll(): Promise<PubKeyCommunity[]> {
    return this.program.account.community.all().then((accounts) =>
      accounts.map(
        ({ account, publicKey }) =>
          ({
            ...account,
            publicKey,
            providers: convertAnchorIdentityProviders(account.providers),
            signers: account.signers.map((s) => s.toString()),
            authority: account.authority.toString(),
            pendingAuthority: account.pendingAuthority?.toString(),
          } as PubKeyCommunity),
      ),
    )
  }

  async communityGet({ community }: { community: string }) {
    return isValidPublicKey(community)
      ? await this.communityGetByPda({ community: new PublicKey(community) })
      : await this.communityGetBySlug({ slug: community })
  }

  async communityGetByPda(options: { community: PublicKey }): Promise<PubKeyCommunity> {
    return this.program.account.community.fetch(options.community).then(
      (account) =>
        ({
          publicKey: options.community.toString(),
          ...account,
          providers: convertAnchorIdentityProviders(account.providers),
          signers: account.signers.map((s) => s.toString()),
          authority: account.authority.toString(),
          pendingAuthority: account.pendingAuthority?.toString(),
        } as PubKeyCommunity),
    )
  }

  async communityGetBySlug(options: { slug: string }): Promise<PubKeyCommunity> {
    const [community] = this.pdaCommunity({ slug: options.slug })

    return this.communityGetByPda({ community: community })
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
      .accounts({ authority, community, feePayer })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

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
      .accounts({ authority, community, feePayer })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { tx }
  }

  async communitySignerAdd(options: {
    authority: PublicKeyString
    feePayer: PublicKeyString
    slug: string
    signer: PublicKeyString
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .communitySignerAdd({ signer: new PublicKey(options.signer) })
      .accounts({ authority, community, feePayer })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { tx }
  }

  async communitySignerRemove(options: {
    authority: PublicKeyString
    feePayer: PublicKeyString
    slug: string
    signer: PublicKeyString
  }) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const authority = new PublicKey(options.authority)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .communitySignerRemove({ signer: new PublicKey(options.signer) })
      .accounts({ authority, community, feePayer })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { tx }
  }

  async communityUpdate(options: CommunityUpdateOptions) {
    const [community] = this.pdaCommunity({ slug: options.slug })
    const feePayer = new PublicKey(options.feePayer)

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
      .communityUpdate(input)
      .accountsStrict({
        authority: options.authority,
        community,
      })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { input, tx }
  }

  async configGet(): Promise<PubKeyConfig> {
    const [config] = this.pdaConfig()

    return this.program.account.config.fetch(config).then(
      (res) =>
        ({
          ...res,
          publicKey: config,
        } as PubKeyConfig),
    )
  }

  async configGetNullable(): Promise<PubKeyConfig | null> {
    const [config] = this.pdaConfig()

    return this.program.account.config.fetchNullable(config).then(
      (res) =>
        ({
          ...res,
          publicKey: config,
        } as PubKeyConfig),
    )
  }

  async configInit(options: { communityAuthority: PublicKeyString; authority: PublicKeyString }) {
    const authority = new PublicKey(options.authority)
    const communityAuthority = new PublicKey(options.communityAuthority)
    const feePayer = new PublicKey(options.communityAuthority)

    const ix = await this.program.methods
      .configInit({
        communityAuthority: communityAuthority,
      })
      .accounts({ authority })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { config: this.pdaConfig(), tx }
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

  async profileGetAll(): Promise<PubKeyProfile[]> {
    return this.program.account.profile.all().then((accounts) =>
      accounts.map(({ account, publicKey }) => ({
        publicKey,
        ...account,
        identities: account.identities.map((identity) => ({
          ...identity,
          provider: convertAnchorIdentityProvider(identity.provider),
          communities: identity.communities.map((c) => c.toString()),
        })),
      })),
    )
  }

  async profileGet(options: { profile: string }) {
    const profile = options.profile
    return isValidPublicKey(profile)
      ? await this.profileGetByPda({ profile: new PublicKey(profile) })
      : await this.profileGetByUsername({ username: profile })
  }

  async profileGetByPda(options: { profile: PublicKey }): Promise<PubKeyProfile> {
    const publicKey = new PublicKey(options.profile)
    return this.program.account.profile.fetch(publicKey).then((account) => ({
      publicKey,
      ...account,
      identities: account.identities.map((identity) => ({
        ...identity,
        provider: convertAnchorIdentityProvider(identity.provider),
        communities: identity.communities.map((c) => c.toString()),
      })),
    }))
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

  async profileGetByProvider(options: ProfileGetByProvider): Promise<PubKeyProfile> {
    const [pointer] = this.pdaPointer(options)

    const { profile } = await this.pointerGet({ pointer })

    return this.profileGetByPda({ profile })
  }

  async profileGetByProviderNullable(options: ProfileGetByProvider): Promise<PubKeyProfile | null> {
    const [pointer] = this.pdaPointer(options)

    const { profile } = await this.pointerGet({ pointer })

    return this.profileGetNullable({ profile })
  }

  async profileGetByUsername(options: ProfileGetByUsername): Promise<PubKeyProfile> {
    const [profile] = this.pdaProfile({ username: options.username })

    return this.profileGetByPda({ profile })
  }

  async profileGetByUsernameNullable(options: ProfileGetByUsername): Promise<PubKeyProfile | null> {
    const [profile] = this.pdaProfile({ username: options.username })

    return this.profileGetNullable({ profile })
  }

  async profileAuthorityAdd(options: ProfileAuthorityAddOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)
    const newAuthority = new PublicKey(options.newAuthority)

    const ix = await this.program.methods
      .profileAuthorityAdd({ newAuthority })
      .accountsStrict({
        authority,
        feePayer,
        community,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async profileAuthorityRemove(options: ProfileAuthorityRemoveOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authorityToRemove = new PublicKey(options.authorityToRemove)
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileAuthorityRemove({ authorityToRemove })
      .accountsStrict({
        authority,
        community,
        feePayer,
        profile,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async profileCreate(options: ProfileCreateOptions) {
    const username = options.username?.length ? options.username : slugify(options.name)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)
    const [profile] = this.pdaProfile({ username })
    const [pointer] = this.pdaPointer({
      provider: IdentityProvider.Solana,
      providerId: options.authority.toString(),
    })
    const input = {
      avatarUrl: options.avatarUrl || getAvatarUrlProfile(username),
      name: options.name,
      username,
    }
    const ix = await this.program.methods
      .profileCreate(input)
      .accountsStrict({
        authority: options.authority,
        community,
        feePayer,
        pointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = await this.createTransaction({ feePayer, ix })

    return { input, tx }
  }

  async profileUpdate(options: ProfileUpdateOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileUpdate({
        newAvatarUrl: options.avatarUrl ?? null,
        newName: options.name,
      })
      .accountsStrict({
        authority,
        community,
        feePayer,
        profile,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async profileIdentityAdd(options: ProfileIdentityAddOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const [pointer] = this.pdaPointer({ providerId: options.providerId, provider: options.provider })
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileIdentityAdd({
        name: options.name,
        provider: convertToAnchorIdentityProvider(options.provider),
        providerId: options.providerId,
      })
      .accountsStrict({
        authority,
        community,
        feePayer,
        profile,
        pointer,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async profileIdentityRemove(options: ProfileIdentityRemoveOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const [pointer] = this.pdaPointer({ providerId: options.providerId, provider: options.provider })
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileIdentityRemove({ providerId: options.providerId })
      .accountsStrict({
        authority,
        community,
        feePayer,
        pointer,
        profile,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  async profileIdentityVerify(options: ProfileIdentityVerifyOptions) {
    const [profile] = this.pdaProfile({ username: options.username })
    const [pointer] = this.pdaPointer({ providerId: options.providerId, provider: options.provider })
    const authority = new PublicKey(options.authority)
    const community = new PublicKey(options.community)
    const feePayer = new PublicKey(options.feePayer)

    const ix = await this.program.methods
      .profileIdentityVerify({
        providerId: options.providerId,
        provider: convertToAnchorIdentityProvider(options.provider),
      })
      .accountsStrict({
        authority,
        community,
        feePayer,
        pointer,
        profile,
      })
      .instruction()

    return this.createTransaction({ feePayer, ix })
  }

  private async createTransaction(options: CreateTransactionOptions) {
    const { blockhash: recentBlockhash } = await this.connection.getLatestBlockhash()
    const instructions: TransactionInstruction[] = Array.isArray(options.ix) ? options.ix : [options.ix]
    const payerKey = new PublicKey(options.feePayer)
    const message: TransactionMessage = new TransactionMessage({ instructions, payerKey, recentBlockhash })
    return new VersionedTransaction(message.compileToV0Message())
  }

  pdaCommunity(options: Omit<GetPubKeyCommunityPdaOptions, 'programId'>): [PublicKey, number] {
    return getPubKeyCommunityPda({ programId: this.programId, slug: options.slug })
  }

  pdaConfig(): [PublicKey, number] {
    return getPubKeyConfigPda({ programId: this.programId })
  }

  pdaPointer(options: Omit<GetPubKeyPointerPdaOptions, 'programId'>): [PublicKey, number] {
    return getPubKeyPointerPda({
      programId: this.programId,
      providerId: options.providerId,
      provider: options.provider,
    })
  }

  pdaProfile(options: Omit<GetPubKeyProfilePdaOptions, 'programId'>): [PublicKey, number] {
    return getPubKeyProfilePda({ programId: this.programId, username: options.username })
  }
}
