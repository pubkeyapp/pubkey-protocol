import { ellipsify } from './ellipsify'

describe('ellipsify', () => {
  it('should return the original string if it is shorter than the limit', () => {
    expect(ellipsify('short')).toBe('short')
  })

  it('should return the ellipsified string if it exceeds the limit', () => {
    expect(ellipsify('This is a longer sentence that needs shortening')).toBe('This..ning')
  })

  it('should use the specified length for ellipsification', () => {
    expect(ellipsify('ellipsification', 2)).toBe('el..on')
    expect(ellipsify('central', 1)).toBe('c..l')
  })

  it('should use the specified delimiter', () => {
    expect(ellipsify('This is really long', 4, '---')).toBe('This---long')
  })

  it('should handle empty strings gracefully', () => {
    expect(ellipsify('')).toBe('')
  })

  it('should correctly handle strings exactly at the limit', () => {
    expect(ellipsify('twelvechars', 4, '....')).toBe('twelvechars')
  })

  it('should return the original string if len multiplied is greater or equal to string length', () => {
    expect(ellipsify('abcd', 2)).toBe('abcd') // Testing boundary
    expect(ellipsify('abc', 2)).toBe('abc') // Testing when len is longer than string
  })
})
