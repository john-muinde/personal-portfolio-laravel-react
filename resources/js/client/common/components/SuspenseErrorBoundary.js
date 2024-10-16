import React from "react";
import PropTypes from "prop-types";
import { ErrorBoundaryFallbackUI } from "../../common/components/ErrorBoundaryFallbackUI";

/**
 * SuspenseErrorBoundary component to catch errors
 */
class SuspenseErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Use ErrorBoundaryFallbackUI if no fallback is provided
            return this.props.fallback ? (
                React.cloneElement(this.props.fallback, {
                    error: this.state.error,
                })
            ) : (
                <ErrorBoundaryFallbackUI error={this.state.error} />
            );
        }

        return this.props.children;
    }
}

SuspenseErrorBoundary.propTypes = {
    fallback: PropTypes.node,
    children: PropTypes.node,
};

export default SuspenseErrorBoundary;
