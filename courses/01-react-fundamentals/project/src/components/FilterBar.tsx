interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  sortOrder?: string
  searchText?: string
  categories?: string[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  onFilterChange?: (
    filter: 'all' | 'active' | 'completed',
  ) => void
  onSortChange?: (sort: string) => void
  onSearchChange?: (search: string) => void
  onClearSearch?: () => void
}

export default function FilterBar({
  filter,
  sortOrder = 'recent',
  searchText = '',
  categories = [],
  selectedCategory = 'all',
  onCategoryChange = () => {},
  onFilterChange = () => {},
  onSortChange = () => {},
  onSearchChange = () => {},
  onClearSearch = () => {},
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

      <input
        id="search-input"
        type="text"
        value={searchText}
        placeholder="Search tasks..."
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      {searchText.trim() && (
        <button
          id="clear-search"
          onClick={onClearSearch}
        >
          Clear search
        </button>
      )}

      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
      >
        {categories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category === 'all'
              ? 'All categories'
              : category}
          </option>
        ))}
      </select>

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

        <option value="due-date">
          Due Date (Soonest First)
        </option>
      </select>
    </div>
  )
}