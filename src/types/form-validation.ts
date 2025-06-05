/**
 * 表單驗證相關的 TypeScript 類型定義
 * 針對 Element Plus 表單驗證提供完整的類型支援
 */

import type { FormItemRule } from 'element-plus'

/**
 * 驗證回調函數類型
 * Element Plus 表單驗證器使用的回調函數
 */
export type ValidationCallback = (error?: Error) => void

/**
 * 自定義驗證器函數類型
 * @param rule - 驗證規則
 * @param value - 驗證的值
 * @param callback - 驗證回調
 */
export type ValidatorFunction = (
  rule: unknown,
  value: unknown,
  callback: ValidationCallback,
) => void | Promise<void>

/**
 * 表單驗證規則類型
 * Element Plus FormRules 的增強版本
 */
export type FormRules<T = Record<string, unknown>> = Partial<Record<keyof T, FormItemRule[]>>

/**
 * 驗證觸發時機
 */
export type ValidationTrigger = 'blur' | 'change' | ['blur', 'change']

/**
 * 驗證規則建構器選項
 */
export interface ValidationRuleOptions {
  /** 觸發時機 */
  trigger?: ValidationTrigger
  /** 錯誤訊息 */
  message?: string
  /** 是否必填 */
  required?: boolean
  /** 最小長度 */
  min?: number
  /** 最大長度 */
  max?: number
  /** 正則表達式 */
  pattern?: RegExp
  /** 自定義驗證器 */
  validator?: ValidatorFunction
  /** 驗證類型 */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'email' | 'url' | 'date'
}

/**
 * 表單驗證狀態
 */
export interface ValidationState {
  /** 是否正在驗證 */
  isValidating: boolean
  /** 是否驗證通過 */
  isValid: boolean
  /** 錯誤訊息 */
  errors: Record<string, string>
  /** 觸碰過的欄位 */
  touched: Record<string, boolean>
  /** 髒欄位（已修改） */
  dirty: Record<string, boolean>
}

/**
 * 表單欄位定義
 */
export interface FormField<T = Record<string, unknown>> {
  /** 欄位名稱 */
  name: keyof T
  /** 欄位標籤 */
  label: string
  /** 欄位類型 */
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea'
  /** 預設值 */
  defaultValue?: unknown
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否唯讀 */
  readonly?: boolean
  /** 驗證規則 */
  rules?: FormItemRule[]
  /** 選項（用於 select, radio, checkbox） */
  options?: Array<{
    label: string
    value: unknown
    disabled?: boolean
  }>
  /** 其他屬性 */
  props?: Record<string, unknown>
}

/**
 * 表單配置
 */
export interface FormConfig<T = Record<string, unknown>> {
  /** 表單欄位 */
  fields: FormField<T>[]
  /** 標籤寬度 */
  labelWidth?: string
  /** 標籤位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 表單大小 */
  size?: 'large' | 'default' | 'small'
  /** 是否行內表單 */
  inline?: boolean
  /** 是否顯示必填星號 */
  hideRequiredAsterisk?: boolean
  /** 是否顯示錯誤訊息 */
  showMessage?: boolean
  /** 是否行內顯示錯誤訊息 */
  inlineMessage?: boolean
  /** 是否滾動到錯誤欄位 */
  scrollToError?: boolean
}

/**
 * 驗證結果
 */
export interface ValidationResult {
  /** 是否驗證通過 */
  valid: boolean
  /** 錯誤欄位 */
  errors?: Array<{
    field: string
    message: string
  }>
  /** 第一個錯誤 */
  firstError?: string
}

/**
 * 動態表單項目
 */
export interface DynamicFormItem {
  /** 唯一標識 */
  id: string | number
  /** 表單資料 */
  data: Record<string, unknown>
  /** 驗證規則 */
  rules?: FormRules
  /** 是否展開/顯示 */
  expanded?: boolean
}

/**
 * 表單提交處理器
 */
export type FormSubmitHandler<T = Record<string, unknown>> = (
  data: T,
  isValid: boolean,
) => void | Promise<void>

/**
 * 表單重置處理器
 */
export type FormResetHandler = () => void

/**
 * 欄位變更處理器
 */
export type FieldChangeHandler<T = Record<string, unknown>> = (
  field: keyof T,
  value: unknown,
  oldValue: unknown,
) => void

/**
 * 驗證錯誤處理器
 */
export type ValidationErrorHandler = (errors: ValidationResult['errors']) => void

/**
 * 表單事件
 */
export interface FormEvents<T = Record<string, unknown>> {
  /** 提交事件 */
  onSubmit?: FormSubmitHandler<T>
  /** 重置事件 */
  onReset?: FormResetHandler
  /** 欄位變更事件 */
  onChange?: FieldChangeHandler<T>
  /** 驗證錯誤事件 */
  onValidationError?: ValidationErrorHandler
  /** 驗證成功事件 */
  onValidationSuccess?: () => void
}

/**
 * 表單實例方法
 */
export interface FormMethods {
  /** 驗證整個表單 */
  validate(): Promise<ValidationResult>
  /** 驗證特定欄位 */
  validateField(field: string | string[]): Promise<ValidationResult>
  /** 重置表單 */
  resetFields(): void
  /** 清除驗證 */
  clearValidate(field?: string | string[]): void
  /** 滾動到錯誤欄位 */
  scrollToField(field: string): void
  /** 取得表單資料 */
  getFormData(): Record<string, unknown>
  /** 設定表單資料 */
  setFormData(data: Record<string, unknown>): void
}
