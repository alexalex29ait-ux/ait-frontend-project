// src/utils/sessionStorage.js

// Filter keys
const FILTER_STORAGE_KEY = 'productFilters';
const SORT_STORAGE_KEY = 'productSort';

// Save filters to session storage
export const saveFiltersToSession = (filters) => {
  try {
    // Clean filters - remove empty values
    const cleanFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    });
    
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(cleanFilters));
    console.log("✅ Filters saved to session:", cleanFilters);
  } catch (error) {
    console.error("Error saving filters to session:", error);
  }
};

// Load filters from session storage
export const loadFiltersFromSession = () => {
  try {
    const savedFilters = sessionStorage.getItem(FILTER_STORAGE_KEY);
    if (savedFilters) {
      const parsed = JSON.parse(savedFilters);
      console.log("📂 Filters loaded from session:", parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading filters from session:", error);
    return null;
  }
};

// Save sort to session storage
export const saveSortToSession = (sort) => {
  try {
    sessionStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(sort));
    console.log("✅ Sort saved to session:", sort);
  } catch (error) {
    console.error("Error saving sort to session:", error);
  }
};

// Load sort from session storage
export const loadSortFromSession = () => {
  try {
    const savedSort = sessionStorage.getItem(SORT_STORAGE_KEY);
    if (savedSort) {
      const parsed = JSON.parse(savedSort);
      console.log("📂 Sort loaded from session:", parsed);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading sort from session:", error);
    return null;
  }
};

// Clear all filter data from session
export const clearFilterSession = () => {
  sessionStorage.removeItem(FILTER_STORAGE_KEY);
  sessionStorage.removeItem(SORT_STORAGE_KEY);
  console.log("🗑️ Filter session cleared");
};