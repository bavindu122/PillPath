import { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';

/**
 * Custom hook for managing click outside behavior
 * @param {Array<RefObject>} refs - Array of refs to check against
 * @param {Function} handler - Callback when click occurs outside
 */
const useClickOutside = (refs, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all provided refs
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (isOutside) {
        handler();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [refs, handler]);
};

export default useClickOutside;
