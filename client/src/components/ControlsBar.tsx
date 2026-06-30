import { Search } from 'lucide-react';

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
}

export function ControlsBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: ControlsBarProps) {
  return (
    <section className="controls-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search by title, author or genre..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-pills">
        {['All', 'Want to Read', 'Reading', 'Completed'].map((status) => (
          <button
            key={status}
            className={`filter-pill ${statusFilter === status ? 'active' : ''}`}
            onClick={() => onStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="sort-select-wrapper">
        <span className="sort-label">Sort by</span>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="newest">Date Added</option>
          <option value="title">Book Title</option>
          <option value="author">Author Name</option>
          <option value="rating">Highest Rating</option>
          <option value="pages">Book Size</option>
        </select>
      </div>
    </section>
  );
}
