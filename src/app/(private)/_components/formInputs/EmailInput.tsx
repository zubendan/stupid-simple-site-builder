import { TagsInput, TagsInputProps } from '@mantine/core';
import { KeyboardEventHandler } from 'react';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

export type EmailInputProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<TagsInputProps, 'value' | 'defaultValue'> & { onSubmit?: () => void };

export const EmailInput = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  onChange,
  onSubmit,
  ...props
}: EmailInputProps<T>) => {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (
      e.key === 'Enter' &&
      !e.currentTarget.value &&
      typeof onSubmit === 'function'
    ) {
      onSubmit(e);
    }
  };

  const {
    field: { value, onChange: fieldOnChange, ...field },
    fieldState,
  } = useController<T>({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
  });
  return (
    <TagsInput
      value={value}
      onKeyDown={handleKeyDown}
      autoFocus={true}
      label='Recipients'
      onChange={(e) => {
        fieldOnChange(e);
        onChange?.(e);
      }}
      placeholder='Paste a list of emails or type them manually and press Enter to add'
      splitChars={[',', ' ']}
      clearable
      error={fieldState.error?.message}
      {...field}
      {...props}
    />
  );
};
