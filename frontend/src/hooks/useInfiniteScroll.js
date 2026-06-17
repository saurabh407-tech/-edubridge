import { useEffect, useRef, useCallback } from "react";

// Infinite scroll hook using IntersectionObserver
export const useInfiniteScroll = (callback, hasMore) => {
  const observerRef = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) callback();
      });
      if (node) observerRef.current.observe(node);
    },
    [callback, hasMore]
  );

  return lastElementRef;
};
