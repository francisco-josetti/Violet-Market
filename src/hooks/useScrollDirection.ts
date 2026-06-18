'use client';

import { useEffect, useState } from 'react';

export function useScrollDirection(resetKey?: string) {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setScrollY(0);
    setDirection('up');
    setIsScrolled(false);

    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 64);
      setDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [resetKey]);

  return { direction, scrollY, isScrolled };
}
