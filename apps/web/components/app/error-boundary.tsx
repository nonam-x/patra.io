"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Patra frontend application:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex items-center justify-center p-6 font-sans select-none">
          <div className="max-w-md w-full border border-[#27272A] rounded-2xl bg-[#111111] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500" />
            
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={20} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Application Runtime Error
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                An unexpected crash occurred in the interface. Don't worry, your progress and form configurations are safely stored on the server.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 rounded-lg bg-black/40 border border-[#27272A] text-left">
                  <div className="text-[10px] font-mono text-red-300 font-bold truncate">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-white hover:bg-white/90 text-black text-xs font-bold px-5 h-9 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-[0.98]"
              >
                <RefreshCw size={12} className="animate-spin-slow" />
                <span>Reload Application</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
