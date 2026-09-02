'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {PublishAndLockSlugAction} from './sanity/studio/PublishAndLockSlugAction'

const SINGLETON_TYPES = new Set(['siteSettings', 'homePage', 'visiMisi'])
const SLUG_DOCUMENT_TYPES = new Set(['event', 'artikel', 'bidang', 'departemen'])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({defaultApiVersion: apiVersion})]
      : []),
  ],
  document: {
    newDocumentOptions: (previous) =>
      previous.filter(
        (template) => {
          const schemaType = (template as {schemaType?: string}).schemaType ?? template.templateId
          return !SINGLETON_TYPES.has(schemaType)
        },
      ),
    actions: (previous, context) => {
      const actions = SLUG_DOCUMENT_TYPES.has(context.schemaType)
        ? previous.map((action) => action.action === 'publish' ? PublishAndLockSlugAction : action)
        : previous

      if (!SINGLETON_TYPES.has(context.schemaType)) return actions

      return actions.filter(
        (action) => action.action !== 'delete' && action.action !== 'duplicate',
      )
    },
  },
})
