import { type ReactNode, useReducer } from "react"

import { StoreContext, contextReducer } from "~utils/store"

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contextReducer, {} as any)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}
