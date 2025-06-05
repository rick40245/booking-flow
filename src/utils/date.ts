/**
 * 日期相關工具函數
 * 提供統一的日期處理方法，確保整個應用的日期格式一致性
 */

import { TIME_FORMATS } from '@/constants/booking'

/**
 * 格式化日期為 YYYY/MM/DD 格式
 * @param dateInput - 日期字串或日期物件
 * @returns 格式化後的日期字串
 */
export function formatDisplayDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return ''
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}/${month}/${day}`
  } catch (error) {
    console.error('日期格式化錯誤:', error)
    return ''
  }
}

/**
 * 格式化日期為 ISO 格式 (YYYY-MM-DD)
 * @param dateInput - 日期字串或日期物件
 * @returns ISO 格式的日期字串
 */
export function formatISODate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return ''
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) return ''
    
    return date.toISOString().split(TIME_FORMATS.ISO_DATE_SPLIT)[0]
  } catch (error) {
    console.error('ISO 日期格式化錯誤:', error)
    return ''
  }
}

/**
 * 檢查日期是否為今天之前
 * @param date - 要檢查的日期
 * @returns 是否為過去的日期
 */
export function isDateBeforeToday(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * 檢查兩個日期是否為同一天
 * @param date1 - 第一個日期
 * @param date2 - 第二個日期
 * @returns 是否為同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

/**
 * 從時段字串中取得小時數
 * @param timeSlot - 時段字串 (例如: "14:00")
 * @returns 小時數
 */
export function getHourFromTimeSlot(timeSlot: string): number {
  return parseInt(timeSlot.split(':')[0])
}

/**
 * 過濾可用的時段（排除已過去的時段）
 * @param slots - 時段陣列
 * @param selectedDate - 選擇的日期
 * @returns 過濾後的時段陣列
 */
export function filterAvailableSlots(slots: string[], selectedDate: Date | string): string[] {
  const date = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
  const today = new Date()
  
  // 如果不是今天，返回所有時段
  if (!isSameDay(date, today)) {
    return slots
  }
  
  // 如果是今天，過濾掉已過去的時段
  const currentHour = today.getHours()
  return slots.filter(slot => getHourFromTimeSlot(slot) > currentHour)
}

/**
 * 驗證日期字串格式是否正確
 * @param dateString - 日期字串
 * @returns 是否為有效的日期格式
 */
export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
} 