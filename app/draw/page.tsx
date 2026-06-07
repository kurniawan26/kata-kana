import { Suspense } from 'react'
import DrawContent from './DrawContent'

export default function DrawPage() {
  return (
    <Suspense>
      <DrawContent />
    </Suspense>
  )
}
