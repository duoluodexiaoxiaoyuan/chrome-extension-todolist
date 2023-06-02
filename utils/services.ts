import type { IGetTodoListPrams, ITaskType } from "./types"

import type { IPaginationData } from "./types"
import type { ITodoItem } from "./types"
import { request } from "./"
import { sendToBackground } from "@plasmohq/messaging"

const API_URL = "http://www.jimmyxuexue.top:9999"

export const getAllTaskType = () =>
  request<ITaskType[]>(`${API_URL}/taskType/list`)

export const getTodoListByTypeId = (params: IGetTodoListPrams) =>
  request<IPaginationData<ITodoItem>>(`${API_URL}/task/list/`, {
    body: JSON.stringify(params)
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
