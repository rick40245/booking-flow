<template>
  <PageContainer :title="pageTitle" max-width="lg">
    <!-- Selected service item card -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
      <p class="font-semibold text-sm mb-1 text-gray-800">已選擇: {{ selectedServiceName }}</p>
      <p class="text-sm text-gray-800 m-0">
        價格:
        <span v-if="typeof selectedServicePrice === 'string'"> ${{ selectedServicePrice }} </span>
        <span v-else> ${{ selectedServicePrice }} / 小時 </span>
      </p>
    </div>

    <!-- Booking information form -->
    <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <div class="font-semibold text-sm mb-4 text-gray-800">預約資訊</div>

      <el-form :model="bookingForm" :rules="formRules" ref="formRef" label-position="top">
        <!-- Number of people -->
        <el-form-item label="預約總人數" prop="totalPeople">
          <el-input-number
            v-model="bookingForm.totalPeople"
            :min="BOOKING_LIMITS.MIN_PEOPLE"
            :max="BOOKING_LIMITS.MAX_PEOPLE"
            size="default"
            style="width: 100%"
          />
        </el-form-item>

        <!-- Main booker information title -->
        <div class="text-sm font-semibold text-gray-800 my-5">主要預約人資訊</div>

        <!-- Name -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="bookingForm.name" maxlength="20" show-word-limit size="default" />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="電話" prop="phone">
          <el-input v-model="bookingForm.phone" placeholder="09xxxxxxxx" size="default" />
          <el-text type="info" size="small"> 台灣手機號碼: 09XXXXXXXX </el-text>
        </el-form-item>
        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="bookingForm.email" type="email" size="default" />
        </el-form-item>

        <!-- Select service staff -->
        <div class="mb-4">
          <div class="text-xs text-gray-600 mb-2">
            選擇服務人員 <span class="text-red-500 ml-1">*</span>
          </div>
          <div v-if="availableStaff.length > 0" class="flex gap-2 overflow-x-auto pb-1">
            <div
              v-for="staff in availableStaff"
              :key="staff?.serviceId || staff?.staffId"
              :class="[
                'flex-none w-1/3 min-w-1/3 rounded-lg p-3 cursor-pointer transition-all',
                bookingForm.selectedStaffId === staff?.staffId
                  ? 'bg-blue-50 shadow-md'
                  : 'bg-white hover:bg-blue-25',
              ]"
              :style="{
                border:
                  bookingForm.selectedStaffId === staff?.staffId
                    ? '1px solid #3b82f6'
                    : '1px solid #d1d5db',
              }"
              @click="staff && selectStaff(staff)"
            >
              <div class="font-semibold text-sm text-gray-800 mb-1">{{ staff?.staffName }}</div>
              <div class="text-xs text-gray-600 mb-1">{{ staff?.workTime }}</div>
              <div class="text-xs text-orange-600 font-semibold">${{ staff?.price }}</div>
            </div>
          </div>
          <div
            v-else
            class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300"
          >
            無可用服務人員
          </div>
        </div>

        <!-- Booking date -->
        <el-form-item label="選擇服務日期" prop="date">
          <el-date-picker
            v-model="bookingForm.date"
            type="date"
            placeholder="選擇日期"
            :disabled-date="disabledDate"
            size="default"
            style="width: 100%"
          />
        </el-form-item>

        <!-- Available time slots -->
        <div class="mb-4">
          <div class="text-xs text-gray-600 mb-2">
            選擇服務時段 <span class="text-red-500 ml-1">*</span>
            <span v-if="!bookingForm.date" class="text-gray-400">(請先選擇日期)</span>
            <span v-else-if="!bookingForm.selectedStaffId" class="text-orange-500"
              >(請先選擇服務人員)</span
            >
            <span v-else-if="availableSlots.length === 0" class="text-red-500"
              >(當日無可用時段)</span
            >
          </div>
          <div
            v-if="bookingForm.date && bookingForm.selectedStaffId && availableSlots.length > 0"
            class="grid grid-cols-3 gap-2"
          >
            <button
              v-for="slot in availableSlots"
              :key="slot"
              type="button"
              :class="[
                'rounded p-2 text-xs cursor-pointer transition-all text-center',
                bookingForm.timeSlot === slot
                  ? 'bg-blue-50 text-gray-800 shadow-md'
                  : 'bg-white hover:bg-blue-25',
              ]"
              :style="{
                border: bookingForm.timeSlot === slot ? '1px solid #3b82f6' : '1px solid #d1d5db',
              }"
              @click="selectTimeSlot(slot)"
            >
              {{ slot }}
            </button>
          </div>
          <div
            v-else-if="!bookingForm.date"
            class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300"
          >
            請先選擇預約日期以查看可用時段
          </div>
          <div
            v-else-if="!bookingForm.selectedStaffId"
            class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300"
          >
            請先選擇服務人員以查看可用時段
          </div>
        </div>
      </el-form>
    </div>

    <!-- Additional booker information -->
    <div v-if="bookingForm.totalPeople > 1" class="bg-white rounded-lg p-4 mb-5">
      <div class="font-semibold text-sm mb-4 text-gray-800">
        額外預約人資訊
        <span class="text-xs text-gray-600 font-normal">
          ({{ extraPersons.length }}/{{ bookingForm.totalPeople - 1 }})
        </span>
      </div>

      <div class="mb-3">
        <el-button
          type="primary"
          size="default"
          @click="openExtraPersonDialog"
          :disabled="isAddPersonDisabled"
          class="w-full bg-blue-500 border-blue-500 flex items-center justify-center gap-1.5"
        >
          新增預約人
        </el-button>
        <div v-if="isAddPersonDisabled" class="mt-2 text-center">
          <el-text type="info" size="small">
            已達預約人數上限 ({{ bookingForm.totalPeople }}人)
          </el-text>
        </div>
      </div>

      <!-- Additional bookers list -->
      <div v-if="extraPersons.length > 0" class="mb-3">
        <div
          v-for="(person, index) in extraPersons"
          :key="index"
          class="bg-gray-50 rounded p-3 mb-2 flex justify-between items-start"
        >
          <div class="flex-1">
            <div class="mb-1.5">
              <div class="text-xs text-gray-800">姓名: {{ person.name }}</div>
              <div v-if="person.phone" class="text-xs text-gray-800">電話: {{ person.phone }}</div>
              <div v-if="person.email" class="text-xs text-gray-800">Email: {{ person.email }}</div>
              <span v-if="!person.phone && !person.email" class="text-gray-500 italic">未提供</span>
            </div>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="removeExtraPerson(index)"
            class="ml-2 min-w-15"
          >
            移除
          </el-button>
        </div>
      </div>

      <!-- Empty state message -->
      <div
        v-else
        class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300"
      >
        <el-text type="info">請點選上方按鈕新增額外預約人資訊</el-text>
      </div>
    </div>

    <!-- Submit button area -->
    <div class="sticky bottom-0 p-4 bg-white border-t border-gray-200">
      <el-button
        type="primary"
        size="large"
        @click="submitForm"
        class="w-full p-3 bg-blue-500 border-blue-500 text-base font-semibold"
      >
        確認預約
      </el-button>
    </div>

    <!-- Additional booker Dialog (inline version) -->
    <el-dialog
      :model-value="extraPersonDialogVisible"
      title="新增額外預約人"
      width="350px"
      @update:model-value="extraPersonDialogVisible = $event"
      :close-on-click-modal="false"
    >
      <el-form
        :model="extraPersonForm"
        :rules="extraPersonRules"
        ref="extraPersonFormRef"
        label-width="60px"
        label-position="left"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="extraPersonForm.name"
            maxlength="20"
            show-word-limit
            placeholder="請輸入姓名"
          />
        </el-form-item>
        <el-form-item label="電話" prop="phone">
          <el-input v-model="extraPersonForm.phone" placeholder="09xxxxxxxx" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="extraPersonForm.email" type="email" placeholder="example@email.com" />
        </el-form-item>
        <div class="mt-2 mb-4 pl-1">
          <el-text type="info" size="small">* 電話與Email請至少填寫一項</el-text>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="handleCancelExtraPerson">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirmExtraPerson"
          :loading="isSubmittingExtraPerson"
          >確認新增</el-button
        >
      </template>
    </el-dialog>

    <!-- Process interruption warning -->
    <ConfirmDialog
      v-model:visible="showConfirm"
      @confirm="handleLeave"
      @cancel="showConfirm = false"
    />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import {
  useRouter,
  onBeforeRouteLeave,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import { useServiceStore } from '@/stores/servicesStore'
import { useBookingStore, type BookingData } from '@/stores/bookingStore'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageContainer from '@/components/PageContainer.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { VALIDATION_RULES, MESSAGES, ROUTE_NAMES, BOOKING_LIMITS } from '@/constants/booking'
import {
  createRequiredRule,
  createMaxLengthRule,
  createPhoneOrEmailValidator,
  validateTaiwanPhone,
  validateEmailFormat,
} from '@/utils/validation'
import { isDateBeforeToday } from '@/utils/date'

// Define types for route navigation
interface RouteNavigationContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

// Define type for staff object
interface StaffMember {
  staffId: number
  staffName: string
  serviceId: number
  workTime: string
  price: number
}

// Define validation callback type for Element Plus
type ValidationCallback = (error?: Error) => void

const router = useRouter()
const serviceStore = useServiceStore()
const bookingStore = useBookingStore()

const formRef = ref<FormInstance>()
const extraPersonFormRef = ref<FormInstance>()
const extraPersonDialogVisible = ref(false)
const isSubmittingExtraPerson = ref(false)
const showConfirm = ref(false)
const isFormSubmitted = ref(false)

// Enhanced navigation context handling with proper typing
let pendingNavigationContext: RouteNavigationContext | null = null

// Additional booker form
const extraPersonForm = ref({
  name: '',
  phone: '',
  email: '',
})

// Form data - using more direct reactive binding
const bookingForm = computed({
  get: () => bookingStore.formData,
  set: (val) => {
    bookingStore.formData = { ...val }
  },
})

// Additional bookers list - using computed two-way binding to store
const extraPersons = computed({
  get: () => bookingStore.formData.extraPersons,
  set: (val) => {
    bookingStore.formData = { ...bookingStore.formData, extraPersons: val }
  },
})

// Calculate limit for adding additional bookers
const isAddPersonDisabled = computed(() => {
  return extraPersons.value.length >= bookingForm.value.totalPeople - 1
})

// Check if in edit mode
const isEditMode = computed(() => {
  return bookingStore.isEditMode
})

// Page title - dynamically display based on edit mode
const pageTitle = computed(() => {
  return isEditMode.value ? '頁面2 - 編輯預約' : '頁面2 - 預約表單'
})

// Currently selected service type
const selectedServiceType = computed(() => {
  if (!bookingStore.selectedServiceId) return null
  return serviceStore.getServiceTypeById(bookingStore.selectedServiceId)
})

// Get available staff by service type - filter to ensure not null
const availableStaff = computed(() => {
  if (!selectedServiceType.value) return []
  return serviceStore
    .getStaffByServiceType(selectedServiceType.value)
    .filter((staff) => staff !== null)
})

// Get selected service name and price (for top card display)
const selectedServiceName = computed(() => {
  if (bookingForm.value.selectedStaffId) {
    // If staff is selected, show staff name
    const selectedStaff = serviceStore.getStaffById(bookingForm.value.selectedStaffId)
    return selectedStaff ? selectedStaff.name : ''
  } else if (selectedServiceType.value) {
    // If no staff selected yet, show Chinese service name
    const service = serviceStore.services.find((s) => s.serviceType === selectedServiceType.value)
    return service ? service.name : selectedServiceType.value
  }
  return ''
})

const selectedServicePrice = computed(() => {
  if (bookingForm.value.selectedStaffId) {
    // If staff is selected, show that staff's price
    const selectedStaff = serviceStore.getStaffById(bookingForm.value.selectedStaffId)
    return selectedStaff ? selectedStaff.price : 0
  } else {
    // If no staff selected yet, show price range
    const validStaff = availableStaff.value.filter((staff) => staff !== null)
    const prices = validStaff.map((staff) => staff!.price)
    if (prices.length === 0) return 0
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    return minPrice === maxPrice ? minPrice : `${minPrice}-${maxPrice}`
  }
})

// Available time slots - dynamically generated based on selected staff and date
const availableSlots = computed(() => {
  if (!bookingForm.value.selectedStaffId) return []

  const staffId = bookingForm.value.selectedStaffId
  const selectedDate = bookingForm.value.date

  return serviceStore.getAvailableSlots(staffId, selectedDate)
})

// Form validation rules
const formRules: FormRules = {
  totalPeople: [createRequiredRule('請選擇預約人數', 'change')],
  name: [
    createRequiredRule('請輸入姓名', 'blur'),
    createMaxLengthRule(
      VALIDATION_RULES.NAME_MAX_LENGTH,
      `姓名最多${VALIDATION_RULES.NAME_MAX_LENGTH}個字`,
      'blur',
    ),
  ],
  phone: [
    createRequiredRule('請輸入電話', 'blur'),
    {
      pattern: VALIDATION_RULES.PHONE_PATTERN,
      message: MESSAGES.ERRORS.INVALID_PHONE,
      trigger: 'blur',
    },
  ],
  date: [createRequiredRule('請選擇預約日期', 'change')],
}

// Disable dates before today
function disabledDate(date: Date): boolean {
  return isDateBeforeToday(date)
}

// Select staff
function selectStaff(staff: StaffMember): void {
  bookingStore.setSelectedStaff(staff.staffId)
}

// Select time slot - directly modify store's formData
function selectTimeSlot(slot: string): void {
  bookingStore.formData.timeSlot = slot
}

// Open additional booker dialog
function openExtraPersonDialog(): void {
  // Reset form first
  resetExtraPersonForm()

  extraPersonDialogVisible.value = true
}

// Add additional booker
function addExtraPerson(person: { name: string; phone: string; email: string }): void {
  bookingStore.formData.extraPersons.push(person)
}

// Handle confirm adding additional booker
function handleConfirmExtraPerson(): void {
  isSubmittingExtraPerson.value = true

  extraPersonFormRef.value?.validate((valid) => {
    isSubmittingExtraPerson.value = false

    if (valid) {
      // Clean data
      const cleanedData = {
        name: extraPersonForm.value.name.trim(),
        phone: extraPersonForm.value.phone.trim(),
        email: extraPersonForm.value.email.trim(),
      }

      addExtraPerson(cleanedData)
      extraPersonDialogVisible.value = false
      resetExtraPersonForm()

      // Show success message
      ElMessage.success('已新增額外預約人')
    } else {
      ElMessage.error('請檢查填寫資料')
    }
  })
}

// Handle cancel adding additional booker
function handleCancelExtraPerson(): void {
  extraPersonDialogVisible.value = false
  resetExtraPersonForm()
}

// Reset additional booker form
function resetExtraPersonForm(): void {
  extraPersonForm.value = { name: '', phone: '', email: '' }
  // Use nextTick to ensure validation is cleared in next tick
  nextTick(() => {
    extraPersonFormRef.value?.clearValidate()
  })
}

// Remove additional booker
function removeExtraPerson(index: number): void {
  bookingStore.formData.extraPersons.splice(index, 1)
}

// Submit form
function submitForm(): void {
  if (!bookingForm.value.selectedStaffId) {
    ElMessage.error('請選擇服務人員')
    return
  }

  if (!bookingForm.value.timeSlot) {
    ElMessage.error('請選擇預約時段')
    return
  }

  formRef.value?.validate((valid) => {
    if (valid) {
      // Check additional booker count
      const requiredExtraPersons = bookingForm.value.totalPeople - 1
      const currentExtraPersons = extraPersons.value.length

      if (currentExtraPersons < requiredExtraPersons) {
        ElMessage.error(`還需要新增 ${requiredExtraPersons - currentExtraPersons} 位額外預約人`)
        return
      }

      if (currentExtraPersons > requiredExtraPersons) {
        ElMessage.error('額外預約人數量超過限制，請移除多餘的預約人')
        return
      }

      // Prepare data to save
      const dataToSave: BookingData = {
        ...bookingForm.value,
        extraPersons: extraPersons.value,
        serviceId: bookingStore.selectedServiceId || undefined,
      }

      // Update formData (if need to maintain current form state, e.g., for returning to edit)
      bookingStore.setBookingData(dataToSave)

      // Add booking data to bookingHistory
      bookingStore.addBooking(dataToSave)

      // Set form submitted flag to avoid route guard interception
      isFormSubmitted.value = true

      // Navigate to page 3
      router
        .push({ name: ROUTE_NAMES.BOOKING_SUMMARY })
        .then(() => {
          // After successful navigation, consider clearing Page 2's formData unless edit flow needs it
          // bookingStore.clearFormData()
        })
        .catch((error) => {
          console.error('❌ 跳轉失敗:', error)
          isFormSubmitted.value = false
        })
    }
  })
}

// Handle leaving the page with proper data cleanup and error handling
function handleLeave(): void {
  try {
    // Clear all booking data as specified in requirements
    bookingStore.clear()
    bookingStore.clearFormData()
    bookingStore.clearEditingItemIndex()

    // Close the dialog
    showConfirm.value = false

    // Always navigate back to page 1 (service list) when confirming to leave
    router
      .push({ name: 'service-list' })
      .then(() => {
        // Successfully navigated back to service list page
      })
      .catch((error) => {
        console.error('❌ Failed to navigate back to service list:', error)
        // Fallback: try to navigate to home or show error message
        ElMessage.error('導航失敗，請重新整理頁面')
        // Force page reload as last resort
        window.location.href = '/'
      })

    // Clear any pending navigation context since we're handling navigation manually
    pendingNavigationContext = null
  } catch (error) {
    console.error('❌ Error occurred while leaving page:', error)
    ElMessage.error('操作失敗，請重試')

    // Ensure dialog is closed even if error occurs
    showConfirm.value = false
    pendingNavigationContext = null
  }
}

// Enhanced route guard with error handling and improved typing
onBeforeRouteLeave((to, from, next) => {
  try {
    // If form was successfully submitted, allow navigation to booking-summary
    if (isFormSubmitted.value && to.name === 'booking-summary') {
      next()
      return
    }

    // Check if user has form data that would be lost
    if (bookingStore.hasFormData) {
      showConfirm.value = true
      pendingNavigationContext = { to, from, next }
      next(false) // Block navigation
    } else {
      next() // Allow navigation
    }
  } catch (error) {
    console.error('❌ Error in route guard:', error)
    // In case of error, allow navigation to prevent user from being stuck
    ElMessage.error('路由檢查失敗，允許導航')
    next()
  }
})

// Enhanced dialog state watcher with error handling
watch(showConfirm, (val) => {
  try {
    // When dialog is closed via cancel, prevent navigation
    if (!val && pendingNavigationContext) {
      const { next } = pendingNavigationContext
      next(false) // Cancel navigation
      pendingNavigationContext = null
    }
  } catch (error) {
    console.error('❌ Error handling dialog close:', error)
    // Clear state to prevent issues
    pendingNavigationContext = null
  }
})

// Watch date changes, clear selected time slot
watch(
  () => bookingForm.value.date,
  (newDate, oldDate) => {
    if (newDate !== oldDate && bookingForm.value.timeSlot) {
      // Check if selected time slot is available on new date
      if (bookingForm.value.selectedStaffId) {
        const newAvailableSlots = serviceStore.getAvailableSlots(
          bookingForm.value.selectedStaffId,
          newDate,
        )

        if (!newAvailableSlots.includes(bookingForm.value.timeSlot)) {
          bookingStore.formData.timeSlot = '' // Clear selected time slot
        }
      }
    }
  },
)

// Watch staff changes, clear selected time slot
watch(
  () => bookingForm.value.selectedStaffId,
  (newStaffId, oldStaffId) => {
    if (newStaffId !== oldStaffId) {
      bookingStore.formData.timeSlot = '' // Clear selected time slot
    }
  },
)

// Watch people count changes, cleanup excess additional bookers
watch(
  () => bookingForm.value.totalPeople,
  (newVal) => {
    const maxExtra = newVal - 1
    if (bookingStore.formData.extraPersons.length > maxExtra) {
      bookingStore.formData.extraPersons = bookingStore.formData.extraPersons.slice(0, maxExtra)
    }
  },
)

// Check selected service on initialization
onMounted(() => {
  // First restore page state (handle page refresh scenario)
  bookingStore.restorePageState()

  // Check if in edit mode
  if (isEditMode.value) {
    // Edit mode - data loaded from Summary page
  } else {
    // Add mode or recovery mode after page refresh
  }

  // Validate essential data exists
  const hasValidService = !!bookingStore.selectedServiceId
  const hasValidServiceType = !!selectedServiceType.value

  // If essential data is missing and not in edit mode, navigate back to page 1
  if (!hasValidService || !hasValidServiceType) {
    if (!isEditMode.value) {
      router.push({ name: 'service-list' })
      return
    }
  }
})

// Phone or Email required validator
function phoneOrEmailRequired(_: unknown, __: string, callback: ValidationCallback): void {
  const phoneOrEmailValidator = createPhoneOrEmailValidator(extraPersonForm.value)
  phoneOrEmailValidator(_, __, callback)
}

// Taiwan mobile phone validator
function validatePhone(_: unknown, value: string, callback: ValidationCallback): void {
  validateTaiwanPhone(_, value, callback)
}

// Email format validator
function validateEmail(_: unknown, value: string, callback: ValidationCallback): void {
  validateEmailFormat(_, value, callback)
}

// Additional booker form validation rules
const extraPersonRules: FormRules = {
  name: [
    createRequiredRule('請輸入姓名', 'blur'),
    { min: 1, message: '姓名不能為空', trigger: 'blur' },
    createMaxLengthRule(
      VALIDATION_RULES.NAME_MAX_LENGTH,
      `姓名最多${VALIDATION_RULES.NAME_MAX_LENGTH}個字`,
      'blur',
    ),
  ],
  phone: [
    { validator: phoneOrEmailRequired, trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  email: [
    { validator: phoneOrEmailRequired, trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' },
  ],
}
</script>
