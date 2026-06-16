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

type SortType =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'

export default function TaskApp(props: TaskAppProps) {
  const tasks = props.tasks ?? []

  const [filter, setFilter] =
    useState<FilterType>('all')

  const [sortOrder, setSortOrder] =
    useState<SortType>('recent')

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

  const priorityValue = (
    priority: string,
  ): number => {
    if (priority === 'High') return 3
    if (priority === 'Medium') return 2
    return 1
  }

  const sortedTasks = [...filteredTasks]

  if (sortOrder === 'priority-high') {
    sortedTasks.sort(
      (a, b) =>
        priorityValue(b.priority) -
        priorityValue(a.priority),
    )
  } else if (sortOrder === 'priority-low') {
    sortedTasks.sort(
      (a, b) =>
        priorityValue(a.priority) -
        priorityValue(b.priority),
    )
  } else if (sortOrder === 'alphabetical') {
    sortedTasks.sort((a, b) =>
      a.title
        .toLowerCase()
        .localeCompare(
          b.title.toLowerCase(),
        ),
    )
  }

  let taskCountText = ''

  if (props.showFilterBar) {
    taskCountText = `Showing ${sortedTasks.length} of ${tasks.length} tasks`
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
          sortOrder={sortOrder}
          onFilterChange={setFilter}
          onSortChange={(value) =>
            setSortOrder(
              value as SortType,
            )
          }
        />
      )}

      {sortedTasks.length === 0 ? (
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
          tasks={sortedTasks}
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