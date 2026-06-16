interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  sortOrder: string
  onFilterChange: (
    filter: 'all' | 'active' | 'completed',
  ) => void
  onSortChange: (sort: string) => void
}

export default function FilterBar({
  filter,
  sortOrder,
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        data-active={filter === 'all'}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>

      <button
        data-active={filter === 'active'}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>

      <button
        data-active={filter === 'completed'}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(event) =>
          onSortChange(event.target.value)
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="priority-high">
          Priority: High to Low
        </option>

        <option value="priority-low">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>
      </select>
    </div>
  )
}