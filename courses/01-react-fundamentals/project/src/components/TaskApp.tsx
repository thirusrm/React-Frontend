import type { Dispatch, SetStateAction } from 'react'
import TaskForm from './TaskForm'
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

  const handleAddTask = (newTask: Task) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) => [
        ...previousTasks,
        newTask,
      ])
    }
  }

  return (
    <main>
      {props.showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      <TaskList
        tasks={tasks}
        countText={taskCountText}
      />
    </main>
  )
}