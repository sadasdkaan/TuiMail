import {
  retryOperation,
  retryConditions,
  createEmailServiceRetry,
  calculateBackoffDelay,
  CircuitBreaker,
  withTimeout,
  retryBatch
} from '../retry-logic'

describe('retryOperation', () => {
  it('succeeds on first attempt', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success')
    
    const result = await retryOperation(mockOperation)
    
    expect(result.success).toBe(true)
    expect(result.data).toBe('success')
    expect(result.attempts).toBe(1)
    expect(mockOperation).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and eventually succeeds', async () => {
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success')
    
    const result = await retryOperation(mockOperation, { maxAttempts: 3, baseDelay: 10 })
    
    expect(result.success).toBe(true)
    expect(result.data).toBe('success')
    expect(result.attempts).toBe(2)
    expect(mockOperation).toHaveBeenCalledTimes(2)
  })

  it('fails after max attempts', async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error('Persistent failure'))
    
    const result = await retryOperation(mockOperation, { maxAttempts: 2, baseDelay: 10 })
    
    expect(result.success).toBe(false)
    expect(result.error?.message).toBe('Persistent failure')
    expect(result.attempts).toBe(2)
    expect(mockOperation).toHaveBeenCalledTimes(2)
  })

  it('respects retry condition', async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error('validation error'))
    const retryCondition = (error: Error) => !error.message.includes('validation')
    
    const result = await retryOperation(mockOperation, { 
      maxAttempts: 3, 
      baseDelay: 10,
      retryCondition 
    })
    
    expect(result.success).toBe(false)
    expect(result.attempts).toBe(1)
    expect(mockOperation).toHaveBeenCalledTimes(1)
  })

  it('calls onRetry callback', async () => {
    const mockOperation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success')
    const mockOnRetry = jest.fn()
    
    await retryOperation(mockOperation, { 
      maxAttempts: 3, 
      baseDelay: 10,
      onRetry: mockOnRetry 
    })
    
    expect(mockOnRetry).toHaveBeenCalledWith(1, expect.any(Error))
  })
})

describe('retryConditions', () => {
  it('networkErrors identifies network errors correctly', () => {
    expect(retryConditions.networkErrors(new Error('Network error'))).toBe(true)
    expect(retryConditions.networkErrors(new Error('Connection failed'))).toBe(true)
    expect(retryConditions.networkErrors(new Error('Timeout occurred'))).toBe(true)
    expect(retryConditions.networkErrors(new Error('Validation failed'))).toBe(false)
  })

  it('serverErrors identifies server errors correctly', () => {
    expect(retryConditions.serverErrors(new Error('Internal server error'))).toBe(true)
    expect(retryConditions.serverErrors(new Error('Service unavailable'))).toBe(true)
    expect(retryConditions.serverErrors(new Error('Gateway timeout'))).toBe(true)
    expect(retryConditions.serverErrors(new Error('Bad request'))).toBe(false)
  })

  it('nonValidationErrors excludes validation errors', () => {
    expect(retryConditions.nonValidationErrors(new Error('Network error'))).toBe(true)
    expect(retryConditions.nonValidationErrors(new Error('Validation failed'))).toBe(false)
    expect(retryConditions.nonValidationErrors(new Error('Invalid format'))).toBe(false)
    expect(retryConditions.nonValidationErrors(new Error('Required field'))).toBe(false)
  })

  it('always and never work correctly', () => {
    const error = new Error('Any error')
    expect(retryConditions.always()).toBe(true)
    expect(retryConditions.never()).toBe(false)
  })
})

describe('createEmailServiceRetry', () => {
  it('creates retry wrapper with default options', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success')
    const retryWrapper = createEmailServiceRetry()
    
    const result = await retryWrapper(mockOperation, 'test operation')
    
    expect(result).toBe('success')
    expect(mockOperation).toHaveBeenCalledTimes(1)
  })

  it('throws error after max attempts', async () => {
    const mockOperation = jest.fn().mockRejectedValue(new Error('Network error'))
    const retryWrapper = createEmailServiceRetry({ maxAttempts: 2, baseDelay: 10 })
    
    await expect(retryWrapper(mockOperation, 'test operation')).rejects.toThrow(
      'test operation failed after 2 attempts: Network error'
    )
  })
})

describe('calculateBackoffDelay', () => {
  it('calculates exponential backoff correctly', () => {
    expect(calculateBackoffDelay(1, 1000, 10000, 2, false)).toBe(1000)
    expect(calculateBackoffDelay(2, 1000, 10000, 2, false)).toBe(2000)
    expect(calculateBackoffDelay(3, 1000, 10000, 2, false)).toBe(4000)
  })

  it('respects max delay', () => {
    expect(calculateBackoffDelay(10, 1000, 5000, 2, false)).toBe(5000)
  })

  it('adds jitter when enabled', () => {
    const delay1 = calculateBackoffDelay(1, 1000, 10000, 2, true)
    const delay2 = calculateBackoffDelay(1, 1000, 10000, 2, true)
    
    expect(delay1).toBeGreaterThanOrEqual(1000)
    expect(delay1).toBeLessThanOrEqual(2000)
    // Jitter makes delays different (with high probability)
    expect(delay1).not.toBe(delay2)
  })
})

describe('CircuitBreaker', () => {
  it('allows operations when closed', async () => {
    const circuitBreaker = new CircuitBreaker(3, 1000)
    const mockOperation = jest.fn().mockResolvedValue('success')
    
    const result = await circuitBreaker.execute(mockOperation)
    
    expect(result).toBe('success')
    expect(circuitBreaker.getState()).toBe('closed')
  })

  it('opens after failure threshold', async () => {
    const circuitBreaker = new CircuitBreaker(2, 1000)
    const mockOperation = jest.fn().mockRejectedValue(new Error('Failure'))
    
    // First failure
    await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('Failure')
    expect(circuitBreaker.getState()).toBe('closed')
    
    // Second failure - should open circuit
    await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('Failure')
    expect(circuitBreaker.getState()).toBe('open')
    
    // Third attempt should be blocked
    await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow(
      'Circuit breaker is open - operation not allowed'
    )
  })

  it('transitions to half-open after recovery timeout', async () => {
    const circuitBreaker = new CircuitBreaker(1, 100) // 100ms recovery
    const mockOperation = jest.fn().mockRejectedValue(new Error('Failure'))
    
    // Trigger failure to open circuit
    await expect(circuitBreaker.execute(mockOperation)).rejects.toThrow('Failure')
    expect(circuitBreaker.getState()).toBe('open')
    
    // Wait for recovery timeout
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Next operation should transition to half-open
    mockOperation.mockResolvedValueOnce('success')
    const result = await circuitBreaker.execute(mockOperation)
    
    expect(result).toBe('success')
    expect(circuitBreaker.getState()).toBe('closed')
  })

  it('resets state correctly', () => {
    const circuitBreaker = new CircuitBreaker(1, 1000)
    
    // Manually set to open state
    circuitBreaker['state'] = 'open'
    circuitBreaker['failures'] = 5
    
    circuitBreaker.reset()
    
    expect(circuitBreaker.getState()).toBe('closed')
    expect(circuitBreaker['failures']).toBe(0)
  })
})

describe('withTimeout', () => {
  it('resolves when operation completes within timeout', async () => {
    const mockOperation = jest.fn().mockResolvedValue('success')
    
    const result = await withTimeout(mockOperation, 1000)
    
    expect(result).toBe('success')
  })

  it('rejects when operation exceeds timeout', async () => {
    const mockOperation = jest.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve('success'), 200))
    )
    
    await expect(withTimeout(mockOperation, 100)).rejects.toThrow(
      'Operation timed out after 100ms'
    )
  })
})

describe('retryBatch', () => {
  it('processes operations in batches', async () => {
    const operations = [
      jest.fn().mockResolvedValue('result1'),
      jest.fn().mockResolvedValue('result2'),
      jest.fn().mockResolvedValue('result3')
    ]
    
    const results = await retryBatch(operations, { concurrency: 2, baseDelay: 10 })
    
    expect(results).toHaveLength(3)
    expect(results[0].success).toBe(true)
    expect(results[0].data).toBe('result1')
    expect(results[1].success).toBe(true)
    expect(results[1].data).toBe('result2')
    expect(results[2].success).toBe(true)
    expect(results[2].data).toBe('result3')
  })

  it('handles failures in batch operations', async () => {
    const operations = [
      jest.fn().mockResolvedValue('success'),
      jest.fn().mockRejectedValue(new Error('failure'))
    ]
    
    const results = await retryBatch(operations, { maxAttempts: 1, baseDelay: 10 })
    
    expect(results).toHaveLength(2)
    expect(results[0].success).toBe(true)
    expect(results[1].success).toBe(false)
    expect(results[1].error?.message).toBe('failure')
  })
})