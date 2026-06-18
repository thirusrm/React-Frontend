import { useState } from 'react'

interface TaskCardProps {
  id?: string | number
  taskId?: string | number
  title: string
  description: string
  priority: string
  category?: string
  tags?: string[]
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onUpdateTask?: (
    id: string | number,
    updates: {
      title: string
      description: string
      priority: string
    },
  ) => void
  isEditing?: boolean
  setEditingId?: (
    id: string | number | null,
  ) => void
}

export default function TaskCard({
  id,
  taskId,
  title,
  description,
  priority,
  category,
  tags,
  completed = false,
  onToggle,
  onDelete,
  onUpdateTask,
  isEditing,
  setEditingId,
}: TaskCardProps) {
  const currentId = taskId ?? id

  const [editTitle, setEditTitle] =
    useState(title)

  const [
    editDescription,
    setEditDescription,
  ] = useState(description)

  const [
    editPriority,
    setEditPriority,
  ] = useState(priority)

  const handleDelete = () => {
    if (
      onDelete &&
      currentId !== undefined &&
      window.confirm('Are you sure?')
    ) {
      onDelete(currentId)
    }
  }

  const handleSave = () => {
    if (
      !editTitle.trim() ||
      !onUpdateTask ||
      currentId === undefined
    ) {
      return
    }

    onUpdateTask(currentId, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    })

    setEditingId?.(null)
  }

  const handleCancel = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setEditingId?.(null)
  }

  if (isEditing) {
    return (
      <article id="task-card">
        <input
          value={editTitle}
          onChange={(event) =>
            setEditTitle(
              event.target.value,
            )
          }
        />

        <textarea
          value={editDescription}
          onChange={(event) =>
            setEditDescription(
              event.target.value,
            )
          }
        />

        <select
          value={editPriority}
          onChange={(event) =>
            setEditPriority(
              event.target.value,
            )
          }
        >
          <option value="Low">
            Low
          </option>
          <option value="Medium">
            Medium
          </option>
          <option value="High">
            High
          </option>
        </select>

        <button onClick={handleSave}>
          Save
        </button>

        <button onClick={handleCancel}>
          Cancel
        </button>
      </article>
    )
  }

  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        backgroundColor: completed
          ? '#f0f0f0'
          : 'white',
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() =>
            onToggle(currentId ?? 0)
          }
        />
      )}

      <h2
        style={{
          textDecoration: completed
            ? 'line-through'
            : 'none',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed
            ? 'line-through'
            : 'none',
        }}
      >
        {description}
      </p>

      <p>Priority: {priority}</p>

      <p id="task-category">
        Category:{' '}
        {category ?? 'General'}
      </p>

      <div id="task-tags">
        {(tags ?? []).map((tag) => (
          <span
            key={tag}
            data-tag="true"
            style={{
              marginRight: '4px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {onUpdateTask && (
        <button
          onClick={() =>
            setEditingId?.(
              currentId ?? null,
            )
          }
        >
          Edit
        </button>
      )}

      {onDelete && (
        <button onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}