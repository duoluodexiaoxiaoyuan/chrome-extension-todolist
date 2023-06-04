export interface IPaginationData<T> {
  page: number
  total: number
  result: T[]
}
export interface IUserInfo {
  avatar: string
  createTime: string
  id: number
  phone: number
  sex?: string
  username: string
}

export interface ITaskType {
  createTime: string
  desc?: boolean
  typeId: number
  typeName: string
  updateTime?: string
  userId: number
}

export enum ETaskStatus {
  未完成 = 0,
  已完成 = 1,
  全部 = 2
}

export interface IGetTodoListPrams {
  typeId: number
  page: number
  pageSize: number
  startTime: number
  endTime: number
  status: ETaskStatus
}

export interface ITodoItem {
  taskId: number
  typeId: number
  userId: number
  status: number
  taskName: string
  taskContent: string
  createTime: string
  completeTime: string
  updateTime: string
  expectTime: string
  typeMessage: TypeMessage
}

export interface TypeMessage {
  typeId: number
  userId: number
  typeName: string
  desc?: any
  createTime: string
  updateTime?: any
}

export interface IAddTodoItemParams {
  typeId: number
  taskName: string
  taskContent: string
}
export interface IUpdateTodoItemParams extends IAddTodoItemParams {
  taskId?: number
  status?: ETaskStatus
  expectTime?: string
}
