import { useEffect, useState } from "react"

import { AiOutlineLoading3Quarters } from "react-icons/ai"
import type { IUpdateTodoItemParams } from "~utils/types"
import { IoCloseOutline } from "react-icons/io5"
import clsx from "clsx"
import { onCreateNewTodoItem } from "~utils/services"
import { sendToBackground } from "@plasmohq/messaging"
import { taskTypeListAtom } from "~utils/store"
import { todoListAtom } from "~utils/store"
import { uniqBy } from "lodash-es"
import { useAtom } from "jotai"

interface IProps {
  todo?: IUpdateTodoItemParams
  onClose: () => void
}
export default function EditTodoItem({ todo, onClose }: IProps) {
  const [taskTypeList, setTaskTypeList] = useAtom(taskTypeListAtom)
  const [, setTodoList] = useAtom(todoListAtom)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [selectTypeId, setSelectTypeId] = useState<number>(
    taskTypeList?.[0]?.typeId ?? -1
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const defaultForm = {
    taskName: todo?.taskName ?? "",
    taskContent: todo?.taskContent ?? ""
  }
  const [form, setForm] = useState(defaultForm)

  const onPressKeyEnter = async (newType: string) => {
    try {
      if (newType.length === 0 && isLoading) return
      setIsLoading(true)
      const body = {
        type: "new-task-type",
        newTaskTypeName: newType
      }
      console.log("body:", body)
      const { data: newTaskTypeList } = await sendToBackground({
        name: "request",
        body
      })
      console.log("new task:", newTaskTypeList)
      setTaskTypeList(newTaskTypeList)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!selectTypeId) {
        setErrorMsg("请选择一个事项标签吧，方便后续按分类查看")
        return
      }
      if (!form.taskName) {
        setErrorMsg("输入一个简洁的标题吧")
        return
      }
      if (!form.taskContent) {
        setErrorMsg("输入事项描述吧，以免后续忘记关键内容")
        return
      }
      setIsCreating(true)
      const newTodoItem = await onCreateNewTodoItem({
        ...form,
        typeId: selectTypeId
      })
      console.log("create a new item:", newTodoItem)
      setTodoList((i) => uniqBy([newTodoItem, ...i], "taskId"))
    } catch (error) {
      console.error("create todo item error:", error)
    } finally {
      setIsCreating(false)
    }
  }

  useEffect(() => {
    // init type id
    if (taskTypeList?.length > 0 && selectTypeId === -1) {
      setSelectTypeId(taskTypeList[0].typeId)
    }
  }, [taskTypeList])

  return (
    <form
      className="p-4 pl-6 border-2 border-gray-100 w-[600px] m-4 mx-auto rounded-md"
      onSubmit={onSubmit}>
      <div className="flex items-center gap-4 pb-4">
        <input
          type="text"
          placeholder="标题"
          className="p-2 rounded-sm border-none outline-none text-[14px] flex-grow"
          autoFocus
          value={form.taskName}
          onChange={(e) => setForm({ ...form, taskName: e.target.value })}
        />
        <IoCloseOutline
          className="relative bottom-3 left-2 cursor-pointer p-[4px] rounded-full hover:bg-gray-100 transition-all text-[24px]"
          onClick={onClose}
        />
      </div>
      <textarea
        value={form.taskContent}
        onChange={(e) => setForm({ ...form, taskContent: e.target.value })}
        rows={4}
        placeholder="我得去做点什么..."
        className="p-2 rounded-md bg-gray-50 w-full text-[13px] focus-visible:outline-gray-100 text-gray-500 resize-none"
      />
      <div
        className="flex items-center gap-2 p-2 flex-wrap text-[12px]"
        style={{ opacity: taskTypeList.length }}>
        {taskTypeList &&
          taskTypeList.map(({ typeId, typeName }) => (
            <button
              className={clsx(
                "p-1 rounded-sm",
                `${
                  selectTypeId === typeId || selectTypeId === undefined
                    ? "text-white bg-[#d04b22]"
                    : "text-gray-500 bg-white"
                }`
              )}
              onClick={() => setSelectTypeId(typeId)}
              key={typeId}>
              {typeName}
            </button>
          ))}

        {isLoading || taskTypeList.length === 0 ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <div
            contentEditable={isLoading === false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onPressKeyEnter(e.currentTarget.textContent.trim())
                e.currentTarget.textContent = "新建"
              }
            }}
            className="p-1 max-w-max text-[#cb5647] outline-dashed outline-transparent rounded-sm focus-visible:outline-[#cb5647]">
            新建
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 p-2 mt-10 text-[12px]">
        <span
          className="mr-auto text-[#cb5647] h-[12px]"
          style={{ opacity: errorMsg.length }}>
          {errorMsg}
        </span>
        <button
          className="p-1 underline text-gray-500"
          onClick={() => setForm(defaultForm)}>
          重置
        </button>
        <button
          className="p-1 px-2 bg-[#d04b22] text-white rounded-sm"
          type="submit">
          {isCreating ? (
            <div className="flex items-center gap-2">
              <AiOutlineLoading3Quarters className="animate-spin" />
              请稍后
            </div>
          ) : (
            "创建"
          )}
        </button>
      </div>
    </form>
  )
}
