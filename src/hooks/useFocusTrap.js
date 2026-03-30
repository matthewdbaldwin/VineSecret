import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus inside a container while active.
 * Returns a ref to attach to the container element.
 *
 * @param {boolean} active   Whether the trap is currently enabled
 * @param {object}  options
 * @param {boolean} options.autoFocus  Auto-focus first focusable element on activation (default true)
 */
export function useFocusTrap(active = true, { autoFocus = true } = {}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!active || !containerRef.current) return;

        const container = containerRef.current;
        const getFocusable = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS));

        if (autoFocus) {
            const first = getFocusable()[0];
            first?.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;
            const focusable = getFocusable();
            if (focusable.length === 0) { e.preventDefault(); return; }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [active, autoFocus]);

    return containerRef;
}
