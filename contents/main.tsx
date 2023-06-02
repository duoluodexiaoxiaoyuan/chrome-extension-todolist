import styleText from "data-text:../style.css"
import type { PlasmoGetStyle } from "plasmo"
import { useCallback, useContext, useEffect, useReducer, useState } from "react"

import AuthTip from "~components/AuthTip"
import Loading from "~components/Loading"
import MainContainer from "~components/MainContainer"
import { GlobalContext, contextReducer, defaultValue } from "~utils/store"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}
;(async () => {
  try {
    if (location.host === "www.jimmyxuexue.top:668") {
      const token = localStorage.getItem("token")
      const rawLoginUser = localStorage.getItem("login-user")
      if (token && rawLoginUser) {
        const loginUserData = JSON.parse(rawLoginUser)
        // save data into chrome storage
        chrome.storage.sync.set({ token, loginUserData })
      }
    }
  } catch (error) {
    console.log("error", error)
  }
})()

const CustomButton = () => {
  const [active, setActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hadAuth, setHadAuth] = useState(false)

  const [state, dispatch] = useReducer(contextReducer, defaultValue)

  useEffect(() => {
    // init and get token
    chrome.storage.sync.get(["token", "loginUserData"], (result) => {
      if (result.token) {
        setHadAuth(true)
        dispatch({ type: "userInfo", payload: result.loginUserData })
        // @ts-ignore
        globalThis.__todo_list_token = result.token
      }
    })
    // init add keydown event
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !active && e.metaKey) {
        setActive(true)
      }
      if (e.key === "Escape" && active) {
        setActive(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  if (!active) return null

  // 需要去主页登录后续才能使用
  if (!hadAuth) return <AuthTip onClose={() => setActive(false)} />

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      <div
        className="fixed inset-0 flex justify-center items-center w-screen h-screen"
        onClick={() => setActive(false)}>
        {isLoading ? <Loading /> : <MainContainer />}
      </div>
    </GlobalContext.Provider>
  )
}

export default CustomButton
