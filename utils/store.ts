// import { createContext } from "react"

import {
  type Dispatch,
  type ReactNode,
  type Reducer,
  createContext
} from "react"

import type { IStore, IUserInfo, TAction } from "./types"

export const contextReducer = (state: IStore, action: TAction): IStore => {
  switch (action.type) {
    case "userInfo":
      return { ...state, userInfo: action.payload }
    case "todoList":
      return { ...state, todoList: action.payload }
    case "reset":
      return { ...state, userInfo: {} as IUserInfo, todoList: {} }
    default:
      return state
  }
}

export const StoreContext = createContext<{
  state: IStore
  dispatch: Dispatch<TAction>
}>({
  state: {} as IStore,
  dispatch: () => {}
})

//In React version 18
type ProductsProviderProp = {
  children: ReactNode
}
