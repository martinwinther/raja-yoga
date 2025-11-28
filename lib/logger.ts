/**
 * Structured Logger Utility
 * 
 * Provides consistent, contextual logging across the application.
 * - Development: Full console output with colors and grouping
 * - Production: Minimal logging (errors/warnings only)
 * - Extensible: Can add remote logging later without code changes
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const parts = [`[${this.context}]`, message];
    if (context && Object.keys(context).length > 0) {
      parts.push(JSON.stringify(context));
    }
    return parts.join(" ");
  }

  private shouldLog(level: LogLevel): boolean {
    // In development, log everything
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    // In production, only log warnings and errors
    return level === "warn" || level === "error";
  }

  private log(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ) {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, context);
    const logContext = context || {};

    // Add error details to context if present
    if (error instanceof Error) {
      logContext.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error !== undefined) {
      logContext.error = String(error);
    }

    // Use appropriate console method
    switch (level) {
      case "error":
        console.error(formattedMessage, error || "", logContext);
        break;
      case "warn":
        console.warn(formattedMessage, error || "", logContext);
        break;
      case "info":
        console.info(formattedMessage, logContext);
        break;
      case "debug":
        console.debug(formattedMessage, logContext);
        break;
    }

    // Future: Add remote logging here (e.g., send to logging service)
    // if (process.env.NODE_ENV === "production" && level === "error") {
    //   sendToLoggingService({ level, message, context: logContext, timestamp: new Date() });
    // }
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, undefined, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, undefined, context);
  }

  warn(message: string, error?: Error | unknown, context?: LogContext) {
    this.log("warn", message, error, context);
  }

  error(message: string, error: Error | unknown, context?: LogContext) {
    this.log("error", message, error, context);
  }
}

/**
 * Create a logger instance for a specific context
 * @param context - The context name (e.g., "Auth", "Progress", "API")
 * @returns Logger instance
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Server-side logger for API routes
 * Provides structured logging for Next.js API routes
 */
export function createServerLogger(contextName: string) {
  return {
    warn: (message: string, error?: unknown, logContext?: LogContext) => {
      const formatted = `[${contextName}] ${message}`;
      if (process.env.NODE_ENV === "development") {
        console.warn(formatted, error || "", logContext || "");
      } else {
        // In production, you could send to a logging service here
        console.warn(formatted, error || "", logContext || "");
      }
    },
    error: (message: string, error?: unknown, logContext?: LogContext) => {
      const formatted = `[${contextName}] ${message}`;
      console.error(formatted, error || "", logContext || "");
      // In production, you could send to a logging service here
    },
    log: (message: string, logContext?: LogContext) => {
      const formatted = `[${contextName}] ${message}`;
      if (process.env.NODE_ENV === "development") {
        console.log(formatted, logContext || "");
      }
    },
    info: (message: string, logContext?: LogContext) => {
      const formatted = `[${contextName}] ${message}`;
      if (process.env.NODE_ENV === "development") {
        console.info(formatted, logContext || "");
      }
    },
  };
}

