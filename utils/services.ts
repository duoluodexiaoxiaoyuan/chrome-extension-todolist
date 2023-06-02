import type { IGetTodoListPrams, ITaskType } from "./types"

import { request } from "./"

const API_URL = "http://www.jimmyxuexue.top:9999"

export const getAllTaskType = () =>
  request<ITaskType>(`${API_URL}/taskType/list`)

export const getTodoListByTypeId = (params: IGetTodoListPrams) =>
  request(`${API_URL}/task/list/`, {
    body: JSON.stringify(params)
  })
