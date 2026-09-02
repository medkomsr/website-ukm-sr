'use client'

import {useEffect, useMemo, useState} from 'react'
import {PatchEvent, set, type SlugInputProps, useClient, useFormValue} from 'sanity'
import type {SlugValidationContext} from '@sanity/types'

import {apiVersion} from '../env'
import {createUniqueSlug, shouldRegenerateSlug, slugify} from '../../lib/content-slug'

const ROUTE_TYPES: Record<string, string[]> = {
  event: ['event', 'artikel'],
  artikel: ['event', 'artikel'],
  bidang: ['bidang'],
  departemen: ['departemen'],
}

function routePrefix(documentType: string) {
  if (documentType === 'event' || documentType === 'artikel') return '/aktivitas/'
  if (documentType === 'bidang') return '/tentang/bidang/'
  if (documentType === 'departemen') return '/tentang/'
  return '/'
}

export function AutoSlugInput(props: SlugInputProps) {
  const {onChange, schemaType, value} = props
  const studioClient = useClient({apiVersion})
  const client = useMemo(() => studioClient.withConfig({perspective: 'raw'}), [studioClient])
  const documentId = String(useFormValue(['_id']) ?? '').replace(/^drafts\./, '')
  const documentType = String(useFormValue(['_type']) ?? '')
  const slugLocked = useFormValue(['slugLocked']) === true
  const sourceField = typeof schemaType.options?.source === 'string'
    ? schemaType.options.source
    : 'title'
  const sourceValue = String(useFormValue([sourceField]) ?? '')
  const currentSlug = value?.current ?? ''
  const [isGenerating, setIsGenerating] = useState(false)
  const prefix = useMemo(() => routePrefix(documentType), [documentType])

  useEffect(() => {
    if (!documentId || !documentType || !sourceValue.trim()) return

    const baseSlug = slugify(sourceValue)
    if (!baseSlug) return

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setIsGenerating(true)

      try {
        const publishedExists = await client.fetch<boolean>(
          'defined(*[_id == $documentId][0]._id)',
          {documentId},
        )

        if (cancelled || !shouldRegenerateSlug(publishedExists, slugLocked)) return

        const types = ROUTE_TYPES[documentType] ?? [documentType]
        const usedSlugs = await client.fetch<string[]>(
          `*[
            _type in $types &&
            defined(slug.current) &&
            !(_id in [$documentId, $draftId])
          ].slug.current`,
          {types, documentId, draftId: `drafts.${documentId}`},
        )

        const candidate = createUniqueSlug(baseSlug, usedSlugs)

        if (!cancelled && candidate !== currentSlug) {
          onChange(PatchEvent.from(set({current: candidate})))
        }
      } finally {
        if (!cancelled) setIsGenerating(false)
      }
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [client, currentSlug, documentId, documentType, onChange, slugLocked, sourceValue])

  return (
    <div style={{border: '1px solid #d1d5db', borderRadius: 8, padding: 16}}>
      <div style={{display: 'grid', gap: 12}}>
        <strong style={{fontSize: 14}}>Alamat halaman dibuat otomatis</strong>
        <code style={{fontSize: 13}}>{currentSlug ? `${prefix}${currentSlug}` : 'Menunggu judul atau singkatan...'}</code>
        <span style={{color: '#6b7280', fontSize: 13, lineHeight: 1.5}}>
          {isGenerating
            ? 'Sedang menyiapkan alamat yang unik...'
            : 'Alamat akan mengikuti judul sampai pertama kali diterbitkan, lalu dikunci agar tautan lama tetap aman.'}
        </span>
      </div>
    </div>
  )
}

export async function isUniqueActivitySlug(
  slug: string,
  context: SlugValidationContext,
) {
  const documentId = String(context.document?._id ?? '').replace(/^drafts\./, '')
  const client = context.getClient({apiVersion}).withConfig({perspective: 'raw'})
  const duplicateCount = await client.fetch<number>(
    `count(*[
      _type in ["event", "artikel"] &&
      slug.current == $slug &&
      !(_id in [$documentId, $draftId])
    ])`,
    {slug, documentId, draftId: `drafts.${documentId}`},
  )

  return duplicateCount === 0
}
