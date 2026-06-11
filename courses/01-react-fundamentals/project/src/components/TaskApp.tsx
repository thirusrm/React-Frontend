import type { Dispatch, SetStateAction } from 'react'
import TaskList, { type Task } from './TaskList'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

export default function TaskApp(props: TaskAppProps) {
  const tasks = props.tasks ?? []
  const taskCountText = `${tasks.length} Tasks`

  return (
    <main>
      <TaskList
        tasks={tasks}
        countText={taskCountText}
      />
    </main>
  )
}