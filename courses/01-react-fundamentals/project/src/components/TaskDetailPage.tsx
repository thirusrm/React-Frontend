import {
  useNavigate,
  useParams,
} from 'react-router-dom'
import type { Task } from './TaskList'

export default function TaskDetailPage() {
  const { id } = useParams()

  const navigate =
    useNavigate()

  const stored =
    localStorage.getItem(
      'task-app-tasks'
    )

  const tasks: Task[] = stored
    ? JSON.parse(stored)
    : []

  const task = tasks.find(
    (t) => String(t.id) === id
  )

  if (!task) {
    return (
      <div id="task-detail-page">
        <h2>Task not found</h2>

        <button
          id="task-detail-back"
          onClick={() =>
            navigate(
              '/challenge/21-react-router'
            )
          }
        >
          Back to list
        </button>
      </div>
    )
  }

  return (
    <div id="task-detail-page">
      <h1>{task.title}</h1>

      <p>
        {task.description}
      </p>

      <p>
        Priority:
        {' '}
        {task.priority}
      </p>

      <button
        id="task-detail-back"
        onClick={() =>
          navigate(
            '/challenge/21-react-router'
          )
        }
      >
        Back to list
      </button>
    </div>
  )
}