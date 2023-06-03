import styleText from "data-text:../style.css"
import { useAtom } from "jotai"
import jwtDecode from "jwt-decode"
import { uniqBy } from "lodash-es"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useRef, useState } from "react"

import Auth from "~components/Auth"
import Loading from "~components/Loading"
import MainContainer from "~components/MainContainer"
import { getInitData } from "~utils/services"
import { todoListAtom, userInfoAtom } from "~utils/store"
import { taskTypeListAtom } from "~utils/store"
import { type ITodoItem } from "~utils/types"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const CustomButton = () => {
  const [, setRender] = useState(false)
  const active = useRef(true)
  const setActive = (value: boolean) => {
    active.current = value
    setRender((i) => !i)
  }
  const [hadAuth, setHadAuth] = useState<undefined | boolean>()
  const [, setTaskType] = useAtom(taskTypeListAtom)
  const [, setUserInfo] = useAtom(userInfoAtom)
  const [, setTodoList] = useAtom(todoListAtom)
  const keyPressRef = useRef({})

  const addTodoListAtom = (newTodoList: ITodoItem[]) => {
    setTodoList((i) => uniqBy([...i, ...newTodoList], "taskId"))
  }
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
          console.log(record)
          // check if token is expired
          const isNotExpired = record.exp * 1000 > Date.now()
          if (isNotExpired) {
            setHadAuth(true)
            setUserInfo(loginUserData)
            const { taskTypeList, todoList } = await getInitData()
            setTaskType(taskTypeList)
            addTodoListAtom(todoList)
          } else {
            // show login component
            setHadAuth(false)
          }
        }
      } catch (error) {
        console.log("error", error)
        setActive(false)
      }
    })
  }, [active])

  if (active.current === false || hadAuth === undefined) return null

  return (
    <div
      className="fixed inset-0 flex justify-center items-center w-screen h-screen"
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
