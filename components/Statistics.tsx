import chartXkcd from "chart.xkcd"
import { Bar, Line, Pie, XY } from "chart.xkcd-react"
import clsx from "clsx"
import statisticSvg from "data-base64:~assets/statistic.svg"
import { useAtom } from "jotai"
import { useMemo } from "react"
import { BsArrowUp } from "react-icons/bs"

import { calcTodoCountInWeek } from "~utils"
import { taskTypeListAtom, todoListAtom, userInfoAtom } from "~utils/store"
import { ETaskStatus, type ITodoItem } from "~utils/types"

export default function Statistics() {
  const [userInfo] = useAtom(userInfoAtom)
  const [todoList] = useAtom(todoListAtom)
  const [taskTypeList] = useAtom(taskTypeListAtom)

  const trendData = useMemo(() => {
    const todayTasks = todoList.filter(
      (item) => item.createTime === new Date().toLocaleDateString()
    )
    const yesterdayTasks = todoList.filter(
      (item) =>
        item.createTime ===
        new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString()
    )
    const newestValue = todayTasks.length - yesterdayTasks.length
    const doneTaskCount = todoList.filter(
      (item) => item.status === ETaskStatus.已完成
    ).length

    const { result, exprResult } = calcTodoCountInWeek(todoList)

    return {
      new: {
        isIncrease: newestValue > 0,
        value: Math.abs(newestValue)
      },
      all: {
        done: doneTaskCount,
        undone: todoList.length - doneTaskCount
      },
      result,
      exprResult
    }
  }, [todoList])

  return (
    <div className="rounded-md flex items-center gap-4 p-4">
      <div className="bg-[#db4c3f] text-white p-4 rounded-md px-24">
        <div className="flex flex-col justify-center items-center my-8">
          <img src={userInfo.avatar} className="rounded-full w-16 h-16 mb-2" />
          <div className="text-center text-[18px] font-bold">
            {userInfo.username}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span
              className={clsx(
                {
                  "text-[#4ffa4f]": trendData.new.isIncrease,
                  "text-white transform rotate-180": !trendData.new.isIncrease
                },
                "p-1 rounded-full font-bold"
              )}>
              <BsArrowUp />
            </span>
            <span>相较昨日</span>
          </div>
          <div className="text-center text-[48px] font-bold mt-2">
            {todoList.length}
          </div>
        </div>
      </div>
      <div className="w-[500px]">
        {/* 数据新增 */}
        <Pie
          config={{
            title: "What Tim made of", // optional
            data: {
              labels: taskTypeList.map((i) => i.typeName),
              datasets: [
                {
                  data: taskTypeList.map((i) => {
                    const typeId = i.typeId
                    return todoList.filter((item) => item.typeId === typeId)
                      .length
                  })
                }
              ]
            },
            options: {
              // optional
              innerRadius: 0.5,
              legendPosition: chartXkcd.config.positionType.upRight
            }
          }}
        />
      </div>
      {/* <div className="bg-[#db4c3f] text-white">
        <span className="w-[100px] leading-[24px] text-[14px] p-4">
          保持进度并不简单，坚持不懈是唯一的答案
        </span>
        <img src={statisticSvg} className="w-[200px]" />
      </div> */}
    </div>
  )
}
