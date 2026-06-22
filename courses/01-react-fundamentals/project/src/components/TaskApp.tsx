import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'
import StatsPanel from './StatsPanel'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'


interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: {
    type: string
    payload?: unknown
  }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

type FilterType =
  | 'all'
  | 'active'
  | 'completed'

type SortType =
  | 'recent'
  | 'priority-high'
  | 'priority-low'
  | 'alphabetical'
  | 'due-date'

export default function TaskApp(
  props: TaskAppProps,
) {
  const tasks = props.tasks ?? []

  const { theme } = useTheme()

  const [filter, setFilter] =
    useState<FilterType>('all')

  const [selectedCategory, setSelectedCategory] =
    useState('all')

  const [sortOrder, setSortOrder] =
    useState<SortType>('recent')

  const [searchText, setSearchText] =
    useState('')

  const [
    debouncedSearchText,
    setDebouncedSearchText,
  ] = useState('')

  const [isSearching, setIsSearching] =
    useState(false)

  const [editingId, setEditingId] =
    useState<string | number | null>(
      null,
    )

  useEffect(() => {
    if (searchText !== debouncedSearchText) {
      setIsSearching(true)
    }

    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText)
      setIsSearching(false)
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchText, debouncedSearchText])

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

  const categories = [
    'all',
    ...new Set(
      tasks.map(
        (task) =>
          task.category ?? 'General',
      ),
    ),
  ]

  const handleAddTask = (
    newTask: Task,
  ) => {
    const taskWithDefaults: Task = {
      ...newTask,
      category:
        newTask.category ?? 'General',
      tags: newTask.tags ?? [],
      dueDate: newTask.dueDate,
    }

    if (props.setTasks) {
      props.setTasks((previousTasks) => [
        ...previousTasks,
        taskWithDefaults,
      ])
    }
  }

  const handleToggleTask = (
    taskId: string | number,
  ) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed:
                  !task.completed,
              }
            : task,
        ),
      )
    }
  }

  const handleDeleteTask = (
    taskId: string | number,
  ) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) =>
        previousTasks.filter(
          (task) =>
            task.id !== taskId,
        ),
      )
    }
  }

  const handleUpdateTask = (
    taskId: string | number,
    updates: Partial<Task>,
  ) => {
    if (props.setTasks) {
      props.setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
              }
            : task,
        ),
      )
    }
  }

  const filteredTasks =
    filter === 'active'
      ? tasks.filter(
          (task) =>
            !task.completed,
        )
      : filter === 'completed'
        ? tasks.filter(
            (task) =>
              task.completed,
          )
        : tasks

  const categoryFilteredTasks =
    selectedCategory === 'all'
      ? filteredTasks
      : filteredTasks.filter(
          (task) =>
            (task.category ??
              'General') ===
            selectedCategory,
        )

  const searchedTasks =
    debouncedSearchText.trim() === ''
      ? categoryFilteredTasks
      : categoryFilteredTasks.filter(
          (task) =>
            task.title
              .toLowerCase()
              .includes(
                debouncedSearchText.toLowerCase(),
              ) ||
            task.description
              .toLowerCase()
              .includes(
                debouncedSearchText.toLowerCase(),
              ),
        )

  const priorityValue = (
    priority: string,
  ): number => {
    if (priority === 'High') return 3
    if (priority === 'Medium') return 2
    return 1
  }

  const sortedTasks = [
    ...searchedTasks,
  ]

  if (sortOrder === 'priority-high') {
    sortedTasks.sort(
      (a, b) =>
        priorityValue(
          b.priority,
        ) -
        priorityValue(
          a.priority,
        ),
    )
  } else if (
    sortOrder === 'priority-low'
  ) {
    sortedTasks.sort(
      (a, b) =>
        priorityValue(
          a.priority,
        ) -
        priorityValue(
          b.priority,
        ),
    )
  } else if (
    sortOrder === 'alphabetical'
  ) {
    sortedTasks.sort((a, b) =>
      a.title
        .toLowerCase()
        .localeCompare(
          b.title.toLowerCase(),
        ),
    )
  } else if (
    sortOrder === 'due-date'
  ) {
    sortedTasks.sort((a, b) => {
      if (
        !a.dueDate &&
        !b.dueDate
      ) {
        return 0
      }

      if (!a.dueDate) {
        return 1
      }

      if (!b.dueDate) {
        return -1
      }

      return (
        new Date(
          a.dueDate,
        ).getTime() -
        new Date(
          b.dueDate,
        ).getTime()
      )
    })
  }

  let taskCountText = ''

  if (props.showFilterBar) {
    taskCountText = `Showing ${sortedTasks.length} of ${tasks.length} tasks`
  } else if (
    props.countFormat ===
    'completed'
  ) {
    taskCountText = `${completedTasks} of ${tasks.length} completed`
  } else {
    taskCountText = `${tasks.length} Tasks`
  }

  return (
    <main data-theme={theme}>
      <ThemeToggle />

      {props.showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          sortOrder={sortOrder}
          searchText={searchText}
          categories={categories}
          selectedCategory={
            selectedCategory
          }
          onCategoryChange={
            setSelectedCategory
          }
          onFilterChange={setFilter}
          onSortChange={(value) =>
            setSortOrder(
              value as SortType,
            )
          }
          onSearchChange={
            setSearchText
          }
          onClearSearch={() =>
            setSearchText('')
          }
        />
      )}

      {isSearching && (
        <div id="searching-indicator">
          Searching...
        </div>
      )}

      {props.showStatsPanel && (
        <StatsPanel
          total={tasks.length}
          completed={completedTasks}
          active={
            tasks.length -
            completedTasks
          }
          overdue={
            tasks.filter(
              (task) =>
                !task.completed &&
                task.dueDate &&
                new Date(
                  task.dueDate,
                ) < new Date(),
            ).length
          }
        />
      )}

      {sortedTasks.length === 0 ? (
        <>
          <div id="task-count">
            {taskCountText}
          </div>

          <div id="filter-empty-message">
            No tasks found
          </div>
        </>
      ) : (
        <TaskList
          tasks={sortedTasks}
          countText={taskCountText}
          onToggle={
            handleToggleTask
          }
          onDelete={
            props.onDelete
              ? handleDeleteTask
              : undefined
          }
          onUpdateTask={
            handleUpdateTask
          }
          editingId={editingId}
          setEditingId={
            setEditingId
          }
        />
      )}
    </main>
  )
}