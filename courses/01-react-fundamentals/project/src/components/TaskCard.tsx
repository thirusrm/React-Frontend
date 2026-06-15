interface TaskCardProps {
  id?: string | number
  taskId?: string | number
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
}

export default function TaskCard({
  id,
  taskId,
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const currentId = taskId ?? id

  const handleDelete = () => {
    if (
      onDelete &&
      currentId !== undefined &&
      window.confirm('Are you sure?')
    ) {
      onDelete(currentId)
    }
  }

  return (
    <article
      id="task-card"
      data-completed={completed}
      style={{
        backgroundColor: completed ? '#f0f0f0' : 'white',
      }}
    >
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={() => {
            onToggle(currentId ?? 0)
          }}
        />
      )}

      <h2
        style={{
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          textDecoration: completed ? 'line-through' : 'none',
        }}
      >
        {description}
      </p>

      <p>Priority: {priority}</p>

      {onDelete && (
        <button onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}