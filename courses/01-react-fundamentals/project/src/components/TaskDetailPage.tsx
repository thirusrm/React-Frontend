import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import type { Task } from './TaskList'

export default function TaskDetailPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const storedTasks =
    localStorage.getItem(
      'task-app-tasks',
    )

  const tasks: Task[] =
    storedTasks
      ? JSON.parse(storedTasks)
      : []

  const task = tasks.find(
    (item) =>
      String(item.id) === String(id),
  )

  return (
    <div id="task-detail-page">
      <button
        id="task-detail-back"
        onClick={() =>
          navigate(
            '/challenge/21-react-router',
          )
        }
      >
        Back to list
      </button>

      {!task ? (
        <p>Task not found</p>
      ) : (
        <>
          <h1>{task.title}</h1>

          <p>
            {task.description}
          </p>

          <p>
            Priority:{' '}
            {task.priority}
          </p>

          <p>
            Status:{' '}
            {task.completed
              ? 'Completed'
              : 'Active'}
          </p>
        </>
      )}
    </div>
  )
}