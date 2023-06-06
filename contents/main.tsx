import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useRef, useState } from "react"

import Auth from "~components/Auth"
import MainContainer from "~components/MainContainer"
import jwtDecode from "jwt-decode"
import styleText from "data-text:../style.css"
import { useAtom } from "jotai"
import { userInfoAtom } from "~utils/store"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const CustomButton = () => {
  const [, setRender] = useState(false)
  const active = useRef(false)
  const setActive = (value: boolean) => {
    active.current = value
    setRender((i) => !i)
  }
  const [hadAuth, setHadAuth] = useState<undefined | boolean>()
  const [, setUserInfo] = useAtom(userInfoAtom)
  const keyPressRef = useRef({})

  useEffect(() => {
    // init add keydown event
    const onKeyDown = (e: KeyboardEvent) => {
      keyPressRef.current = { ...keyPressRef.current, [e.code]: true }
      // check if press right cmd + dot
      if (
        active.current === false &&
        keyPressRef.current["Period"] &&
        keyPressRef.current["MetaRight"]
      ) {
        setActive(true)
      }
      if (e.key === "Escape" && active) {
        setActive(false)
      }
      setTimeout(() => {
        keyPressRef.current = {}
      }, 300)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  useEffect(() => {
    // init and get token
    chrome.storage.sync.get(["token", "loginUserData"], async (result) => {
      try {
        const { token, loginUserData } = result
        if (token && loginUserData) {
          const record = jwtDecode(token) as { exp: number }
          // check if token is expired
          const isNotExpired = record.exp * 1000 > Date.now()
          if (isNotExpired) {
            setHadAuth(true)
            setUserInfo(loginUserData)
          } else {
            // show login component
            setHadAuth(false)
          }
        } else {
          setHadAuth(false)
        }
      } catch (error) {
        console.log("error", error)
        setActive(false)
      }
    })
    // 每次启用，都禁止页面body滚动
    document.body.style.overflow = active.current === true ? "hidden" : "unset"
  }, [active.current])

  if (active.current === false || hadAuth === undefined) return null

  return (
    <div
      id="_extension_container_"
      className="fixed inset-0 flex justify-center items-center w-screen h-screen bg-[#33333380]"
      onClick={() => setActive(false)}>
      {hadAuth ? (
        <MainContainer onDisActive={() => setActive(false)} />
      ) : (
        <Auth setAuth={() => setHadAuth(true)} />
      )}
    </div>
  )
}

export default CustomButton

export const config: PlasmoCSConfig = {
  css: ["font.css"]
}
