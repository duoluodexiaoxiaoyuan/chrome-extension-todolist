import type { ITodoItem } from "~utils/types"

interface IProps {
  item: ITodoItem
}
export default function TodoItem({ item }: IProps) {
  const { taskName, taskContent, taskId } = item
  return (
    <div className="p-4 my-2">
      <h5>{taskName}</h5>
      <p>{taskContent}</p>
    </div>
  )
}
