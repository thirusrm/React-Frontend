import { useState } from 'react'
import type { Task } from './TaskList'

interface TaskFormProps {
  onAddTask?: (task: Task) => void
}

export default function TaskForm({
  onAddTask,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')
  const [priority, setPriority] =
    useState('Medium')
  const [category, setCategory] =
    useState('General')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setError('')

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      category,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    onAddTask?.(newTask)

    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('General')
    setTags('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
        />
      </div>

      <div>
        <label htmlFor="task-priority">
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">
            Medium
          </option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-category-input">
          Category
        </label>
        <select
          id="task-category-input"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          <option value="General">
            General
          </option>
          <option value="Work">
            Work
          </option>
          <option value="Personal">
            Personal
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="task-tags">
          Tags
        </label>
        <input
          id="task-tags"
          type="text"
          placeholder="react, frontend"
          value={tags}
          onChange={(event) =>
            setTags(event.target.value)
          }
        />
      </div>

      {error && (
        <div id="task-form-error">
          {error}
        </div>
      )}

      <button type="submit">
        Add Task
      </button>
    </form>
  )
}