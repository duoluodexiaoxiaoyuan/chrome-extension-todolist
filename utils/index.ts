export const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    options.headers = options.headers ?? {
      "Content-Type": "application/json",
      Authorization: `Bearer ${globalThis.__todo_list_token}`
    }
    options.method = options?.method ?? "POST"

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
