import { DomainError } from './DomainError'

export const assertArgumentLength = (value: string, min: number, max: number, message: string = 'Must not be empty!'): void => {
  const length = value.trim().length
  if (length < min || length > max) throw new DomainError(message)
}

export const assertArgumentMin = (value: number, min: number, message?: string): void => {
  if (value < min) throw new DomainError(message ?? `Should be greater than ${min}`)
}

export const assertArgumentUnionType = (value: string, types: string[], message?: string): void => {
  if (!types.includes(value)) throw new DomainError(message ?? `Value must be part of ${JSON.stringify(types)}`)
}
