import { useEffect } from "react"

import { useGlobalStore } from "~utils/store"

export default function MainContainer() {
  const store = useGlobalStore()
  console.log(store)
  useEffect(() => {}, [])

  // const
  // return null
  return (
    <div className="w-[600px] min-h-[400px] max-h-[80vh] bg-blue-50 rounded-md p-4">
      <pre>123</pre>
    </div>
  )
}
