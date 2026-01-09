/**
 * SelectionManager.jsx
 * Logic-only component for global selection handling
 * Manages keyboard shortcuts for canvas interaction
 */

import { useEffect } from 'react';
import { useSelection } from '../context/SelectionContext';

const SelectionManager = () => {
  const { clearSelection } = useSelection();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [clearSelection]);

  return null; // This is a logic-only component
};

export default SelectionManager;
