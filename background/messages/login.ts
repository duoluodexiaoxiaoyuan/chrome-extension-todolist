import type { PlasmoMessaging } from "@plasmohq/messaging"

import { login } from "~utils/services"

const handler: PlasmoMessaging.MessageHandler<{
  type: string
  [k: string]: string
}> = async (req, res) => {
  const { phone, password } = req.body
  return res.send(await login(phone, password))
}

export default handler
