import type { PlasmoMessaging } from "@plasmohq/messaging"
import { login } from "~utils/services"

const handler: PlasmoMessaging.MessageHandler<{
  type: string
  [k: string]: string
}> = async (req, res) => {
  try {
    const { phone, password } = req.body
    return res.send(await login(phone, password))
  } catch (error) {
    return res.send(null)
  }
}

export default handler
