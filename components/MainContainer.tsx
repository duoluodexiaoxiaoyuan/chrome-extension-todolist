import { todoListAtom, userInfoAtom } from "~utils/store"
import { useEffect, useState } from "react"

import { ETaskStatus } from "~utils/types"
import { IoCloseOutline } from "react-icons/io5"
import { onClickStopPropagation } from "~utils"
import { useAtom } from "jotai"

export default function MainContainer({
  onDisActive
}: {
  onDisActive: () => void
}) {
  const [userInfo] = useAtom(userInfoAtom)
  const [todoList] = useAtom(todoListAtom)
  const [offset, setOffset] = useState(2)
  const [status, setStatus] = useState(ETaskStatus.未完成)

  useEffect(() => {
    console.log("userInfo:", userInfo)
  }, [userInfo])

  const onSwitchStatus = (isFinish?: boolean) => {
    if (isFinish) {
      setStatus(ETaskStatus.已完成)
      setOffset(64)
    } else {
      setStatus(ETaskStatus.未完成)
      setOffset(2)
    }
  }

  return (
    <div
      className="w-[80vw] max-w-[922px] min-h-[400px] max-h-[80vh] bg-white rounded-md custom-shadow relative"
      onClick={onClickStopPropagation}>
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div>
          {/* <h5 className="text-2xl">Hi, {userInfo.username}</h5>
          <span className=" text-gray-300 rounded-sm text-[12px] items-end">
            目前还有
            {todoList.filter((i) => i.status === ETaskStatus.未完成).length}
            个未完成的任务
          </span> */}
          待办事项
        </div>
        <IoCloseOutline
          className="p-[2px] cursor-pointer text-[20px]"
          onClick={onDisActive}
        />
      </div>
      <div className="flex justify-between items-center absolute bottom-4 left-4 right-0">
        <div className="flex relative p-[2px] border border-black rounded-full">
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{ color: offset === 2 ? "white" : "black" }}
            onClick={() => onSwitchStatus(false)}>
            未完成
          </button>
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{ color: offset !== 2 ? "white" : "black" }}
            onClick={() => onSwitchStatus(true)}>
            已完成
          </button>
          <span
            className="w-[64px] absolute transition-all bg-black rounded-[28px] bottom-[2px] top-[2px]"
            style={{ left: `${offset}px` }}></span>
        </div>
      </div>
    </div>
  )
}
