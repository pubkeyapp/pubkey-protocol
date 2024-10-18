import { slugify } from './slugify'

describe('slugify', () => {
  it('should convert string to lowercase', () => {
    expect(slugify('TEST')).toBe('test')
  })

  it('should replace spaces with underscores', () => {
    expect(slugify('hello world')).toBe('hello_world')
  })

  it('should replace special characters with underscores', () => {
    expect(slugify('Hello@World!')).toBe('hello_world_')
  })

  it('should trim the slug to a maximum of 20 characters', () => {
    const longString = 'this_is_a_very_long_string_that_needs_to_be_trimmed'
    expect(slugify(longString)).toBe('this_is_a_very_long_')
  })

  it('should throw an error if the slug is less than 3 characters long', () => {
    expect(() => slugify('a')).toThrow('Slug must be at least 3 characters long')
    expect(() => slugify('ab')).toThrow('Slug must be at least 3 characters long')
    expect(() => slugify('')).toThrow('Slug must be at least 3 characters long')
  })

  it('should handle strings that are exactly 20 characters without trimming', () => {
    const exactly20Chars = 'this_is_20_chars!!'
    expect(slugify(exactly20Chars)).toBe('this_is_20_chars__')
  })
})
