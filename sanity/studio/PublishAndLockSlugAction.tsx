'use client'

import {useEffect, useState} from 'react'
import {type DocumentActionComponent, useDocumentOperation} from 'sanity'

export const PublishAndLockSlugAction: DocumentActionComponent = (props) => {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) setIsPublishing(false)
  }, [isPublishing, props.draft])

  return {
    disabled: Boolean(publish.disabled),
    label: isPublishing ? 'Sedang menerbitkan…' : 'Terbitkan',
    onHandle: () => {
      setIsPublishing(true)
      patch.execute([{set: {slugLocked: true}}])
      publish.execute()
      props.onComplete()
    },
  }
}

PublishAndLockSlugAction.action = 'publish'
