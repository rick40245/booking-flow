/**
 * TypeScript type definitions related to form validation.
 * Provides full type support for Element Plus form validation.
 */

import type { FormItemRule } from 'element-plus'

/**
 * Validation callback function type.
 * Callback function used by Element Plus form validators.
 */
export type ValidationCallback = (error?: Error) => void

/**
 * Custom validator function type.
 * @param rule - Validation rule.
 * @param value - Value to validate.
 * @param callback - Validation callback.
 */
export type ValidatorFunction = (
  rule: unknown,
  value: unknown,
  callback: ValidationCallback,
) => void | Promise<void>

/**
 * Form validation rules type.
 * Enhanced version of Element Plus FormRules.
 */
export type FormRules<T = Record<string, unknown>> = Partial<Record<keyof T, FormItemRule[]>>

/**
 * Validation trigger timing.
 */
export type ValidationTrigger = 'blur' | 'change' | ['blur', 'change']

/**
 * Validation rule builder options.
 */
export interface ValidationRuleOptions {
  /** Trigger timing. */
  trigger?: ValidationTrigger
  /** Error message. */
  message?: string
  /** Whether it is required. */
  required?: boolean
  /** Minimum length. */
  min?: number
  /** Maximum length. */
  max?: number
  /** Regular expression. */
  pattern?: RegExp
  /** Custom validator. */
  validator?: ValidatorFunction
  /** Validation type. */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'email' | 'url' | 'date'
}

/**
 * Form validation state.
 */
export interface ValidationState {
  /** Whether it is currently validating. */
  isValidating: boolean
  /** Whether validation passed. */
  isValid: boolean
  /** Error messages. */
  errors: Record<string, string>
  /** Touched fields. */
  touched: Record<string, boolean>
  /** Dirty fields (modified). */
  dirty: Record<string, boolean>
}

/**
 * Form field definition.
 */
export interface FormField<T = Record<string, unknown>> {
  /** Field name. */
  name: keyof T
  /** Field label. */
  label: string
  /** Field type. */
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea'
  /** Default value. */
  defaultValue?: unknown
  /** Placeholder. */
  placeholder?: string
  /** Whether it is required. */
  required?: boolean
  /** Whether it is disabled. */
  disabled?: boolean
  /** Whether it is read-only. */
  readonly?: boolean
  /** Validation rules. */
  rules?: FormItemRule[]
  /** Options (for select, radio, checkbox). */
  options?: Array<{
    label: string
    value: unknown
    disabled?: boolean
  }>
  /** Other properties. */
  props?: Record<string, unknown>
}

/**
 * Form configuration.
 */
export interface FormConfig<T = Record<string, unknown>> {
  /** Form fields. */
  fields: FormField<T>[]
  /** Label width. */
  labelWidth?: string
  /** Label position. */
  labelPosition?: 'left' | 'right' | 'top'
  /** Form size. */
  size?: 'large' | 'default' | 'small'
  /** Whether it is an inline form. */
  inline?: boolean
  /** Whether to hide the required asterisk. */
  hideRequiredAsterisk?: boolean
  /** Whether to show error messages. */
  showMessage?: boolean
  /** Whether to show error messages inline. */
  inlineMessage?: boolean
  /** Whether to scroll to the error field. */
  scrollToError?: boolean
}

/**
 * Validation result.
 */
export interface ValidationResult {
  /** Whether validation passed. */
  valid: boolean
  /** Error fields. */
  errors?: Array<{
    field: string
    message: string
  }>
  /** First error. */
  firstError?: string
}

/**
 * Dynamic form item.
 */
export interface DynamicFormItem {
  /** Unique identifier. */
  id: string | number
  /** Form data. */
  data: Record<string, unknown>
  /** Validation rules. */
  rules?: FormRules
  /** Whether it is expanded/shown. */
  expanded?: boolean
}

/**
 * Form submit handler.
 */
export type FormSubmitHandler<T = Record<string, unknown>> = (
  data: T,
  isValid: boolean,
) => void | Promise<void>

/**
 * Form reset handler.
 */
export type FormResetHandler = () => void

/**
 * Field change handler.
 */
export type FieldChangeHandler<T = Record<string, unknown>> = (
  field: keyof T,
  value: unknown,
  oldValue: unknown,
) => void

/**
 * Validation error handler.
 */
export type ValidationErrorHandler = (errors: ValidationResult['errors']) => void

/**
 * Form events.
 */
export interface FormEvents<T = Record<string, unknown>> {
  /** Submit event. */
  onSubmit?: FormSubmitHandler<T>
  /** Reset event. */
  onReset?: FormResetHandler
  /** Field change event. */
  onChange?: FieldChangeHandler<T>
  /** Validation error event. */
  onValidationError?: ValidationErrorHandler
  /** Validation success event. */
  onValidationSuccess?: () => void
}

/**
 * Form instance methods.
 */
export interface FormMethods {
  /** Validate the entire form. */
  validate(): Promise<ValidationResult>
  /** Validate specific fields. */
  validateField(field: string | string[]): Promise<ValidationResult>
  /** Reset the form. */
  resetFields(): void
  /** Clear validation. */
  clearValidate(field?: string | string[]): void
  /** Scroll to the error field. */
  scrollToField(field: string): void
  /** Get form data. */
  getFormData(): Record<string, unknown>
  /** Set form data. */
  setFormData(data: Record<string, unknown>): void
}
