import SiteClient from './site-client'
import { getSiteData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const initial = await getSiteData()
  return <SiteClient initial={initial} />
}
