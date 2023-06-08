import chartXkcd from "chart.xkcd"
import { Pie } from "chart.xkcd-react"
import clsx from "clsx"
import { isAfter, isBefore, startOfDay, subDays } from "date-fns"
// import statisticSvg from "data-base64:~assets/statistic.svg"
import { useAtom } from "jotai"
import { useMemo } from "react"
import { BsArrowUp, BsJournalCheck, BsListTask } from "react-icons/bs"

import { calcTodoCountInWeek } from "~utils"
import { taskTypeListAtom, todoListAtom, userInfoAtom } from "~utils/store"
import { ETaskStatus } from "~utils/types"

export default function Statistics() {
  const [userInfo] = useAtom(userInfoAtom)
  const [todoList] = useAtom(todoListAtom)
  const [taskTypeList] = useAtom(taskTypeListAtom)

  const trendData = useMemo(() => {
    const todayTasks = todoList.filter(
      (item) => Number(item.createTime) > startOfDay(new Date()).getTime()
    )
    // const yesterdayTasks = todoList.filter((item) => {
    //   // is yesterday's task
    //   const now = new Date()
    //   const yesterday = subDays(now, 1).getTime()
    //   const today = now.getTime()
    //   // const taskTime = new Date(Number(item.createTime)).getTime()
    //   const createTime = Number(item.createTime)

    //   console.log("task time:", new Date(createTime))
    //   console.log(createTime > yesterday, createTime < today)
    //   console.log("yesterday:", yesterday)
    //   console.log("today:", today)
    //   return createTime > yesterday && createTime < today
    // })
    // console.log(yesterdayTasks, todayTasks)
    // const newestValue = todayTasks.length - yesterdayTasks.length
    const doneTaskCount = todoList.filter(
      (item) => item.status === ETaskStatus.已完成
    ).length

    const { result, exprResult } = calcTodoCountInWeek(todoList)

    return {
      new: {
        isIncrease: todayTasks.length > 0,
        value: todayTasks.length
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
      <div className="bg-[#db4c3f] text-white p-4 rounded-md">
        <div className="flex flex-col justify-center items-center my-4">
          <img src={userInfo.avatar} className="rounded-full w-16 h-16 mb-2" />
          <div className="text-center text-[18px] font-bold">
            {userInfo.username}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-white text-[#d04b22] p-4 rounded-md w-[125px]">
            <div className="flex items-center pr-1">
              <span
                className={clsx(
                  // {
                  //   "text-[#4ffa4f]": trendData.new.isIncrease,
                  //   "transform rotate-180 text-[#d04b22]":
                  //     !trendData.new.isIncrease
                  // },
                  "p-1 rounded-full font-bold"
                )}>
                <BsJournalCheck />
              </span>
              <span>新任务</span>
            </div>
            <div className="text-center text-[48px] font-bold mt-2">
              {trendData.new.value}
            </div>
          </div>
          <div className="bg-white text-[#d04b22] p-4 rounded-md w-[125px]">
            <div className="flex items-center pr-1">
              <span className={clsx("p-1 rounded-full font-bold")}>
                <BsListTask />
              </span>
              <span>未完成</span>
            </div>
            <div className="text-center text-[48px] font-bold mt-2">
              {trendData.all.undone}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[500px]">
        {/* 数据新增 */}
        <Pie
          config={{
            title: "任务标签分析", // optional
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
