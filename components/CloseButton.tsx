import { IoCloseOutline } from "react-icons/io5"

export default function CloseButton({
  onClick
}: {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <button onClick={onClick}>
      <IoCloseOutline className="p-[4px] rounded-full hover:bg-gray-100 transition-all text-[24px]" />
    </button>
  )
}
