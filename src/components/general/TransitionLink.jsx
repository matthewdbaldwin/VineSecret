import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

export const TransitionLink = ({ to, onClick, children, ...rest }) => {
    const navigate = useNavigate();

    const handleClick = useCallback((event) => {
        if (onClick) onClick(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (typeof to !== 'string' || /^https?:/.test(to)) return;
        if (typeof document === 'undefined' || !document.startViewTransition) return;

        event.preventDefault();
        document.startViewTransition(() => {
            flushSync(() => navigate(to));
        });
    }, [navigate, to, onClick]);

    return (
        <Link to={to} {...rest} onClick={handleClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;
