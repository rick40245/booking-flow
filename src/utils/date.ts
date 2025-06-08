/**
 * Date-related utility functions
 * Provides unified date processing methods to ensure date format consistency throughout the application.
 */

import { TIME_FORMATS } from '@/constants/booking'

/**
 * Formats a date to YYYY/MM/DD format.
 * @param dateInput - Date string or Date object.
 * @returns Formatted date string.
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
    console.error('Date formatting error:', error)
    return ''
  }
}

/**
 * Formats a date to ISO format (YYYY-MM-DD).
 * @param dateInput - Date string or Date object.
 * @returns ISO formatted date string.
 */
export function formatISODate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return ''

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) return ''

    return date.toISOString().split(TIME_FORMATS.ISO_DATE_SPLIT)[0]
  } catch (error) {
    console.error('ISO date formatting error:', error)
    return ''
  }
}

/**
 * Checks if a date is before today.
 * @param date - The date to check.
 * @returns True if the date is in the past, false otherwise.
 */
export function isDateBeforeToday(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Checks if two dates are the same day.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns True if they are the same day, false otherwise.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

/**
 * Gets the hour from a time slot string.
 * @param timeSlot - Time slot string (e.g., "14:00").
 * @returns The hour number.
 */
export function getHourFromTimeSlot(timeSlot: string): number {
  return parseInt(timeSlot.split(':')[0])
}

/**
 * Filters available time slots (excludes past slots).
 * @param slots - Array of time slots.
 * @param selectedDate - The selected date.
 * @returns Filtered array of time slots.
 */
export function filterAvailableSlots(slots: string[], selectedDate: Date | string): string[] {
  const date = typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate
  const today = new Date()

  // If not today, return all slots
  if (!isSameDay(date, today)) {
    return slots
  }

  // If today, filter out past slots
  const currentHour = today.getHours()
  return slots.filter((slot) => getHourFromTimeSlot(slot) > currentHour)
}

/**
 * Validates if a date string has a correct format.
 * @param dateString - The date string.
 * @returns True if the date string is valid, false otherwise.
 */
export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}
