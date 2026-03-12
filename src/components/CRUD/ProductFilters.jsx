import React, { useState,  useCallback, useMemo } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ 
  filters, 
  sort, 
  onApplyFilters, 
  onApplySort, 
  onResetFilters 
}) => {
  
  // ✅ FIX 1: Use useMemo to derive initial values instead of useEffect + setState
  const initialFilters = useMemo(() => ({
    name: filters?.name || '',
    fromDate: filters?.fromDate || '',
    toDate: filters?.toDate || '',
    inStock: filters?.inStock || ''
  }), [filters]);
  
  const initialSort = useMemo(() => ({
    field: sort?.field || 'createdAt',
    order: sort?.order || 'desc'
  }), [sort]);

  // ✅ FIX 2: Initialize state with memoized values
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [localSort, setLocalSort] = useState(initialSort);
  const [expanded, setExpanded] = useState(true);

  // ✅ FIX 3: No need for useEffect - values are already in state
  // The initial state is set correctly with useMemo values

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSortChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalSort(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    // Clean filters - remove empty values
    const cleanedFilters = {};
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        cleanedFilters[key] = value.toString().trim();
      }
    });
    
    onApplyFilters(cleanedFilters);
  }, [localFilters, onApplyFilters]);

  const handleApplySort = useCallback(() => {
    onApplySort(localSort);
  }, [localSort, onApplySort]);

  const handleReset = useCallback(() => {
    setLocalFilters({
      name: '',
      fromDate: '',
      toDate: '',
      inStock: ''
    });
    setLocalSort({
      field: 'createdAt',
      order: 'desc'
    });
    onResetFilters();
  }, [onResetFilters]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  }, [handleApplyFilters]);

  const handleRemoveFilter = useCallback((filterName) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: ''
    }));
    // Auto-apply after removal
    setTimeout(() => {
      const cleanedFilters = {};
      Object.entries({ ...localFilters, [filterName]: '' }).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          cleanedFilters[key] = value.toString().trim();
        }
      });
      onApplyFilters(cleanedFilters);
    }, 0);
  }, [localFilters, onApplyFilters]);

  // ✅ FIX 4: Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(localFilters).some(value => 
      value && value.toString().trim() !== ''
    );
  }, [localFilters]);

  return (
    <div className="product-filters-container">
      <div className="filters-header" onClick={() => setExpanded(!expanded)}>
        <h3>🔍 Filter & Sort Products</h3>
        <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
      </div>

      {expanded && (
        <>
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-grid">
              {/* Product Name Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">🏷️</span>
                  Product Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={localFilters.name}
                  onChange={handleFilterChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name..."
                  className="filter-input"
                />
              </div>

              {/* From Date Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">📅</span>
                  From Date:
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={localFilters.fromDate}
                  onChange={handleFilterChange}
                  className="filter-input"
                  max={localFilters.toDate || undefined}
                />
              </div>

              {/* To Date Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">📅</span>
                  To Date:
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={localFilters.toDate}
                  onChange={handleFilterChange}
                  className="filter-input"
                  min={localFilters.fromDate || undefined}
                />
              </div>

              {/* Stock Status Filter */}
              <div className="filter-group">
                <label>
                  <span className="filter-icon">📦</span>
                  Stock Status:
                </label>
                <select
                  name="inStock"
                  value={localFilters.inStock}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All</option>
                  <option value="true">✅ In Stock</option>
                  <option value="false">❌ Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="filter-actions">
              <button onClick={handleApplyFilters} className="btn btn-primary">
                Apply Filters
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset All
              </button>
            </div>
          </div>

          {/* Sort Section */}
          <div className="sort-section">
            <h4>Sort Products</h4>
            <div className="sort-grid">
              <div className="sort-group">
                <label>Sort By:</label>
                <select
                  name="field"
                  value={localSort.field}
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="createdAt">📅 Date Added</option>
                  <option value="name">🏷️ Name</option>
                  <option value="price">💰 Price</option>
                  <option value="stock">📦 Stock</option>
                </select>
              </div>

              <div className="sort-group">
                <label>Order:</label>
                <select
                  name="order"
                  value={localSort.order}
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="asc">⬆️ Ascending</option>
                  <option value="desc">⬇️ Descending</option>
                </select>
              </div>

              <button onClick={handleApplySort} className="btn btn-primary">
                Apply Sort
              </button>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="active-filters">
              <span className="active-filters-label">Active filters:</span>
              {localFilters.name && (
                <span className="filter-tag">
                  Name: {localFilters.name}
                  <button onClick={() => handleRemoveFilter('name')}>✕</button>
                </span>
              )}
              {localFilters.fromDate && (
                <span className="filter-tag">
                  From: {new Date(localFilters.fromDate).toLocaleDateString()}
                  <button onClick={() => handleRemoveFilter('fromDate')}>✕</button>
                </span>
              )}
              {localFilters.toDate && (
                <span className="filter-tag">
                  To: {new Date(localFilters.toDate).toLocaleDateString()}
                  <button onClick={() => handleRemoveFilter('toDate')}>✕</button>
                </span>
              )}
              {localFilters.inStock && (
                <span className="filter-tag">
                  Stock: {localFilters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}
                  <button onClick={() => handleRemoveFilter('inStock')}>✕</button>
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductFilters;