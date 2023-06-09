import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import Auth from "~components/Auth"
import MainContainer from "~components/MainContainer"
import hotkeys from "hotkeys-js"
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
  const [active, setActive] = useState(false)

  const [hadAuth, setHadAuth] = useState<undefined | boolean>()
  const [, setUserInfo] = useAtom(userInfoAtom)
  useEffect(() => {
    hotkeys("ctrl+j,command+.,win+.", function (event) {
      event.preventDefault()
      if (active === true) return
      setActive(true)
    })
    hotkeys("escape", function (event) {
      event.preventDefault()
      if (active === false) return
      setActive(false)
    })
    document.querySelector("#_extension_container_")?.addEventListener(
      "keydown",
      function (event) {
        event.stopImmediatePropagation()
        event.stopPropagation()
        event.preventDefault()
      },
      true
    )
    chrome.storage.local.get().then((result) => {
      console.log("result", result)
    })
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
    document.body.style.overflow = active === true ? "hidden" : "unset"
  }, [active])

  if (active === false || hadAuth === undefined) return null

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
