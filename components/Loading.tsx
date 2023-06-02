export default function Loading() {
  return (
    <div className="flex flex-col w-[400px] h-[200px] pb-12">
      <div className="loader">
        <span className="relative top-20 right-2 text-[#db4c3f]">
          loading...
        </span>
      </div>
    </div>
  )
}
