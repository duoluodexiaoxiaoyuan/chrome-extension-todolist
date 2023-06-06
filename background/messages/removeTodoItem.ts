import type { PlasmoMessaging } from "@plasmohq/messaging"
import { removeTodoItem } from "~utils/services"

const handler: PlasmoMessaging.MessageHandler<{
  [k: string]: string
}> = async (req, res) => {
  const { taskId } = req.body
  const response = await removeTodoItem(Number(taskId))
  return res.send(response)
}

export default handler
