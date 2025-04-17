import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook to handle expandable text with "Show more"/"Show less" functionality
 * @returns Object containing state and functions to manage expandable text
 */
export default function useExpandableText<T extends HTMLElement>() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<T>(null);

  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current;
      if (element) {
        // Check if the content is overflowing by comparing scrollHeight to clientHeight
        const isTextOverflowing = element.scrollHeight > element.clientHeight;
        setIsOverflowing(isTextOverflowing);
      }
    };
    
    checkOverflow();
    
    // Add resize listener to recheck when window resizes
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const toggleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return {
    isExpanded,
    isOverflowing,
    textRef,
    toggleExpand
  };
} 