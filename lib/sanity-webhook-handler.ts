import {validateSanityWebhookPayload} from './sanity-revalidation'

type ParsedWebhook = {
  body: unknown
  isValidSignature: boolean | null
}

type SanityWebhookHandlerOptions = {
  secret?: string
  projectId?: string
  dataset?: string
  parse: (secret: string) => Promise<ParsedWebhook>
  revalidate: (tag: string) => void | Promise<void>
}

export type SanityWebhookResult = {
  status: number
  body: Record<string, unknown>
}

export async function handleSanityWebhook({
  secret,
  projectId,
  dataset,
  parse,
  revalidate,
}: SanityWebhookHandlerOptions): Promise<SanityWebhookResult> {
  if (!secret) {
    return {
      status: 500,
      body: {ok: false, error: 'Webhook secret belum dikonfigurasi.'},
    }
  }

  let parsed: ParsedWebhook
  try {
    parsed = await parse(secret)
  } catch {
    return {
      status: 400,
      body: {ok: false, error: 'Body webhook tidak dapat dibaca.'},
    }
  }

  if (parsed.isValidSignature !== true) {
    return {
      status: 401,
      body: {ok: false, error: 'Signature webhook tidak valid.'},
    }
  }

  const validation = validateSanityWebhookPayload(parsed.body, projectId, dataset)
  if (!validation.ok) {
    return {
      status: 400,
      body: {ok: false, error: validation.error},
    }
  }

  await revalidate(validation.tag)

  return {
    status: 200,
    body: {
      ok: true,
      revalidated: validation.tag,
      documentId: validation.payload._id,
      operation: validation.payload.operation,
    },
  }
}
