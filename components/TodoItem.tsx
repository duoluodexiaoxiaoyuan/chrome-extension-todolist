import clsx from "clsx"
import { useAtom } from "jotai"
import { type CSSProperties, useCallback, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { BsCalendar2Check } from "react-icons/bs"
import { CiCircleCheck } from "react-icons/ci"

import { calcTodoExprTime, formatTimestamp, isExprTimeExpired } from "~utils"
import { onModifyTodoItem, onRemoveTodoItem } from "~utils/services"
import { editModelAtom, todoListAtom } from "~utils/store"
import { ETaskStatus, type ITodoItem } from "~utils/types"

import CloseButton from "./CloseButton"

interface IProps {
  item: ITodoItem
  styles?: CSSProperties
  getTagColor: (tagId?: number) => string
}
export default function TodoItem({ item, styles, getTagColor }: IProps) {
  const { taskName, taskContent, taskId, status, expectTime } = item
  const [isLoading, setIsLoading] = useState(false)
  const [, setEditModal] = useAtom(editModelAtom)
  const [, setTodoList] = useAtom(todoListAtom)
  const onChangeStatus = async () => {
    let newTodoItem
    try {
      setIsLoading(true)
      newTodoItem = await onModifyTodoItem({
        ...item,
        status:
          item.status === ETaskStatus.已完成
            ? ETaskStatus.未完成
            : ETaskStatus.已完成
      })
    } catch (error) {
      console.error("change status fail:", error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        if (newTodoItem) {
          setTodoList((prev) => {
            return prev.map((item) => {
              if (item.taskId === taskId) {
                return newTodoItem
              }
              return item
            })
          })
        }
      }, 1000)
    }
  }

  const onClickRemoveBtn = async () => {
    try {
      setIsLoading(true)
      await onRemoveTodoItem(taskId)
    } catch (error) {
      console.error("remove todo item fail:", error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setTodoList((prev) => {
          return prev.filter((item) => item.taskId !== taskId)
        })
      }, 500)
    }
  }

  return (
    <div
      className={clsx(
        { "reverse-status": isLoading, "item-init": !isLoading },
        "todo-item group hover:border-l-[#cb5647] hover:custom-shadow"
      )}
      style={styles}>
      <button
        onClick={onChangeStatus}
        className={clsx(
          "text-2xl hover:scale-105 origin-center transition-all",
          { "text-green-600": status === ETaskStatus.已完成 }
        )}>
        <CiCircleCheck />
      </button>
      <div>
        <h5
          className={clsx("text-[16px] mb-2", {
            "line-through": status === ETaskStatus.已完成
          })}>
          {taskName}
        </h5>
        <p
          className={clsx("text-gray-500 text-[13px]", {
            "line-through text-gray-400": status == ETaskStatus.已完成
          })}>
          {taskContent}
        </p>
      </div>
      <div
        className="text-[12px] text-white p-0.5 flex gap-1 flex-wrap items-center justify-center"
        style={{ opacity: item.typeMessage?.typeId ? 1 : 0 }}>
        <span
          style={{ background: getTagColor(item.typeMessage?.typeId) }}
          className="p-1 rounded-sm inline-block h-max">
          {item.typeMessage?.typeName}
        </span>
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <BsCalendar2Check />
          <span
            className={clsx({
              "line-through text-gray-400": isExprTimeExpired(expectTime)
            })}>
            {formatTimestamp(expectTime)}
          </span>
        </div>
        <span
          className={clsx(
            { "text-[#d04b22]": isExprTimeExpired(expectTime) },
            "text-[12px]"
          )}>
          {calcTodoExprTime(expectTime)}
        </span>
      </div>
      <div className="flex items-center justify-end gap-2 group-hover:opacity-100 opacity-0 ">
        <AiOutlineEdit
          onClick={() => {
            setEditModal({ visible: true, data: item })
          }}
          className="cursor-pointer"
        />
        <CloseButton onClick={onClickRemoveBtn} />
      </div>
    </div>
  )
}
