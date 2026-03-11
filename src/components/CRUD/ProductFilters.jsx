
import React, { useState, useEffect } from 'react';
import './ProductFilters.css';

const ProductFilters = ({ 
  filters, 
  sort, 
  onApplyFilters, 
  onApplySort, 
  onResetFilters 
}) => {
  
  const [localFilters, setLocalFilters] = useState({
    name: filters?.name || '',
    fromDate: filters?.fromDate || '',
    toDate: filters?.toDate || '',
    inStock: filters?.inStock || ''
  });
  
  const [localSort, setLocalSort] = useState({
    field: sort?.field || 'createdAt',
    order: sort?.order || 'desc'
  });

  const [expanded, setExpanded] = useState(true);


  useEffect(() => {
    setLocalFilters({
      name: filters?.name || '',
      fromDate: filters?.fromDate || '',
      toDate: filters?.toDate || '',
      inStock: filters?.inStock || ''
    });
  }, [filters]);

  useEffect(() => {
    setLocalSort({
      field: sort?.field || 'createdAt',
      order: sort?.order || 'desc'
    });
  }, [sort]);

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSortChange = (e) => {
    const { name, value } = e.target;
    setLocalSort(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleApplyFilters = () => {
   
    const cleanedFilters = {};
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value.trim && value.trim() !== '') {
        cleanedFilters[key] = value.trim();
      } else if (value && typeof value === 'string' && value !== '') {
        cleanedFilters[key] = value;
      }
    });
    
    onApplyFilters(cleanedFilters);
  };

 
  const handleApplySort = () => {
    onApplySort(localSort);
  };

  
  const handleReset = () => {
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
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="product-filters-container">
      <div className="filters-header" onClick={() => setExpanded(!expanded)}>
        <h3>🔍 Filter & Sort Products</h3>
        <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
      </div>

      {expanded && (
        <>
         
          <div className="filters-section">
            <div className="filters-grid">
             
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
                  <option value="true"> In Stock</option>
                  <option value="false"> Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={handleApplyFilters} className="btn btn-primary">
                Apply Filters
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset All
              </button>
            </div>
          </div>

         
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
                  <option value="createdAt"> Date Added</option>
                  <option value="name"> Name</option>
                  <option value="price"> Price</option>
                  <option value="stock"> Stock</option>
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
                  <option value="asc"> Ascending</option>
                  <option value="desc"> Descending</option>
                </select>
              </div>

              <button onClick={handleApplySort} className="btn btn-primary">
                Apply Sort
              </button>
            </div>
          </div>

      
          {(localFilters.name || localFilters.fromDate || localFilters.toDate || localFilters.inStock) && (
            <div className="active-filters">
              <span className="active-filters-label">Active filters:</span>
              {localFilters.name && (
                <span className="filter-tag">
                  Name: {localFilters.name}
                  <button onClick={() => {
                    setLocalFilters({...localFilters, name: ''});
                    handleApplyFilters();
                  }}>✕</button>
                </span>
              )}
              {localFilters.fromDate && (
                <span className="filter-tag">
                  From: {new Date(localFilters.fromDate).toLocaleDateString()}
                  <button onClick={() => {
                    setLocalFilters({...localFilters, fromDate: ''});
                    handleApplyFilters();
                  }}>✕</button>
                </span>
              )}
              {localFilters.toDate && (
                <span className="filter-tag">
                  To: {new Date(localFilters.toDate).toLocaleDateString()}
                  <button onClick={() => {
                    setLocalFilters({...localFilters, toDate: ''});
                    handleApplyFilters();
                  }}>✕</button>
                </span>
              )}
              {localFilters.inStock && (
                <span className="filter-tag">
                  Stock: {localFilters.inStock === 'true' ? 'In Stock' : 'Out of Stock'}
                  <button onClick={() => {
                    setLocalFilters({...localFilters, inStock: ''});
                    handleApplyFilters();
                  }}>✕</button>
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