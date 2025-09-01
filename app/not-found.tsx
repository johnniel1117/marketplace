"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function SearchParamsReader() {
  const searchParams = useSearchParams()
  const foo = searchParams.get("foo")
  return <p>Query param foo: {foo}</p>
}

export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <Suspense fallback={<p>Loading query...</p>}>
        <SearchParamsReader />
      </Suspense>
    </div>
  )
}
