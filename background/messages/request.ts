import { getAllTaskType, getTodoListByTypeId } from "~utils/services"

import { ETaskStatus } from "~utils/types"
import type { PlasmoMessaging } from "@plasmohq/messaging"
import { subDays } from "date-fns"

const handler: PlasmoMessaging.MessageHandler<{ type: string }> = async (
  req,
  res
) => {
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
  const data = await requestMap[req.body.type]()
  console.log("request bg data:", data)
  res.send({
    message: "response from background",
    data
  })
}

export default handler
