import { provisionSampleDataCommunities } from './provision-sample-data-communities'
import { provisionSampleDataProfiles } from './provision-sample-data-profiles'
import { sleep } from './sleep'

export interface ProvisionSampleDataOptions {
  dryRun?: boolean
  timeout?: number
}

export async function provisionSampleData({ dryRun, timeout = 100 }: ProvisionSampleDataOptions) {
  if (dryRun) {
    console.log('DRY RUN ENABLED')
  }
  await provisionSampleDataCommunities({ dryRun, timeout })
  await sleep(10 * timeout)
  await provisionSampleDataProfiles({ dryRun, timeout })
}
