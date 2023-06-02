import { AiOutlineMessage } from "react-icons/ai"
import { MdClose } from "react-icons/md"

export default function AuthTip({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed top-24 right-24 max-w-max p-5 rounded-sm bg-white shadow-2xl text-[14px] flex items-center gap-2"
      style={{ zIndex: Number.MAX_SAFE_INTEGER }}>
      <AiOutlineMessage className="text-green-500" />
      <a
        href="http://www.jimmyxuexue.top:668/#/todolist"
        target="_blank"
        className="text-gray-500">
        请先前往Jimmy的应用页面登录账户再使用 :)
      </a>
      <MdClose
        className="absolute -top-1.5 -right-1.5 bg-gray-50 rounded-full p-1 text-[18px] cursor-pointer hover:bg-gray-100 hover:scale-110 transition-all origin-center transform"
        onClick={onClose}
      />
    </div>
  )
}
