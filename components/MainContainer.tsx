import { todoListAtom, userInfoAtom } from "~utils/store"
import { useEffect, useState } from "react"

import { BsPlusSquareDotted } from "react-icons/bs"
import { ETaskStatus } from "~utils/types"
import EditTodoItem from "./EditTodoItem"
import { IoCloseOutline } from "react-icons/io5"
import TodoItem from "./TodoItem"
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
  const [isShowEdit, setIsShowEdit] = useState(false)

  useEffect(() => {
    console.log("userInfo:", userInfo)
  }, [userInfo])

  const onSwitchStatus = (isFinish?: boolean) => {
    if (isFinish) {
      setStatus(ETaskStatus.已完成)
      setOffset(55)
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
        <div>待办事项</div>
        <IoCloseOutline
          className="cursor-pointer p-[4px] rounded-full hover:bg-gray-100 transition-all text-[24px]"
          onClick={onDisActive}
        />
      </div>
      <div
        className="flex flex-col overflow-y-auto pb-[60px]"
        style={{ maxHeight: "calc(80vh - 107px)" }}>
        {todoList.map((item) => (
          <TodoItem key={item.taskId} item={item} />
        ))}
      </div>
      <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 border-t border-gray-100 p-[10px] bg-white z-10">
        <div className="flex relative p-[2px] border border-[#cb5647] rounded-full text-[13px]">
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{ color: offset === 2 ? "white" : "#cb5647" }}
            onClick={() => onSwitchStatus(false)}>
            未完成
          </button>
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{ color: offset !== 2 ? "white" : "#cb5647" }}
            onClick={() => onSwitchStatus(true)}>
            已完成
          </button>
          <span
            className="w-[50%] absolute transition-all bg-[#cb5647] rounded-[28px] bottom-[2px] top-[2px]"
            style={{ left: `${offset}px` }}></span>
        </div>
        <button className="p-1 text-md" onClick={() => setIsShowEdit(true)}>
          <BsPlusSquareDotted />
        </button>
      </div>
      {isShowEdit && <EditTodoItem onClose={() => setIsShowEdit(false)} />}
    </div>
  )
}
