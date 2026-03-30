import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('VineSecret error boundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    background: '#09040d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #dfd5c5',
                        borderRadius: '4px',
                        padding: '3rem',
                        maxWidth: '480px',
                        width: '100%',
                    }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#b8915a', margin: '0 0 0.5rem' }}>
                            Something went wrong
                        </p>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#1a0f14', margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                            We hit an unexpected snag.
                        </h1>
                        <p style={{ color: '#4a3040', fontWeight: 300, lineHeight: 1.7, margin: '0 0 2rem' }}>
                            Something went wrong on this page. Try refreshing — if the problem persists, reach out and we'll sort it out.
                        </p>
                        <div style={{ display: 'flex', gap: '0.65rem' }}>
                            <button
                                className="btn primary"
                                onClick={() => window.location.reload()}
                            >
                                Refresh page
                            </button>
                            <a className="btn brass" href="/">Go home</a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
