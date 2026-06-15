import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import FilterBar from './FilterBar'
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

type FilterType = 'all' | 'active' | 'completed'

export default function TaskApp(props: TaskAppProps) {
  const tasks = props.tasks ?? []

  const [filter, setFilter] =
    useState<FilterType>('all')

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

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

  const filteredTasks =
    filter === 'active'
      ? tasks.filter((task) => !task.completed)
      : filter === 'completed'
        ? tasks.filter((task) => task.completed)
        : tasks

  let taskCountText = ''

  if (props.showFilterBar) {
    taskCountText = `Showing ${filteredTasks.length} of ${tasks.length} tasks`
  } else if (props.countFormat === 'completed') {
    taskCountText = `${completedTasks} of ${tasks.length} completed`
  } else {
    taskCountText = `${tasks.length} Tasks`
  }

  return (
    <main>
      {props.showForm && (
        <TaskForm onAddTask={handleAddTask} />
      )}

      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
        />
      )}

      {filteredTasks.length === 0 ? (
        <>
          <div id="task-count">
            {taskCountText}
          </div>

          <div id="filter-empty-message">
            No tasks match this filter
          </div>
        </>
      ) : (
        <TaskList
          tasks={filteredTasks}
          countText={taskCountText}
          onToggle={handleToggleTask}
          onDelete={
            props.onDelete
              ? handleDeleteTask
              : undefined
          }
        />
      )}
    </main>
  )
}