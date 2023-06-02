export const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
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
    } else if (jsonValue.code !== 200) {
      throw new Error(jsonValue.message)
    } else {
      return jsonValue.result as T
    }
  } catch (error) {
    console.error(error)
  }
}

export const onClickPreventDefault = (e: React.MouseEvent) => {
  e.preventDefault()
}

export const onClickStopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}
