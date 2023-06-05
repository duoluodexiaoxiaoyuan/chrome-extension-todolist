import bcrypt from "bcryptjs"
import { subDays } from "date-fns"

export const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const { token } = await chrome?.storage?.sync?.get?.("token")
  options.headers = options.headers ?? {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
  options.method = options?.method ?? "POST"
  options.credentials = "omit"

  const response = await fetch(url, options)
  const jsonValue = await response.json()

  if (jsonValue.code === 401) {
    throw new Error("请先登录")
  } else if (jsonValue.code === 10000) {
    throw new Error("账号密码错误")
  } else if (jsonValue.code !== 200) {
    throw new Error(jsonValue.message)
  } else {
    return jsonValue.result as T
  }
}

export const onClickPreventDefault = (e: React.MouseEvent) => {
  e.preventDefault()
}

export const onClickStopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

export const generateHashPassword = (password: string) => {
  const SALT_ROUNDS = 10
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export const formatTimestamp = (timestamp?: number | string) => {
  try {
    if (!timestamp) return "-"
    const _ts = Number(timestamp)
    const date = new Date(_ts)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  } catch (error) {
    console.error("format date fail:", timestamp, error)
    return "-"
  }
}

export const calcExprTimeByIndex = (index: number) => {
  const record = {
    "-1": "",
    0: subDays(new Date(), 1).valueOf() / 1000,
    1: subDays(new Date(), 3).valueOf() / 1000,
    2: subDays(new Date(), 7).valueOf() / 1000
  }
  return `${record[index]}`
}
