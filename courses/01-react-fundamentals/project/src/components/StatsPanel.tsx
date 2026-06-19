import { useMemo } from 'react'

interface StatsPanelProps {
  total: number
  completed: number
  active: number
  overdue: number
}

export default function StatsPanel({
  total,
  completed,
  active,
  overdue,
}: StatsPanelProps) {
  const percentage = useMemo(() => {
    return total === 0
      ? 0
      : Math.round(
          (completed / total) * 100,
        )
  }, [total, completed])

  return (
    <div id="stats-panel">
      <h2>Statistics</h2>

      <p>Total: {total}</p>

      <p>Completed: {completed}</p>

      <p>Active: {active}</p>

      <p>Overdue: {overdue}</p>

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {percentage}%
      </div>
    </div>
  )
}