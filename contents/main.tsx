import styleText from "data-text:../style.css"
import { useAtom } from "jotai"
import { uniqBy } from "lodash-es"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import AuthTip from "~components/AuthTip"
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
  const [, setTaskType] = useAtom(taskTypeListAtom)
  const [, setUserInfo] = useAtom(userInfoAtom)
  const [, setTodoList] = useAtom(todoListAtom)

  const addTodoListAtom = (newTodoList: ITodoItem[]) => {
    setTodoList((i) => uniqBy([...i, ...newTodoList], "taskId"))
  }
  useEffect(() => {
    // init add keydown event
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "j" && !active && e.metaKey && e.ctrlKey) {
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

  useEffect(() => {
    if (active === false) return
    // init and get token
    chrome.storage.sync.get(["token", "loginUserData"], async (result) => {
      try {
        console.log("result:", result)
        if (result.token) {
          setHadAuth(true)
          setUserInfo(result.loginUserData)
          // fetch todo list data
          setIsLoading(true)
          const { taskTypeList, todoList } = await getInitData()
          setTaskType(taskTypeList)
          addTodoListAtom(todoList)
        }
      } catch (error) {
        console.log("error", error)
        setActive(false)
      } finally {
        setIsLoading(false)
      }
    })
  }, [active])

  if (!active) return null

  // 需要去主页登录后续才能使用
  if (!hadAuth) return <AuthTip onClose={() => setActive(false)} />

  return (
    <div
      className="fixed inset-0 flex justify-center items-center w-screen h-screen"
      onClick={() => setActive(false)}>
      {isLoading ? (
        <Loading />
      ) : (
        <MainContainer onDisActive={() => setActive(false)} />
      )}
    </div>
  )
}

export default CustomButton
