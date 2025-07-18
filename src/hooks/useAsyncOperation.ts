/**
 * Hook for managing async operations with loading states, error handling, and retry logic
 */

import { useState, useCallback, useRef } from 'react'
import { retryOperation, RetryOptions } from '@/lib/retry-logic'
import { useNotificationHelpers } from '@/components/NotificationSystem'

export interface AsyncOperationState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  lastUpdated: Date | null
}

export interface UseAsyncOperationOptions<T> extends RetryOptions {
  initialData?: T
  showSuccessNotification?: boolean
  showErrorNotification?: boolean
  successMessage?: string
  errorMessage?: string
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
) {
  const {
    initialData = null,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage,
    errorMessage,
    onSuccess,
    onError,
    ...retryOptions
  } = options

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: initialData,
    loading: false,
    error: null,
    lastUpdated: null
  })

  const { showSuccess, showError } = useNotificationHelpers()
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (): Promise<T | null> => {
    // Cancel any ongoing operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()
    const currentController = abortControllerRef.current

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }))

    try {
      const result = await retryOperation(
        async () => {
          // Check if operation was cancelled
          if (currentController.signal.aborted) {
            throw new Error('Operation cancelled')
          }
          return await operation()
        },
        {
          ...retryOptions,
          onRetry: (attempt, error) => {
            console.warn(`Retrying operation (attempt ${attempt}):`, error.message)
            retryOptions.onRetry?.(attempt, error)
          }
        }
      )

      if (result.success && result.data !== undefined) {
        setState({
          data: result.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        })

        onSuccess?.(result.data)

        if (showSuccessNotification) {
          showSuccess(
            'Operation Successful',
            successMessage || 'Operation completed successfully'
          )
        }

        return result.data
      } else {
        throw result.error || new Error('Operation failed')
      }
    } catch (error) {
      const errorObj = error as Error

      // Don't update state if operation was cancelled
      if (errorObj.message === 'Operation cancelled') {
        return null
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }))

      onError?.(errorObj)

      if (showErrorNotification) {
        showError(
          'Operation Failed',
          errorMessage || errorObj.message || 'An unexpected error occurred',
          {
            actions: [
              {
                label: 'Retry',
                action: () => execute(),
                variant: 'primary'
              }
            ]
          }
        )
      }

      return null
    }
  }, [operation, retryOptions, onSuccess, onError, showSuccessNotification, showErrorNotification, successMessage, errorMessage, showSuccess, showError])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setState(prev => ({
        ...prev,
        loading: false
      }))
    }
  }, [])

  const reset = useCallback(() => {
    cancel()
    setState({
      data: initialData,
      loading: false,
      error: null,
      lastUpdated: null
    })
  }, [cancel, initialData])

  return {
    ...state,
    execute,
    cancel,
    reset,
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data
  }
}

// Specialized hook for email operations
export function useEmailOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  options: Omit<UseAsyncOperationOptions<T>, 'successMessage' | 'errorMessage'> = {}
) {
  return useAsyncOperation(operation, {
    ...options,
    successMessage: `${operationName} completed successfully`,
    errorMessage: `Failed to ${operationName.toLowerCase()}`,
    showSuccessNotification: true,
    showErrorNotification: true,
    maxAttempts: 3,
    baseDelay: 1000,
    retryCondition: (error) => {
      // Retry on network errors but not on validation errors
      const message = error.message.toLowerCase()
      return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('connection') ||
        message.includes('server error')
      )
    }
  })
}

// Hook for managing multiple async operations
export function useAsyncOperations<T extends Record<string, any>>(
  operations: { [K in keyof T]: () => Promise<T[K]> },
  options: UseAsyncOperationOptions<T[keyof T]> = {}
) {
  const [states, setStates] = useState<{ [K in keyof T]: AsyncOperationState<T[K]> }>(() => {
    const initialStates = {} as { [K in keyof T]: AsyncOperationState<T[K]> }
    Object.keys(operations).forEach(key => {
      initialStates[key as keyof T] = {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null
      }
    })
    return initialStates
  })

  const execute = useCallback(async (operationKey: keyof T): Promise<T[keyof T] | null> => {
    const operation = operations[operationKey]
    if (!operation) {
      throw new Error(`Operation ${String(operationKey)} not found`)
    }

    setStates(prev => ({
      ...prev,
      [operationKey]: {
        ...prev[operationKey],
        loading: true,
        error: null
      }
    }))

    try {
      const result = await retryOperation(operation, options)

      if (result.success && result.data !== undefined) {
        setStates(prev => ({
          ...prev,
          [operationKey]: {
            data: result.data!,
            loading: false,
            error: null,
            lastUpdated: new Date()
          }
        }))

        return result.data!
      } else {
        throw result.error || new Error('Operation failed')
      }
    } catch (error) {
      const errorObj = error as Error

      setStates(prev => ({
        ...prev,
        [operationKey]: {
          ...prev[operationKey],
          loading: false,
          error: errorObj
        }
      }))

      throw errorObj
    }
  }, [operations, options])

  const executeAll = useCallback(async (): Promise<Partial<T>> => {
    const results: Partial<T> = {}
    const promises = Object.keys(operations).map(async (key) => {
      try {
        const result = await execute(key as keyof T)
        if (result !== null) {
          results[key as keyof T] = result
        }
      } catch (error) {
        console.error(`Operation ${key} failed:`, error)
      }
    })

    await Promise.all(promises)
    return results
  }, [execute])

  const isAnyLoading = Object.values(states).some(state => state.loading)
  const hasAnyError = Object.values(states).some(state => !!state.error)
  const allHaveData = Object.values(states).every(state => !!state.data)

  return {
    states,
    execute,
    executeAll,
    isAnyLoading,
    hasAnyError,
    allHaveData
  }
}