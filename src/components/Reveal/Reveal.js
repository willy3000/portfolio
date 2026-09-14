import React, { useEffect, useRef } from 'react';

// Fades content in as it enters the viewport. Content is visible in the
// server-rendered HTML; it is only hidden once JavaScript is running, and only
// while it is still below the fold, so a script failure can never blank the page.
const Reveal = ({ as: Tag = 'div', delay = 0, style, children, ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    if (el.getBoundingClientRect().top < window.innerHeight) return undefined;

    el.dataset.reveal = 'hidden';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = 'shown';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.dataset.reveal = '';
    };
  }, []);

  return (
    <Tag ref={ref} data-reveal="" style={{ '--reveal-delay': `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;
