import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react'
import FilterBar from './FilterBar'
import TaskForm from './TaskForm'
import TaskList, { type Task } from './TaskList'
import StatsPanel from './StatsPanel'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'
import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TOGGLE_TASK,
} from '../reducers/taskReducer'


interface TaskAppProps {
  tasks?: Task[]
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
  const {
    tasks: taskProps = [],
    dispatch,
    showForm,
    countFormat,
    showFilterBar,
    showStatsPanel,
    onDelete,
  } = props

  const tasks = taskProps

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

  const handleAddTask = useCallback(
    (newTask: Task) => {
      const taskWithDefaults: Task = {
        ...newTask,
        category:
          newTask.category ?? 'General',
        tags: newTask.tags ?? [],
        dueDate: newTask.dueDate,
      }

      dispatch?.({
        type: ADD_TASK,
        payload: taskWithDefaults,
      })
    },
    [dispatch],
  )

  const handleToggleTask = useCallback(
    (taskId: string | number) => {
      dispatch?.({
        type: TOGGLE_TASK,
        payload: taskId,
      })
    },
    [dispatch],
  )

  const handleDeleteTask = useCallback(
    (taskId: string | number) => {
      dispatch?.({
        type: DELETE_TASK,
        payload: taskId,
      })
    },
    [dispatch],
  )

  const handleUpdateTask = useCallback(
    (
      taskId: string | number,
      updates: Partial<Task>,
    ) => {
      dispatch?.({
        type: UPDATE_TASK,
        payload: {
          id: taskId,
          updates,
        },
      })
    },
    [dispatch],
  )

  const priorityValue = (
    priority: string,
  ): number => {
    if (priority === 'High') return 3
    if (priority === 'Medium') return 2
    return 1
  }

  const sortedTasks = useMemo(() => {
    const filteredTasks =
      filter === 'active'
        ? tasks.filter(
            (task) => !task.completed,
          )
        : filter === 'completed'
          ? tasks.filter(
              (task) => task.completed,
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

    const result = [...searchedTasks]

    if (sortOrder === 'priority-high') {
      result.sort(
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
      result.sort(
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
      result.sort((a, b) =>
        a.title
          .toLowerCase()
          .localeCompare(
            b.title.toLowerCase(),
          ),
      )
    } else if (
      sortOrder === 'due-date'
    ) {
      result.sort((a, b) => {
        if (
          !a.dueDate &&
          !b.dueDate
        ) {
          return 0
        }
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1

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

    return result
  }, [
    tasks,
    filter,
    selectedCategory,
    debouncedSearchText,
    sortOrder,
  ])

  let taskCountText = ''

  if (showFilterBar) {
    taskCountText = `Showing ${sortedTasks.length} of ${tasks.length} tasks`
  } else if (
    countFormat ===
    'completed'
  ) {
    taskCountText = `${completedTasks} of ${tasks.length} completed`
  } else {
    taskCountText = `${tasks.length} Tasks`
  }

  return (
    <main data-theme={theme}>
      <ThemeToggle />

      {showForm && (
        <TaskForm
          onAddTask={handleAddTask}
        />
      )}

      {showFilterBar && (
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

      {showStatsPanel && (
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
            onDelete
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