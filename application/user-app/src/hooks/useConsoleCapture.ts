import { useState, useEffect, useCallback } from 'react';

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
  stack?: string;
}

export const useConsoleCapture = (maxMessages: number = 100) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  const addMessage = useCallback((type: ConsoleMessage['type'], args: any[]) => {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    const newMessage: ConsoleMessage = {
      id: Date.now() + Math.random().toString(),
      type,
      message,
      timestamp: new Date(),
      stack: type === 'error' && args[0] instanceof Error ? args[0].stack : undefined,
    };

    setMessages(prev => {
      const updated = [newMessage, ...prev];
      return updated.slice(0, maxMessages);
    });
  }, [maxMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      addMessage('log', args);
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      addMessage('error', args);
    };

    console.warn = (...args) => {
      originalConsole.warn(...args);
      addMessage('warn', args);
    };

    console.info = (...args) => {
      originalConsole.info(...args);
      addMessage('info', args);
    };

    const handleError = (event: ErrorEvent) => {
      addMessage('error', [`${event.error?.name || 'Error'}: ${event.message}`, event.error]);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addMessage('error', ['Unhandled Promise Rejection:', event.reason]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addMessage]);

  return {
    messages,
    clearMessages,
  };
}; 