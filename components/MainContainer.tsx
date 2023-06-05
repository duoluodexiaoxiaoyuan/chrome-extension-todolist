import { AiFillGithub, AiOutlineHome } from "react-icons/ai"
import {
  editModelAtom,
  taskTypeListAtom,
  todoListAtom,
  userInfoAtom
} from "~utils/store"
import { useEffect, useState } from "react"

import { BsPlusSquareDotted } from "react-icons/bs"
import { ETaskStatus } from "~utils/types"
import EditTodoItem from "./EditTodoItem"
import { GITHUB } from "~utils/config"
import { HOMEPAGE } from "~utils/config"
import { IoCloseOutline } from "react-icons/io5"
import Loading from "./Loading"
import TodoItem from "./TodoItem"
import { getInitData } from "~utils/services"
import { onClickStopPropagation } from "~utils"
import { useAtom } from "jotai"

export default function MainContainer({
  onDisActive
}: {
  onDisActive: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo] = useAtom(userInfoAtom)
  const [todoList, setTodoList] = useAtom(todoListAtom)
  const [, setTaskType] = useAtom(taskTypeListAtom)
  const [offset, setOffset] = useState(2)
  const [status, setStatus] = useState(ETaskStatus.未完成)
  const [editModal, setEditModal] = useAtom(editModelAtom)

  useEffect(() => {
    console.log("userInfo:", userInfo)
  }, [userInfo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { taskTypeList, todoList } = await getInitData()
        console.log("todo list:", todoList)
        setTaskType(taskTypeList)
        setTodoList(todoList)
      } catch (error) {
        console.log("fetch data fail:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSwitchStatus = (isFinish?: boolean) => {
    if (isFinish === true) {
      setStatus(ETaskStatus.已完成)
      setOffset(57)
    } else if (isFinish === false) {
      setStatus(ETaskStatus.未完成)
      setOffset(2)
    } else {
      setStatus(ETaskStatus.全部)
      setOffset(108)
      setStatus(ETaskStatus.全部)
    }
  }

  return (
    <div
      className="w-[80vw] max-w-[922px] min-h-[400px] max-h-[600px] bg-white rounded-md custom-shadow relative overflow-hidden"
      onClick={onClickStopPropagation}>
      <div className="flex items-center justify-between border-b border-gray-100 p-4 group relative">
        <a href={HOMEPAGE} target="_blank" className="flex gap-2 items-center">
          <AiOutlineHome className="text-[#cb5647]" />
          待办事项
        </a>
        <span className="transition-all translate-y-[-48px] group-hover:translate-y-0 absolute right-[50px] text-[20px]">
          <a href={GITHUB} target="_blank">
            <AiFillGithub />
          </a>
        </span>
        <IoCloseOutline
          className="cursor-pointer p-[4px] rounded-full hover:bg-gray-100 transition-all text-[24px]"
          onClick={onDisActive}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className="overflow-scroll pb-[60px] scrollbar transition-all ease-linear"
          style={{ height: "calc(600px - 107px)" }}>
          {todoList
            .filter(
              (item) => item.status === status || status === ETaskStatus.全部
            )
            .map((item, idx) => (
              <TodoItem
                key={item.taskId}
                item={item}
                styles={{ animationDelay: `${idx * 100}ms` }}
              />
            ))}
        </div>
      )}

      <div className="bottom-menu">
        <div className="mr-auto flex relative p-[2px] border border-[#cb5647] rounded-full text-[13px]">
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{
              color: status === ETaskStatus.未完成 ? "white" : "#cb5647"
            }}
            onClick={() => onSwitchStatus(false)}>
            未完成
          </button>
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{
              color: status === ETaskStatus.已完成 ? "white" : "#cb5647"
            }}
            onClick={() => onSwitchStatus(true)}>
            已完成
          </button>
          <button
            className="p-1 px-2 rounded-sm z-10"
            style={{ color: status === ETaskStatus.全部 ? "white" : "#cb5647" }}
            onClick={() => onSwitchStatus()}>
            全&nbsp;部&nbsp;
          </button>
          <span
            className="w-[33.333%] absolute transition-all bg-[#cb5647] rounded-[28px] bottom-[2px] top-[2px]"
            style={{ left: `${offset}px` }}></span>
        </div>
        <button
          className="p-1 text-md text-[#cb5647] flex items-center gap-2"
          onClick={() =>
            editModal.visible === false &&
            setEditModal({ visible: true, data: undefined })
          }>
          <BsPlusSquareDotted />
          创建待办
        </button>
      </div>
      {editModal.visible && (
        <EditTodoItem
          onClose={() => setEditModal({ visible: false, data: undefined })}
        />
      )}
    </div>
  )
}
