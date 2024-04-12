import { MultiSelect, MultiSelectProps, Select, SelectProps } from '@mantine/core'

export function UiMultiSelectEnum<T>({
  values,
  setValues,
  options,
  ...props
}: MultiSelectProps & {
  values: T[] | undefined
  setValues: (values: T[] | undefined) => void
  options: { value: string; label: string }[]
}) {
  return (
    <MultiSelect
      value={values?.map((v) => `${v}`) ?? []}
      onChange={(values) => setValues(values.map((v) => v as T))}
      data={options}
      {...props}
    />
  )
}

export function UiSelectEnum<T>({
  value,
  setValue,
  options,
  ...props
}: SelectProps & {
  value: T | undefined
  setValue: (value: T | undefined) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select
      value={value?.toString() ?? ''}
      onChange={(value) => setValue(value === '' ? undefined : (value as T))}
      data={options}
      {...props}
    />
  )
}

export function getEnumOptions<T extends Record<string, string>>(
  enumObject: T,
): { label: string; value: T[keyof T] }[] {
  return Object.keys(enumObject).map((key: string) => ({
    label: key,
    value: enumObject[key as keyof T],
  }))
}
