import { provisionSampleDataCommunities } from './provision-sample-data-communities'
import { provisionSampleDataProfiles } from './provision-sample-data-profiles'

export async function provisionSampleData() {
  await provisionSampleDataCommunities()
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await provisionSampleDataProfiles()
}
