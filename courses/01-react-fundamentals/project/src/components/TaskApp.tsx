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

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

  const taskCountText =
    props.countFormat === 'completed'
      ? `${completedTasks} of ${tasks.length} completed`
      : `${tasks.length} Tasks`

  const handleAddTask = (newTask: Task) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) => [
        ...previousTasks,
        newTask,
      ])
    }
  }

  const handleToggleTask = (taskId: string | number) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
              }
            : task,
        ),
      )
    }
  }

  const handleDeleteTask = (taskId: string | number) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.id !== taskId,
        ),
      )
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
        onToggle={handleToggleTask}
        onDelete={props.onDelete ? handleDeleteTask : undefined}
      />
    </main>
  )
}