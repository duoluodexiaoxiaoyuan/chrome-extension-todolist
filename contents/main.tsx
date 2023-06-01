import { useEffect, useState } from "react"

import Loading from "~components/Loading"
import MainContainer from "~components/MainContainer"
import type { PlasmoGetStyle } from "plasmo"
import styleText from "data-text:../style.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

interface IUserInfo {
  avatar: string
  createTime: string
  id: number
  phone: number
  sex?: string
  username: string
}

;(async () => {
  try {
    if (location.host === "www.jimmyxuexue.top:668") {
      const token = localStorage.getItem("token")
      const rawLoginUser = localStorage.getItem("login-user")
      if (token && rawLoginUser) {
        const loginUserData = JSON.parse(rawLoginUser)
        console.log(loginUserData)
        // save data into chrome storage
        chrome.storage.sync.set({ token, loginUserData })
      }
    }
  } catch (error) {
    console.log("error", error)
  }
})()

const CustomButton = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [hadAuth, setHadAuth] = useState(false)
  const [token, setToken] = useState("")
  const [userInfo, setUserInfo] = useState({} as IUserInfo)

  useEffect(() => {
    // init and get token
    chrome.storage.sync.get(["token"], (result) => {
      console.log("token:", result)
      if (result.token) {
        setToken(result.token)
      }
    })
  }, [])

  return (
    <div className="fixed inset-0 flex justify-center items-center w-screen h-screen">
      {isLoading ? <Loading /> : <MainContainer />}
    </div>
  )
}

export default CustomButton
