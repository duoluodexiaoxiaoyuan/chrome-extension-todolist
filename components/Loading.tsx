export default function Loading() {
  return (
    <div
      className="flex flex-col w-[80vw] max-w-[922px] h-[690px] pb-12 bg-white rounded-md"
      style={{ maxHeight: "calc(90vh - 107px)" }}>
      <div className="loader">
        <div className="relative top-20 right-2 w-[90px] text-[#db4c3f]">
          loading...
        </div>
      </div>
    </div>
  )
}
