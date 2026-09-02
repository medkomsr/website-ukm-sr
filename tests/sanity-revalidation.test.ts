import assert from 'node:assert/strict'
import test from 'node:test'
import {encodeSignatureHeader, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {NextRequest} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

import {SANITY_CACHE_TAGS, validateSanityWebhookPayload} from '../lib/sanity-revalidation'
import {handleSanityWebhook} from '../lib/sanity-webhook-handler'
import {getOverlayGradient} from '../lib/overlay-theme'

const basePayload = {
  _id: 'document-1',
  projectId: 'project',
  dataset: 'production',
  operation: 'update' as const,
}

test('maps event and article webhooks to the shared activity tag', () => {
  for (const type of ['event', 'artikel']) {
    const result = validateSanityWebhookPayload({...basePayload, _type: type}, 'project', 'production')
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.tag, 'aktivitas')
  }
})

test('maps every supported document type to its cache tag', () => {
  for (const [type, expectedTag] of Object.entries(SANITY_CACHE_TAGS)) {
    const result = validateSanityWebhookPayload(
      {...basePayload, _type: type},
      'project',
      'production',
    )
    assert.equal(result.ok, true)
    if (result.ok) assert.equal(result.tag, expectedTag)
  }
})

test('rejects wrong project or dataset and unsupported document types', () => {
  assert.equal(validateSanityWebhookPayload({...basePayload, _type: 'event'}, 'other-project', 'production').ok, false)
  assert.equal(validateSanityWebhookPayload({...basePayload, _type: 'event'}, 'project', 'staging').ok, false)
  assert.equal(validateSanityWebhookPayload({...basePayload, _type: 'unknown'}, 'project', 'production').ok, false)
})

test('rejects incomplete payloads and unsupported operations', () => {
  const {_id, ...withoutId} = {...basePayload, _type: 'event'}
  void _id
  assert.equal(validateSanityWebhookPayload(withoutId, 'project', 'production').ok, false)
  assert.equal(validateSanityWebhookPayload(
    {...basePayload, _type: 'event', operation: 'archive'},
    'project',
    'production',
  ).ok, false)
})

test('uses a safe overlay fallback for missing themes', () => {
  assert.equal(getOverlayGradient(undefined), getOverlayGradient('green'))
})

test('next-sanity accepts a valid signature and rejects an invalid one', async () => {
  const secret = 'testing-secret'
  const body = JSON.stringify({...basePayload, _type: 'event'})
  const signature = await encodeSignatureHeader(body, Date.now(), secret)

  const validRequest = new NextRequest('http://localhost/api/revalidate/sanity', {
    method: 'POST',
    body,
    headers: {[SIGNATURE_HEADER_NAME]: signature},
  })
  const valid = await parseBody(validRequest, secret, false)
  assert.equal(valid.isValidSignature, true)

  const invalidRequest = new NextRequest('http://localhost/api/revalidate/sanity', {
    method: 'POST',
    body,
    headers: {[SIGNATURE_HEADER_NAME]: `${signature}-invalid`},
  })
  const invalid = await parseBody(invalidRequest, secret, false)
  assert.equal(invalid.isValidSignature, false)
})

test('handler rejects invalid signature and malformed payloads', async () => {
  const common = {
    secret: 'secret',
    projectId: 'project',
    dataset: 'production',
    revalidate: () => undefined,
  }

  const badSignature = await handleSanityWebhook({
    ...common,
    parse: async () => ({body: basePayload, isValidSignature: false}),
  })
  assert.equal(badSignature.status, 401)

  const malformed = await handleSanityWebhook({
    ...common,
    parse: async () => ({body: {...basePayload, _id: '', _type: 'event'}, isValidSignature: true}),
  })
  assert.equal(malformed.status, 400)
})

test('duplicate deliveries are harmless and revalidate the same tag', async () => {
  const tags: string[] = []
  const runDelivery = () => handleSanityWebhook({
    secret: 'secret',
    projectId: 'project',
    dataset: 'production',
    parse: async () => ({
      body: {...basePayload, _type: 'event'},
      isValidSignature: true,
    }),
    revalidate: (tag) => {
      tags.push(tag)
    },
  })

  const first = await runDelivery()
  const duplicate = await runDelivery()

  assert.equal(first.status, 200)
  assert.equal(duplicate.status, 200)
  assert.deepEqual(tags, ['aktivitas', 'aktivitas'])
})
