<template>
    <PageContainer :title="pageTitle" max-width="lg">
        <!-- 已選擇服務項目卡片 -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
            <p class="font-semibold text-sm mb-1 text-gray-800">已選擇: {{ selectedServiceName }}</p>
            <p class="text-sm text-gray-800 m-0">
                價格:
                <span v-if="typeof selectedServicePrice === 'string'">
                    ${{ selectedServicePrice }}
                </span>
                <span v-else>
                    ${{ selectedServicePrice }} / 小時
                </span>
            </p>
        </div>

        <!-- 預約資訊表單 -->
        <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <div class="font-semibold text-sm mb-4 text-gray-800">預約資訊</div>

            <el-form :model="bookingForm" :rules="formRules" ref="formRef" label-position="top">
                <!-- 預約人數 -->
                <el-form-item label="預約總人數" prop="totalPeople">
                    <el-input-number v-model="bookingForm.totalPeople" :min="BOOKING_LIMITS.MIN_PEOPLE" :max="BOOKING_LIMITS.MAX_PEOPLE" size="default"
                        style="width: 100%;" />
                </el-form-item>

                <!-- 主要預約人資訊標題 -->
                <div class="text-sm font-semibold text-gray-800 my-5">主要預約人資訊</div>

                <!-- 姓名 -->
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="bookingForm.name" maxlength="20" show-word-limit size="default" />
                </el-form-item>

                <!-- 電話 -->
                <el-form-item label="電話" prop="phone">
                    <el-input v-model="bookingForm.phone" placeholder="09xxxxxxxx" size="default" />
                    <el-text type="info" size="small">
                        台灣手機號碼: 09XXXXXXXX
                    </el-text>
                </el-form-item>
                <!-- Email -->
                <el-form-item label="Email" prop="email">
                    <el-input v-model="bookingForm.email" type="email" size="default" />
                </el-form-item>

                <!-- 選擇服務人員 -->
                <div class="mb-4">
                    <div class="text-xs text-gray-600 mb-2">選擇服務人員 <span class="text-red-500 ml-1">*</span></div>
                    <div v-if="availableStaff.length > 0" class="flex gap-2 overflow-x-auto pb-1">
                        <div v-for="staff in availableStaff" :key="staff?.serviceId || staff?.staffId" 
                            :class="[
                                'flex-none w-1/3 min-w-1/3 rounded-lg p-3 cursor-pointer transition-all',
                                bookingForm.selectedStaffId === staff?.staffId 
                                    ? 'bg-blue-50 shadow-md' 
                                    : 'bg-white hover:bg-blue-25'
                            ]"
                            :style="{
                                border: bookingForm.selectedStaffId === staff?.staffId 
                                    ? '1px solid #3b82f6' 
                                    : '1px solid #d1d5db'
                            }"
                            @click="staff && selectStaff(staff)">
                            <div class="font-semibold text-sm text-gray-800 mb-1">{{ staff?.staffName }}</div>
                            <div class="text-xs text-gray-600 mb-1">{{ staff?.workTime }}</div>
                            <div class="text-xs text-orange-600 font-semibold">${{ staff?.price }}</div>
                        </div>
                    </div>
                    <div v-else class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300">
                        無可用服務人員
                    </div>
                </div>

                <!-- 預約日期 -->
                <el-form-item label="選擇服務日期" prop="date">
                    <el-date-picker v-model="bookingForm.date" type="date" placeholder="選擇日期"
                        :disabled-date="disabledDate" size="default" style="width: 100%;" />
                </el-form-item>

                <!-- 可預約時段 -->
                <div class="mb-4">
                    <div class="text-xs text-gray-600 mb-2">
                        選擇服務時段 <span class="text-red-500 ml-1">*</span>
                        <span v-if="!bookingForm.date" class="text-gray-400">(請先選擇日期)</span>
                        <span v-else-if="!bookingForm.selectedStaffId" class="text-orange-500">(請先選擇服務人員)</span>
                        <span v-else-if="availableSlots.length === 0" class="text-red-500">(當日無可用時段)</span>
                    </div>
                    <div v-if="bookingForm.date && bookingForm.selectedStaffId && availableSlots.length > 0"
                        class="grid grid-cols-3 gap-2">
                        <button v-for="slot in availableSlots" :key="slot" type="button" 
                            :class="[
                                'rounded p-2 text-xs cursor-pointer transition-all text-center',
                                bookingForm.timeSlot === slot 
                                    ? 'bg-blue-50 text-gray-800 shadow-md' 
                                    : 'bg-white hover:bg-blue-25'
                            ]"
                            :style="{
                                border: bookingForm.timeSlot === slot 
                                    ? '1px solid #3b82f6' 
                                    : '1px solid #d1d5db'
                            }"
                            @click="selectTimeSlot(slot)">
                            {{ slot }}
                        </button>
                    </div>
                    <div v-else-if="!bookingForm.date" class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300">
                        請先選擇預約日期以查看可用時段
                    </div>
                    <div v-else-if="!bookingForm.selectedStaffId" class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300">
                        請先選擇服務人員以查看可用時段
                    </div>
                </div>

            </el-form>
        </div>

        <!-- 額外預約人資訊 -->
        <div v-if="bookingForm.totalPeople > 1" class="bg-white rounded-lg p-4 mb-5">
            <div class="font-semibold text-sm mb-4 text-gray-800">
                額外預約人資訊
                <span class="text-xs text-gray-600 font-normal">
                    ({{ extraPersons.length }}/{{ bookingForm.totalPeople - 1 }})
                </span>
            </div>

            <div class="mb-3">
                <el-button type="primary" size="default" @click="openExtraPersonDialog" :disabled="isAddPersonDisabled"
                    class="w-full bg-blue-500 border-blue-500 flex items-center justify-center gap-1.5">
                    新增預約人
                </el-button>
                <div v-if="isAddPersonDisabled" class="mt-2 text-center">
                    <el-text type="info" size="small">
                        已達預約人數上限 ({{ bookingForm.totalPeople }}人)
                    </el-text>
                </div>
            </div>

            <!-- 額外預約人列表 -->
            <div v-if="extraPersons.length > 0" class="mb-3">
                <div v-for="(person, index) in extraPersons" :key="index" class="bg-gray-50 rounded p-3 mb-2 flex justify-between items-start">
                    <div class="flex-1">
                        <div class="mb-1.5">
                            <div class="text-xs text-gray-800">姓名: {{ person.name }}</div>
                            <div v-if="person.phone" class="text-xs text-gray-800">電話: {{ person.phone }}</div>
                            <div v-if="person.email" class="text-xs text-gray-800">Email: {{ person.email }}</div>
                            <span v-if="!person.phone && !person.email" class="text-gray-500 italic">未提供</span>
                        </div>
                    </div>
                    <el-button type="danger" size="small" @click="removeExtraPerson(index)" class="ml-2 min-w-15">
                        移除
                    </el-button>
                </div>
            </div>

            <!-- 空狀態提示 -->
            <div v-else class="text-center text-gray-500 text-xs p-5 bg-gray-50 rounded border border-dashed border-gray-300">
                <el-text type="info">請點選上方按鈕新增額外預約人資訊</el-text>
            </div>
        </div>

        <!-- 提交按鈕區域 -->
        <div class="sticky bottom-0 p-4 bg-white border-t border-gray-200">
            <el-button type="primary" size="large" @click="submitForm" class="w-full p-3 bg-blue-500 border-blue-500 text-base font-semibold">
                確認預約
            </el-button>
        </div>

        <!-- 額外預約人 Dialog (內聯版本) -->
        <el-dialog :model-value="extraPersonDialogVisible" title="新增額外預約人" width="350px"
            @update:model-value="extraPersonDialogVisible = $event" :close-on-click-modal="false">
            <el-form :model="extraPersonForm" :rules="extraPersonRules" ref="extraPersonFormRef" label-width="60px"
                label-position="left">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="extraPersonForm.name" maxlength="20" show-word-limit placeholder="請輸入姓名" />
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
                <el-button type="primary" @click="handleConfirmExtraPerson"
                    :loading="isSubmittingExtraPerson">確認新增</el-button>
            </template>
        </el-dialog>

        <!-- 流程中斷警告 -->
        <ConfirmDialog v-model:visible="showConfirm" @confirm="handleLeave" @cancel="showConfirm = false" />
    </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, onBeforeRouteLeave, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useServiceStore } from '@/stores/servicesStore'
import { useBookingStore, type BookingData } from '@/stores/bookingStore'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageContainer from '@/components/PageContainer.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { 
    VALIDATION_RULES, 
    MESSAGES, 
    ROUTE_NAMES,
    BOOKING_LIMITS 
} from '@/constants/booking'
import { 
    createRequiredRule, 
    createMaxLengthRule, 
    createPhoneOrEmailValidator,
    validateTaiwanPhone,
    validateEmailFormat 
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

// 額外預約人表單
const extraPersonForm = ref({
    name: '',
    phone: '',
    email: ''
})

// 表單資料 - 改用更直接的響應式綁定
const bookingForm = computed({
    get: () => bookingStore.formData,
    set: (val) => {
        bookingStore.formData = { ...val }
    }
})

// 額外預約人列表 - 改用 computed 雙向綁定到 store
const extraPersons = computed({
    get: () => bookingStore.formData.extraPersons,
    set: (val) => {
        bookingStore.formData = { ...bookingStore.formData, extraPersons: val }
    }
})

// 計算新增額外預約人的限制
const isAddPersonDisabled = computed(() => {
    return extraPersons.value.length >= bookingForm.value.totalPeople - 1
})

// 檢查是否為編輯模式
const isEditMode = computed(() => {
    return bookingStore.isEditMode
})

// 頁面標題 - 根據編輯模式動態顯示
const pageTitle = computed(() => {
    return isEditMode.value ? '頁面2 - 編輯預約' : '頁面2 - 預約表單'
})

// 目前選中的服務類型
const selectedServiceType = computed(() => {
    if (!bookingStore.selectedServiceId) return null
    return serviceStore.getServiceTypeById(bookingStore.selectedServiceId)
})

// 根據服務類型獲取可用的服務人員 - 加入過濾以確保不為 null
const availableStaff = computed(() => {
    if (!selectedServiceType.value) return []
    return serviceStore.getStaffByServiceType(selectedServiceType.value).filter(staff => staff !== null)
})

// 取得已選擇服務的名稱和價格（用於頂部卡片顯示）
const selectedServiceName = computed(() => {
    if (bookingForm.value.selectedStaffId) {
        // 如果已選擇服務人員，顯示服務人員名稱
        const selectedStaff = serviceStore.getStaffById(bookingForm.value.selectedStaffId)
        return selectedStaff ? selectedStaff.name : ''
    } else if (selectedServiceType.value) {
        // 如果還沒選擇服務人員，顯示中文服務名稱
        const service = serviceStore.services.find(s => s.serviceType === selectedServiceType.value)
        return service ? service.name : selectedServiceType.value
    }
    return ''
})

const selectedServicePrice = computed(() => {
    if (bookingForm.value.selectedStaffId) {
        // 如果已選擇服務人員，顯示該服務人員的價格
        const selectedStaff = serviceStore.getStaffById(bookingForm.value.selectedStaffId)
        return selectedStaff ? selectedStaff.price : 0
    } else {
        // 如果還沒選擇服務人員，顯示價格範圍
        const validStaff = availableStaff.value.filter(staff => staff !== null)
        const prices = validStaff.map(staff => staff!.price)
        if (prices.length === 0) return 0
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        return minPrice === maxPrice ? minPrice : `${minPrice}-${maxPrice}`
    }
})

// 可用時段 - 根據選中的服務人員和日期動態生成
const availableSlots = computed(() => {
    if (!bookingForm.value.selectedStaffId) return []

    const staffId = bookingForm.value.selectedStaffId
    const selectedDate = bookingForm.value.date

    return serviceStore.getAvailableSlots(staffId, selectedDate)
})

// 表單驗證規則
const formRules: FormRules = {
    totalPeople: [
        createRequiredRule('請選擇預約人數', 'change')
    ],
    name: [
        createRequiredRule('請輸入姓名', 'blur'),
        createMaxLengthRule(VALIDATION_RULES.NAME_MAX_LENGTH, `姓名最多${VALIDATION_RULES.NAME_MAX_LENGTH}個字`, 'blur')
    ],
    phone: [
        createRequiredRule('請輸入電話', 'blur'),
        { pattern: VALIDATION_RULES.PHONE_PATTERN, message: MESSAGES.ERRORS.INVALID_PHONE, trigger: 'blur' }
    ],
    date: [
        createRequiredRule('請選擇預約日期', 'change')
    ]
}

// 禁用今日之前的日期
function disabledDate(date: Date): boolean {
    return isDateBeforeToday(date)
}

// 選擇服務人員
function selectStaff(staff: StaffMember): void {
    bookingStore.setSelectedStaff(staff.staffId)
}

// 選擇時段 - 直接修改 store 的 formData
function selectTimeSlot(slot: string): void {
    bookingStore.formData.timeSlot = slot
}

// 開啟額外預約人Dialog
function openExtraPersonDialog(): void {
    console.log('openExtraPersonDialog called')
    console.log('isAddPersonDisabled:', isAddPersonDisabled.value)
    console.log('extraPersons.length:', extraPersons.value.length)
    console.log('totalPeople:', bookingForm.value.totalPeople)

    // 先重置表單
    resetExtraPersonForm()

    extraPersonDialogVisible.value = true
    console.log('extraPersonDialogVisible set to:', extraPersonDialogVisible.value)
}

// 新增額外預約人
function addExtraPerson(person: { name: string, phone: string, email: string }): void {
    bookingStore.formData.extraPersons.push(person)
}

// 處理確認新增額外預約人
function handleConfirmExtraPerson(): void {
    console.log('handleConfirmExtraPerson called')
    isSubmittingExtraPerson.value = true

    extraPersonFormRef.value?.validate((valid) => {
        isSubmittingExtraPerson.value = false

        if (valid) {
            // 清理資料
            const cleanedData = {
                name: extraPersonForm.value.name.trim(),
                phone: extraPersonForm.value.phone.trim(),
                email: extraPersonForm.value.email.trim()
            }

            console.log('Adding extra person:', cleanedData)
            addExtraPerson(cleanedData)
            extraPersonDialogVisible.value = false
            resetExtraPersonForm()

            // 顯示成功訊息
            ElMessage.success('已新增額外預約人')
        } else {
            ElMessage.error('請檢查填寫資料')
        }
    })
}

// 處理取消新增額外預約人
function handleCancelExtraPerson(): void {
    console.log('handleCancelExtraPerson called')
    extraPersonDialogVisible.value = false
    resetExtraPersonForm()
}

// 重置額外預約人表單
function resetExtraPersonForm(): void {
    extraPersonForm.value = { name: '', phone: '', email: '' }
    // 使用 nextTick 確保在下一個 tick 清除驗證
    nextTick(() => {
        extraPersonFormRef.value?.clearValidate()
    })
}

// 移除額外預約人
function removeExtraPerson(index: number): void {
    bookingStore.formData.extraPersons.splice(index, 1)
}

// 提交表單
function submitForm(): void {
    console.log('=== 開始提交表單 ===')
    console.log('bookingForm.value:', bookingForm.value)
    console.log('extraPersons.value:', extraPersons.value)

    if (!bookingForm.value.selectedStaffId) {
        console.log('❌ 沒有選擇服務人員')
        ElMessage.error('請選擇服務人員')
        return
    }
    console.log('✅ 已選擇服務人員:', bookingForm.value.selectedStaffId)

    if (!bookingForm.value.timeSlot) {
        console.log('❌ 沒有選擇預約時段')
        ElMessage.error('請選擇預約時段')
        return
    }
    console.log('✅ 已選擇時段:', bookingForm.value.timeSlot)

    console.log('🔍 開始表單驗證...')
    formRef.value?.validate((valid) => {
        console.log('表單驗證結果:', valid)
        if (valid) {
            // 檢查額外預約人數量
            const requiredExtraPersons = bookingForm.value.totalPeople - 1
            const currentExtraPersons = extraPersons.value.length

            console.log('預約人數檢查:')
            console.log('- 總人數:', bookingForm.value.totalPeople)
            console.log('- 需要額外人數:', requiredExtraPersons)
            console.log('- 當前額外人數:', currentExtraPersons)

            if (currentExtraPersons < requiredExtraPersons) {
                console.log('❌ 額外預約人不足')
                ElMessage.error(`還需要新增 ${requiredExtraPersons - currentExtraPersons} 位額外預約人`)
                return
            }

            if (currentExtraPersons > requiredExtraPersons) {
                console.log('❌ 額外預約人超過限制')
                ElMessage.error('額外預約人數量超過限制，請移除多餘的預約人')
                return
            }

            console.log('✅ 額外預約人數量檢查通過')

            // 準備儲存的資料
            const dataToSave: BookingData = {
                ...bookingForm.value,
                extraPersons: extraPersons.value,
                serviceId: bookingStore.selectedServiceId || undefined,
            }
            console.log('準備儲存的資料:', dataToSave)

            // 更新 formData (如果需要保持當前表單狀態，例如用於返回編輯)
            bookingStore.setBookingData(dataToSave)
            console.log('✅ 資料已更新到 store.formData')

            // 將預約資料加入到 bookingHistory
            bookingStore.addBooking(dataToSave)
            console.log('✅ 資料已新增到 store.bookingHistory')

            // 設定表單已提交標記，避免路由守衛攔截
            isFormSubmitted.value = true

            // 跳轉到頁面3
            console.log('🚀 準備跳轉到 booking-summary')
            router.push({ name: ROUTE_NAMES.BOOKING_SUMMARY }).then(() => {
                console.log('✅ 成功跳轉到 booking-summary')
                // 成功跳轉後，可以考慮清除 Page 2 的 formData，除非你的編輯流程需要它
                // bookingStore.clearFormData() 
            }).catch((error) => {
                console.error('❌ 跳轉失敗:', error)
                isFormSubmitted.value = false
            })
        } else {
            console.log('❌ 表單驗證失敗')
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
        router.push({ name: 'service-list' }).then(() => {
            console.log('✅ Successfully navigated back to service list page')
        }).catch((error) => {
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
            console.log('✅ Form submitted, allowing navigation to booking-summary')
            next()
            return
        }

        // Check if user has form data that would be lost
        if (bookingStore.hasFormData) {
            console.log('⚠️ User has unsaved form data, showing confirmation dialog')
            showConfirm.value = true
            pendingNavigationContext = { to, from, next }
            next(false) // Block navigation
        } else {
            console.log('✅ No form data, allowing navigation')
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
            console.log('🚫 Dialog cancelled, blocking navigation')
            next(false) // Cancel navigation
            pendingNavigationContext = null
        }
    } catch (error) {
        console.error('❌ Error handling dialog close:', error)
        // Clear state to prevent issues
        pendingNavigationContext = null
    }
})

// 監聽日期變化，清空已選時段
watch(() => bookingForm.value.date, (newDate, oldDate) => {
    if (newDate !== oldDate && bookingForm.value.timeSlot) {
        // 檢查已選時段是否在新日期的可用時段中
        if (bookingForm.value.selectedStaffId) {
            const newAvailableSlots = serviceStore.getAvailableSlots(
                bookingForm.value.selectedStaffId,
                newDate
            )

            if (!newAvailableSlots.includes(bookingForm.value.timeSlot)) {
                bookingStore.formData.timeSlot = '' // 清空已選時段
            }
        }
    }
})

// 監聽服務人員變化，清空已選時段
watch(() => bookingForm.value.selectedStaffId, (newStaffId, oldStaffId) => {
    if (newStaffId !== oldStaffId) {
        bookingStore.formData.timeSlot = '' // 清空已選時段
    }
})

// 監聽人數變化，清理多餘的額外預約人
watch(() => bookingForm.value.totalPeople, (newVal) => {
    const maxExtra = newVal - 1
    if (bookingStore.formData.extraPersons.length > maxExtra) {
        bookingStore.formData.extraPersons = bookingStore.formData.extraPersons.slice(0, maxExtra)
    }
})

// 初始化時檢查選中的服務
onMounted(() => {
    console.log('=== PageBookingForm onMounted ===')
    console.log('isEditMode:', isEditMode.value)
    console.log('editingItemIndex:', bookingStore.editingItemIndex)
    console.log('初始狀態 - selectedServiceId:', bookingStore.selectedServiceId)
    console.log('初始狀態 - selectedStaffId:', bookingStore.selectedStaffId)
    console.log('初始狀態 - formData:', bookingForm.value)

    // 首先恢復頁面狀態（處理頁面重新整理的情況）
    bookingStore.restorePageState()

    console.log('恢復後的狀態:')
    console.log('- selectedServiceId:', bookingStore.selectedServiceId)
    console.log('- selectedStaffId:', bookingStore.selectedStaffId)
    console.log('- selectedServiceType:', selectedServiceType.value)
    console.log('- selectedServiceName:', selectedServiceName.value)
    console.log('- selectedServicePrice:', selectedServicePrice.value)
    console.log('- availableStaff.length:', availableStaff.value.length)
    console.log('- formData.date:', bookingForm.value.date)
    console.log('- formData.timeSlot:', bookingForm.value.timeSlot)

    // 檢查是否為編輯模式
    if (isEditMode.value) {
        console.log('✅ 編輯模式 - 資料已從 Summary 頁面載入')
    } else {
        console.log('新增模式或頁面重新整理後的恢復模式')
    }

    // 驗證必要的資料是否存在
    const hasValidService = !!bookingStore.selectedServiceId
    const hasValidServiceType = !!selectedServiceType.value
    const hasAvailableStaff = availableStaff.value.length > 0

    console.log('資料完整性檢查:')
    console.log('- hasValidService:', hasValidService)
    console.log('- hasValidServiceType:', hasValidServiceType)
    console.log('- hasAvailableStaff:', hasAvailableStaff)

    // 如果關鍵資料缺失且不是編輯模式，跳轉回頁面1
    if (!hasValidService || !hasValidServiceType) {
        if (!isEditMode.value) {
            console.log('❌ 關鍵資料缺失，跳轉回頁面1')
            router.push({ name: 'service-list' })
            return
        } else {
            console.log('⚠️ 編輯模式下發現資料缺失，但允許繼續')
        }
    }

    console.log('=== onMounted 完成 ===')
})

// 電話或Email必填驗證器
function phoneOrEmailRequired(_: unknown, __: string, callback: ValidationCallback): void {
    const phoneOrEmailValidator = createPhoneOrEmailValidator(extraPersonForm.value)
    phoneOrEmailValidator(_, __, callback)
}

// 台灣手機號碼驗證器
function validatePhone(_: unknown, value: string, callback: ValidationCallback): void {
    validateTaiwanPhone(_, value, callback)
}

// Email格式驗證器
function validateEmail(_: unknown, value: string, callback: ValidationCallback): void {
    validateEmailFormat(_, value, callback)
}

// 額外預約人表單驗證規則
const extraPersonRules: FormRules = {
    name: [
        createRequiredRule('請輸入姓名', 'blur'),
        { min: 1, message: '姓名不能為空', trigger: 'blur' },
        createMaxLengthRule(VALIDATION_RULES.NAME_MAX_LENGTH, `姓名最多${VALIDATION_RULES.NAME_MAX_LENGTH}個字`, 'blur')
    ],
    phone: [
        { validator: phoneOrEmailRequired, trigger: 'blur' },
        { validator: validatePhone, trigger: 'blur' }
    ],
    email: [
        { validator: phoneOrEmailRequired, trigger: 'blur' },
        { validator: validateEmail, trigger: 'blur' }
    ]
}
</script>