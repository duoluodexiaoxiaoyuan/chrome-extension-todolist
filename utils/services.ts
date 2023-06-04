import type {
  IAddTodoItemParams,
  IGetTodoListPrams,
  ITaskType,
  IUpdateTodoItemParams,
  IUserInfo
} from "./types"
import { generateHashPassword, request } from "./"

import type { IPaginationData } from "./types"
import type { ITodoItem } from "./types"
import { sendToBackground } from "@plasmohq/messaging"

const API_URL = "https://api.jimmyxuexue.top"

export const getAllTaskType = () =>
  request<ITaskType[]>(`${API_URL}/taskType/list`)

export const getTodoListByTypeId = (params: IGetTodoListPrams) =>
  request<IPaginationData<ITodoItem>>(`${API_URL}/task/list/`, {
    body: JSON.stringify(params)
  })

export const createNewTaskType = (typeName: string) =>
  request(`${API_URL}/taskType/add`, {
    body: JSON.stringify({
      typeName,
      desc: "来自插件的匿名描述，反正你也用不上"
    })
  })

export const getInitData = async () => {
  const data = await sendToBackground({
    name: "request",
    body: {
      type: "init"
    }
  })
  return data.data as {
    taskTypeList: ITaskType[]
    todoList: ITodoItem[]
  }
}

export const login = (phone: string, password: string) =>
  request<{
    token: string
    user: IUserInfo
  }>(`${API_URL}/user/login`, {
    body: JSON.stringify({ phone, password })
  })

export const onLogin = async (phone: string, password: string) => {
  const data = await sendToBackground({
    name: "request",
    body: {
      type: "login",
      phone,
      password: generateHashPassword(password)
    }
  })
  return data as {
    token: string
    user: IUserInfo
  }
}

export const createNewTodoItem = (params: IAddTodoItemParams) =>
  request<ITodoItem>(`${API_URL}/task/add`, {
    body: JSON.stringify(params)
  })

export const onCreateNewTodoItem = async (params: IAddTodoItemParams) => {
  const data = await sendToBackground({
    name: "request",
    body: {
      type: "create-new-todo-item",
      ...params
    }
  })
  return data as ITodoItem
}

export const modifyTodoItem = (params: IUpdateTodoItemParams) =>
  request<ITodoItem>(`${API_URL}/task/update`, {
    body: JSON.stringify(params)
  })

export const onModifyTodoItem = async (params: IUpdateTodoItemParams) => {
  return sendToBackground({
    name: "request",
    body: {
      type: "modify-todo-item",
      ...params
    }
  })
}
