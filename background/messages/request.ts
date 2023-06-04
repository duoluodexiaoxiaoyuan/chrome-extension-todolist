import {
  createNewTaskType,
  createNewTodoItem,
  getAllTaskType,
  getTodoListByTypeId,
  login,
  modifyTodoItem
} from "~utils/services"

import { ETaskStatus } from "~utils/types"
import type { PlasmoMessaging } from "@plasmohq/messaging"
import { subDays } from "date-fns"

const handler: PlasmoMessaging.MessageHandler<{
  type: string
  [k: string]: string
}> = async (req, res) => {
  const { type, newTaskTypeName = "" } = req.body
  if (type === "new-task-type") {
    await createNewTaskType(newTaskTypeName)
    const data = await getAllTaskType()
    return res.send({
      data
    })
  }

  if (type === "login") {
    const { phone, password } = req.body
    const response = await login(phone, password)
    console.log("response", response)
    return res.send(response)
  }

  if (type === "create-new-todo-item") {
    const { typeId, taskName, taskContent } = req.body
    const response = await createNewTodoItem({
      typeId: Number(typeId),
      taskName,
      taskContent
    })
    console.log("response", response)
    return res.send(response)
  }

  if (type === "modify-todo-item") {
    const { taskId, typeId, taskName, taskContent, status } = req.body
    const response = await modifyTodoItem({
      taskId: Number(taskId),
      typeId: Number(typeId),
      taskName,
      taskContent,
      status: Number(status)
    })
    console.log("response", response)
    return res.send(response)
  }

  const requestMap = {
    "get-all-task-type": getAllTaskType,
    "get-todo-list-by-type-id": getTodoListByTypeId,
    init: async () => {
      const taskTypeList = await getAllTaskType()
      const todoList = await getTodoListByTypeId({
        typeId: taskTypeList[0].typeId,
        page: 1,
        pageSize: 30,
        status: ETaskStatus.未完成,
        startTime: subDays(Date.now(), 7).getTime(),
        endTime: Date.now()
      })
      return {
        taskTypeList,
        todoList: todoList.result
      }
    }
  }
  // @ts-ignore
  const data = await requestMap[type]()
  console.log("request bg data:", data)
  res.send({
    message: "response from background",
    data
  })
}

export default handler
