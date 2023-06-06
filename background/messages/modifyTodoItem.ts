import type { PlasmoMessaging } from "@plasmohq/messaging"

import { modifyTodoItem } from "~utils/services"

const handler: PlasmoMessaging.MessageHandler<{
  type: string
  [k: string]: string
}> = async (req, res) => {
  const { taskId, typeId, taskName, taskContent, status, expectTime } = req.body
  const response = await modifyTodoItem({
    taskId: Number(taskId),
    typeId: Number(typeId),
    taskName,
    taskContent,
    status: Number(status),
    expectTime
  })
  return res.send(response)
}

export default handler
