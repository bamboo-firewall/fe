import React, { ReactNode, ErrorInfo } from 'react';
import FallBackUI from './FallBackUI';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { error };
  }

  constructor(props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo });
  }

  render() {
    // Check if the error is thrown then render fallback
    if (this.state.error) {
      return <FallBackUI error={this.state.error} setError={() => this.setState({ error: null })} />;
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
