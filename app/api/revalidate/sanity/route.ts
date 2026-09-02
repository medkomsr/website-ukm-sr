import {revalidateTag} from 'next/cache'
import {NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {type SanityWebhookPayload} from '@/lib/sanity-revalidation'
import {handleSanityWebhook} from '@/lib/sanity-webhook-handler'

export async function POST(request: NextRequest) {
  const result = await handleSanityWebhook({
    secret: process.env.SANITY_REVALIDATE_SECRET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    parse: (secret) => parseBody<SanityWebhookPayload>(request, secret),
    revalidate: (tag) => revalidateTag(tag, {expire: 0}),
  })

  return Response.json(result.body, {status: result.status})
}
