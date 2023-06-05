import { addDays } from "date-fns"
import bcrypt from "bcryptjs"

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

export const exprDateOptions = ["今天", "三天内", "本周"]

export const calcExprIndex = (exprTime?: number | string) => {
  if (!exprTime) return -1
  const now = new Date()
  const expr = new Date(Number(exprTime))
  const diff = Math.ceil(
    (expr.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff <= 1) return 0
  if (diff <= 3) return 1
  if (diff <= 7) return 2
  return -1
}

export const isExprTimeExpired = (exprTime?: number | string) => {
  if (!exprTime) return false
  const now = new Date()
  const expr = new Date(Number(exprTime))
  return now > expr
}

export const formatTimestamp = (timestamp?: number | string) => {
  try {
    if (!timestamp) return "-"
    const _ts = Number(timestamp)
    const date = new Date(_ts)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  } catch (error) {
    console.error("format date fail:", timestamp, error)
    return "-"
  }
}

export const calcTodoExprTime = (exprTime?: number | string) => {
  const _exprTime = formatTimestamp(exprTime)
  if (_exprTime === "-") return "-"
  const now = new Date()
  const expr = new Date(Number(exprTime))
  if (now > expr) return "已过期"
  return `剩余${Math.ceil(
    (expr.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )}天`
}

export const calcExprTimeByIndex = (index: number) => {
  const record = {
    "-1": "",
    0: addDays(new Date(), 1).valueOf(),
    1: addDays(new Date(), 3).valueOf(),
    2: addDays(new Date(), 7).valueOf()
  }
  return `${record[index]}`
}
