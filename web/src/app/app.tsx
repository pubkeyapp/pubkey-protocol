import { UiThemeProvider } from '@pubkey-ui/core'
import '@pubkey-ui/core/index.esm.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLabelsProvider } from './app-labels-provider'
import { AppRoutes, ThemeLink } from './app-routes'
import { ClusterProvider } from './features/cluster/cluster-data-access'
import { KeypairProvider } from './features/keypair/data-access'
import { SolanaProvider } from './features/solana'

const client = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={client}>
      <UiThemeProvider link={ThemeLink}>
        <KeypairProvider>
          <AppLabelsProvider>
            <ClusterProvider>
              <SolanaProvider>
                <AppRoutes />
              </SolanaProvider>
            </ClusterProvider>
          </AppLabelsProvider>
        </KeypairProvider>
      </UiThemeProvider>
    </QueryClientProvider>
  )
}
