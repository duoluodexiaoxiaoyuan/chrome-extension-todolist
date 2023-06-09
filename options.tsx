import type { PlasmoGetStyle } from "plasmo"
import styleText from "data-text:./style.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export default function () {
  return <div className="bg-green-50 min-h-screen"></div>
}
