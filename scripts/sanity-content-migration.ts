import {createClient} from '@sanity/client'
import {loadEnvConfig} from '@next/env'

import {
  hasMigrationChanges,
  isDraftDocumentId,
  type LegacySanityDocument,
  planContentMigration,
} from '../lib/sanity-content-migration'

async function main() {
  loadEnvConfig(process.cwd())

  const apply = process.argv.includes('--apply')
  const backupConfirmed = process.argv.includes('--backup-confirmed')

  if (apply && !backupConfirmed) {
    throw new Error('Mode --apply memerlukan --backup-confirmed setelah backup dataset berhasil dibuat.')
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = apply ? process.env.SANITY_API_WRITE_TOKEN : process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset) throw new Error('Project ID dan dataset Sanity wajib dikonfigurasi.')
  if (apply && !token) throw new Error('SANITY_API_WRITE_TOKEN wajib diisi untuk mode --apply.')

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-08-01',
    token,
    perspective: 'raw',
    useCdn: false,
  })

  const documents = await client.fetch<LegacySanityDocument[]>(
    `*[_type in ["event", "artikel", "bidang", "departemen", "siteSettings"] && !(_id in path("versions.**"))]{
      _id,
      _rev,
      _type,
      title,
      date,
      endDate,
      time,
      description,
      longDescription,
      overlay,
      overlayTheme,
      programs,
      programDescriptions,
      programItems,
      slugLocked,
      jumlahAnggota,
      jumlahPenghargaan,
      jumlahKegiatan
    }`,
  )

  const publishedIds = new Set(
    documents
      .filter((document) => !isDraftDocumentId(document._id))
      .map((document) => document._id),
  )
  const plans = documents.map((document) => planContentMigration({
    ...document,
    wasPublished: publishedIds.has(document._id.replace(/^drafts\./, '')),
  }))
  const changedPlans = plans.filter(hasMigrationChanges)
  const issuePlans = plans.filter((plan) => plan.issues.length > 0)
  const blockingIssuePlans = issuePlans.filter((plan) => !isDraftDocumentId(plan.documentId))

  for (const plan of plans) {
    console.log(JSON.stringify({
      id: plan.documentId,
      type: plan.documentType,
      title: plan.title,
      changes: {set: plan.set, unset: plan.unset},
      issues: plan.issues,
    }))
  }

  if (apply && blockingIssuePlans.length > 0) {
    throw new Error(
      `Migrasi dibatalkan: ${blockingIssuePlans.length} dokumen terbit masih memerlukan koreksi manual atau harus di-unpublish.`,
    )
  }

  if (apply) {
    for (const plan of changedPlans) {
      let patch = client.patch(plan.documentId)
      if (Object.keys(plan.set).length > 0) patch = patch.set(plan.set)
      if (plan.unset.length > 0) patch = patch.unset(plan.unset)
      if (plan.documentRevision) patch = patch.ifRevisionId(plan.documentRevision)
      await patch.commit({autoGenerateArrayKeys: true})
    }
  }

  console.log(JSON.stringify({
    mode: apply ? 'apply' : 'dry-run',
    scanned: plans.length,
    documentsWithChanges: changedPlans.length,
    publishedDocumentsNeedingManualCorrection: blockingIssuePlans.length,
    draftDocumentsNeedingManualCorrection: issuePlans.length - blockingIssuePlans.length,
  }))
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Migrasi gagal dijalankan.')
  process.exitCode = 1
})
