import React from "react";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = { hasError: false, error: null };
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-destructive/5 border border-destructive/20 rounded-[2.5rem] p-10 text-center space-y-6">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Oops! Something went wrong</h2>
              <p className="text-muted-foreground text-sm">
                We encountered an unexpected error. This might be due to a connection issue or a temporary glitch.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl text-left overflow-auto max-h-32">
                <code className="text-xs text-destructive font-mono">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <Button 
              className="w-full rounded-2xl h-12 gap-2" 
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-4 w-4" /> Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
