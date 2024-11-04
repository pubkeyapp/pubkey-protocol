import { Anchor, Text } from '@mantine/core'
import { UiCard, UiPage, UiStack } from '@pubkey-ui/core'
import { Fragment, ReactNode } from 'react'

export default function HomeRoutes() {
  const glossary: { [key: string]: ReactNode } = {
    Community: (
      <Text>
        A <i>Community</i> is an account that represents a team or project that creates <i>Profiles</i> and verifies
        their <i>Identities</i>.
      </Text>
    ),
    Profile: (
      <Text>
        A <i>Profile</i> is an account that represents a user and their verified identities.
      </Text>
    ),
    Identity: (
      <Text>
        An <i>Identity</i> is a Social or Solana identity that is verified by one or more <i>Communities</i>.
      </Text>
    ),
    IdentityProvider: (
      <Text>
        An <i>IdentityProvider</i> represents the origin of an Identity.
      </Text>
    ),
    IdentityProviderId: (
      <Text>
        An <i>IdentityProviderId</i> is the unique remote identifier for an IdentityProvider.
      </Text>
    ),
    Pointer: (
      <Text>
        A <i>Pointer</i> is an account that points an <i>Identity</i> to a <i>Profile</i> based on the{' '}
        <i>IdentityProvider</i> and
        <i>IdentityProviderId</i>.
      </Text>
    ),
  }

  return (
    <UiPage title="PubKey Protocol">
      <UiStack>
        <UiCard>
          <Text>PubKey Protocol is the social layer on Solana.</Text>
          <Text>
            It allows users to create and manage a profiles and verify their Social or Solana identities. The identities
            are verified by the communities in the network.
          </Text>
          <Text>Developers can use this information as a building block for their applications.</Text>
          <Text>
            For more information{' '}
            <Anchor target="_blank" href="https://discord.gg/XxuZQeDPNf">
              join our Discord
            </Anchor>{' '}
            or reach out to{' '}
            <Anchor target="_blank" href="https://x.com/PubKeyApp">
              @PubKeyApp on X
            </Anchor>
            .
          </Text>
        </UiCard>
        <UiCard title="Glossary">
          <Text>The following terms are used throughout the documentation and code:</Text>
          <dl>
            {Object.keys(glossary).map((key) => (
              <Fragment key={key}>
                <dt>{key}</dt>
                <dd>{glossary[key]}</dd>
              </Fragment>
            ))}
          </dl>
        </UiCard>
      </UiStack>
    </UiPage>
  )
}
