import clsx from "clsx"
import { useAtom } from "jotai"
import { type CSSProperties, useEffect, useRef, useState } from "react"
import { AiOutlineEdit } from "react-icons/ai"
import { BsCalendar2Check } from "react-icons/bs"
import { CiCircleCheck } from "react-icons/ci"

import { calcTodoExprTime, formatTimestamp, isExprTimeExpired } from "~utils"
import { editModelAtom } from "~utils/store"
import { ETaskStatus, type ITodoItem } from "~utils/types"

import CloseButton from "./CloseButton"

interface IProps {
  item: ITodoItem
  styles?: CSSProperties
}
export default function TodoItem({ item, styles }: IProps) {
  const { taskName, taskContent, taskId, status, expectTime } = item
  const [isLoading, setIsLoading] = useState(false)
  const [editModal, setEditModal] = useAtom(editModelAtom)
  const onChangeStatus = async () => {
    try {
      setIsLoading(true)
    } catch (error) {
      console.error("change status fail:", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div
      className="p-4 pr-2 m-4 mx-8 border border-gray-100 rounded-md grid group grid-cols-todo border-l-[4px] hover:border-l-[#cb5647] hover:custom-shadow item-init"
      style={styles}>
      <button
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
        <CloseButton onClick={() => {}} />
      </div>
    </div>
  )
}
