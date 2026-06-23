import React from 'react'
import TaskCard from './TaskCard'

export interface Task {
  id: string | number
  title: string
  description: string
  priority: string
  completed: boolean
  category?: string
  tags?: string[]
  dueDate?: string | number
}

interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: Partial<Task>,
  ) => void
  editingId?: string | number | null
  setEditingId?: (
    id: string | number | null,
  ) => void
  linkToTaskDetail?: boolean
}

const HARDCODED_TASKS: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First hardcoded task',
    priority: 'High',
    completed: false,
    category: 'General',
    tags: [],
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second hardcoded task',
    priority: 'Medium',
    completed: false,
    category: 'Work',
    tags: ['office'],
  },
  {
    id: 3,
    title: 'Task Three',
    description: 'Third hardcoded task',
    priority: 'Low',
    completed: false,
    category: 'Personal',
    tags: ['home'],
  },
]

function TaskList(
  props: TaskListProps,
) {
  const taskList =
    props.tasks ?? HARDCODED_TASKS

  return (
    <>
      {props.countText && (
        <div id="task-count">
          {props.countText}
        </div>
      )}

      <section id="task-list">
        {taskList.map((task) => (
          <TaskCard
            key={task.id}
            taskId={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            category={task.category}
            tags={task.tags}
            dueDate={task.dueDate}
            completed={task.completed}
            onToggle={props.onToggle}
            onDelete={props.onDelete}
            onUpdateTask={props.onUpdateTask}
            isEditing={
              props.editingId === task.id
            }
            setEditingId={
              props.setEditingId
            }
            linkToTaskDetail={
              props.linkToTaskDetail
            }
          />
        ))}
      </section>
    </>
  )
}

export default React.memo(TaskList)