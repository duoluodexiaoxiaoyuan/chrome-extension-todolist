import type { ITaskType, ITodoItem, IUserInfo } from "./types"
import { atom, useAtom } from "jotai"

const userInfoAtom = atom({} as IUserInfo)
const todoListAtom = atom([
  {
    taskId: 1,
    typeId: 2,
    userId: 3,
    status: 1,
    taskName: "Complete project",
    taskContent: "Finish all the remaining tasks and submit the project",
    createTime: "2023-06-03T10:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 2,
      userId: 3,
      typeName: "Work",
      desc: "Tasks related to work",
      createTime: "2023-06-01T10:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 2,
    typeId: 2,
    userId: 4,
    status: 1,
    taskName: "Buy groceries",
    taskContent: "Buy milk, eggs, bread and vegetables from the store",
    createTime: "2023-06-02T15:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 1,
      userId: 4,
      typeName: "Personal",
      desc: "Tasks related to personal life",
      createTime: "2023-06-02T10:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 30,
    typeId: 2,
    userId: 3,
    status: 1,
    taskName: "Complete project",
    taskContent: "Finish all the remaining tasks and submit the project",
    createTime: "2023-06-03T10:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 2,
      userId: 3,
      typeName: "Work",
      desc: "Tasks related to work",
      createTime: "2023-06-01T10:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 3,
    typeId: 3,
    userId: 2,
    status: 0,
    taskName: "Learn new skill",
    taskContent: "Learn a new programming language or framework",
    createTime: "2023-06-03T13:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 3,
      userId: 2,
      typeName: "Skill Development",
      desc: "Tasks related to learning new skills",
      createTime: "2023-06-01T10:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 4,
    typeId: 1,
    userId: 5,
    status: 1,
    taskName: "Do laundry",
    taskContent: "Wash clothes and hang them to dry",
    createTime: "2023-06-03T16:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 1,
      userId: 5,
      typeName: "Personal",
      desc: "Tasks related to personal life",
      createTime: "2023-06-03T10:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 5,
    typeId: 2,
    userId: 6,
    status: 1,
    taskName: "Prepare presentation",
    taskContent: "Prepare slides and rehearse for the upcoming presentation",
    createTime: "2023-06-04T09:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 2,
      userId: 6,
      typeName: "Work",
      desc: "Tasks related to work",
      createTime: "2023-06-04T08:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 6,
    typeId: 3,
    userId: 4,
    status: 0,
    taskName: "Read book",
    taskContent: "Read a book on a topic of your choice for at least an hour",
    createTime: "2023-06-05T10:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 3,
      userId: 4,
      typeName: "Skill Development",
      desc: "Tasks related to learning new skills",
      createTime: "2023-06-05T09:00:00.000Z",
      updateTime: ""
    }
  },
  {
    taskId: 7,
    typeId: 1,
    userId: 1,
    status: 1,
    taskName: "Go for a run",
    taskContent: "Go for a run for at least 30 minutes in the morning",
    createTime: "2023-06-06T07:00:00.000Z",
    completeTime: "",
    updateTime: "",
    typeMessage: {
      typeId: 1,
      userId: 1,
      typeName: "Personal",
      desc: "Tasks related to personal life",
      createTime: "2023-06-06T06:00:00.000Z",
      updateTime: ""
    }
  }
] as ITodoItem[])
const taskTypeListAtom = atom([
  // {
  //   createTime: "2023-06-03 10:00:00",
  //   typeId: 1,
  //   typeName: "紧急",
  //   userId: 123
  // },
  // {
  //   createTime: "2023-06-03 11:00:00",
  //   desc: true,
  //   typeId: 2,
  //   typeName: "重要",
  //   updateTime: "2023-06-03 12:30:00",
  //   userId: 456
  // },
  // {
  //   createTime: "2023-06-03 13:00:00",
  //   typeId: 3,
  //   typeName: "稍后再看",
  //   userId: 789
  // }
] as ITaskType[])

export const editModelAtom = atom({
  visible: false,
  data: undefined as ITodoItem | undefined
})

const getTodoListByTypeId = (typeId: number) => {
  return atom((get) =>
    get(todoListAtom).filter((item) => item.typeId === typeId)
  )
}

const getTodoTaskById = (taskId: number) => {
  return atom((get) => get(todoListAtom).find((item) => item.taskId === taskId))
}

const removeTodoTaskById = (taskId: number) => {
  const [, setTodoList] = useAtom(todoListAtom)
  setTodoList((i) => i.filter((item) => item.taskId !== taskId))
}

const modifyTodoTaskById = (taskId: number, newTodoTask: ITodoItem) => {
  const [, setTodoList] = useAtom(todoListAtom)
  setTodoList((i) => {
    const index = i.findIndex((item) => item.taskId === taskId)
    if (index !== -1) {
      i[index] = newTodoTask
    }
    return i
  })
}

export {
  userInfoAtom,
  todoListAtom,
  taskTypeListAtom,
  getTodoListByTypeId,
  getTodoTaskById,
  removeTodoTaskById,
  modifyTodoTaskById
}
