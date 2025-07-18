/**
 * Retry logic utilities for handling failed operations
 * Provides exponential backoff and configurable retry strategies
 */

export interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  retryCondition?: (error: Error) => boolean
  onRetry?: (attempt: number, error: Error) => void
}

export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: Error
  attempts: number
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true,
    onRetry
  } = options

  let lastError: Error
  let attempts = 0

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    attempts = attempt
    
    try {
      const result = await operation()
      return {
        success: true,
        data: result,
        attempts
      }
    } catch (error) {
      lastError = error as Error
      
      // Check if we should retry this error
      if (!retryCondition(lastError)) {
        break
      }
      
      // Don't delay after the last attempt
      if (attempt < maxAttempts) {
        const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay)
        
        // Call retry callback if provided
        onRetry?.(attempt, lastError)
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  return {
    success: false,
    error: lastError!,
    attempts
  }
}

/**
 * Retry condition functions for common scenarios
 */
export const retryConditions = {
  // Retry on network errors but not on client errors (4xx)
  networkErrors: (error: Error): boolean => {
    const message = error.message.toLowerCase()
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('fetch')
    )
  },

  // Retry on server errors (5xx) but not client errors (4xx)
  serverErrors: (error: Error): boolean => {
    const message = error.message.toLowerCase()
    return (
      message.includes('server error') ||
      message.includes('internal server error') ||
      message.includes('service unavailable') ||
      message.includes('gateway timeout')
    )
  },

  // Retry on any error except validation errors
  nonValidationErrors: (error: Error): boolean => {
    const message = error.message.toLowerCase()
    return !(
      message.includes('validation') ||
      message.includes('invalid') ||
      message.includes('required') ||
      message.includes('format')
    )
  },

  // Always retry (default behavior)
  always: (): boolean => true,

  // Never retry
  never: (): boolean => false
}

/**
 * Create a retry wrapper for email service operations
 */
export function createEmailServiceRetry(options: RetryOptions = {}) {
  const defaultOptions: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2,
    retryCondition: retryConditions.networkErrors,
    ...options
  }

  return async function retryEmailOperation<T>(
    operation: () => Promise<T>,
    operationName: string = 'email operation'
  ): Promise<T> {
    const result = await retryOperation(operation, {
      ...defaultOptions,
      onRetry: (attempt, error) => {
        console.warn(`Retrying ${operationName} (attempt ${attempt}):`, error.message)
        defaultOptions.onRetry?.(attempt, error)
      }
    })

    if (result.success) {
      return result.data!
    } else {
      throw new Error(`${operationName} failed after ${result.attempts} attempts: ${result.error?.message}`)
    }
  }
}

/**
 * Exponential backoff delay calculator
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 10000,
  backoffFactor: number = 2,
  jitter: boolean = true
): number {
  const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay)
  
  // Add jitter to prevent thundering herd
  if (jitter) {
    return delay + Math.random() * 1000
  }
  
  return delay
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open - operation not allowed')
      }
    }

    try {
      const result = await operation()
      
      // Reset on success
      if (this.state === 'half-open') {
        this.state = 'closed'
        this.failures = 0
      }
      
      return result
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()
      
      if (this.failures >= this.failureThreshold) {
        this.state = 'open'
      }
      
      throw error
    }
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state
  }

  reset(): void {
    this.failures = 0
    this.lastFailureTime = 0
    this.state = 'closed'
  }
}

/**
 * Timeout wrapper for operations
 */
export function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    operation(),
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })
  ])
}

/**
 * Batch retry operations with concurrency control
 */
export async function retryBatch<T>(
  operations: (() => Promise<T>)[],
  options: RetryOptions & { concurrency?: number } = {}
): Promise<RetryResult<T>[]> {
  const { concurrency = 3, ...retryOptions } = options
  const results: RetryResult<T>[] = []
  
  // Process operations in batches
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency)
    const batchPromises = batch.map(operation => 
      retryOperation(operation, retryOptions)
    )
    
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }
  
  return results
}