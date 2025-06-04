<template>
    <div class="page-container">
        <div class="content-wrapper">
            <h1 class="title">頁面2 - 資料填寫頁</h1>

            <!-- 已選擇服務項目卡片 -->
            <div class="selected-service-card">
                <p class="service-name">已選擇: {{ selectedServiceName }}</p>
                <p class="service-price">
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
            <div class="form-section">
                <div class="section-title">預約資訊</div>

                <el-form :model="bookingForm" :rules="formRules" ref="formRef" label-position="left" label-width="80px">
                    <!-- 預約人數 -->
                    <el-form-item label="預約人數" prop="totalPeople">
                        <el-input-number v-model="bookingForm.totalPeople" :min="1" :max="5" size="default"
                            style="width: 100%;" />
                    </el-form-item>

                    <!-- 預約日期 -->
                    <el-form-item label="預約日期" prop="date">
                        <el-date-picker v-model="bookingForm.date" type="date" placeholder="選擇日期"
                            :disabled-date="disabledDate" size="default" style="width: 100%;" />
                    </el-form-item>

                    <!-- 選擇服務人員 -->
                    <div class="staff-selection-section">
                        <div class="staff-selection-label">選擇服務人員</div>
                        <div v-if="availableStaff.length > 0" class="staff-cards-grid">
                            <div v-for="staff in availableStaff" :key="staff.serviceId" :class="[
                                'staff-card',
                                bookingForm.selectedStaffId === staff.staffId ? 'selected' : ''
                            ]" @click="selectStaff(staff)">
                                <div class="staff-name">{{ staff.staffName }}</div>
                                <div class="staff-work-time">{{ staff.workTime }}</div>
                                <div class="staff-price">${{ staff.price }}</div>
                            </div>
                        </div>
                        <div v-else class="no-staff-message">
                            無可用服務人員
                        </div>
                    </div>

                    <!-- 可預約時段 -->
                    <div class="time-slots-section">
                        <div class="time-slots-label">
                            可預約時段:
                            <span v-if="!bookingForm.date" class="text-gray-400">(請先選擇日期)</span>
                            <span v-else-if="!bookingForm.selectedStaffId" class="text-orange-500">(請先選擇服務人員)</span>
                            <span v-else-if="availableSlots.length === 0" class="text-red-500">(當日無可用時段)</span>
                        </div>
                        <div v-if="bookingForm.date && bookingForm.selectedStaffId && availableSlots.length > 0"
                            class="time-slots-grid">
                            <button v-for="slot in availableSlots" :key="slot" type="button" :class="[
                                'time-slot-btn',
                                bookingForm.timeSlot === slot ? 'selected' : ''
                            ]" @click="selectTimeSlot(slot)">
                                {{ slot }}
                            </button>
                        </div>
                        <div v-else-if="!bookingForm.date" class="time-slots-placeholder">
                            請先選擇預約日期以查看可用時段
                        </div>
                        <div v-else-if="!bookingForm.selectedStaffId" class="time-slots-placeholder">
                            請先選擇服務人員以查看可用時段
                        </div>
                    </div>

                    <!-- 姓名 -->
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="bookingForm.name" maxlength="20" show-word-limit size="default" />
                    </el-form-item>

                    <!-- 電話 -->
                    <el-form-item label="電話" prop="phone">
                        <el-input v-model="bookingForm.phone" placeholder="09xxxxxxxx" size="default" />
                    </el-form-item>

                    <!-- Email -->
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="bookingForm.email" type="email" size="default" />
                    </el-form-item>
                </el-form>
            </div>

            <!-- 額外預約人資訊 -->
            <div v-if="bookingForm.totalPeople > 1" class="form-section extra-person-section">
                <div class="section-title">
                    額外預約人資訊
                    <span class="person-count-info">
                        ({{ extraPersons.length }}/{{ bookingForm.totalPeople - 1 }})
                    </span>
                </div>

                <div class="add-person-container">
                    <el-button type="primary" size="default" @click="openExtraPersonDialog"
                        :disabled="isAddPersonDisabled" class="add-person-btn">
                        新增預約人
                    </el-button>
                    <div v-if="isAddPersonDisabled" class="add-person-hint">
                        <el-text type="info" size="small">
                            已達預約人數上限 ({{ bookingForm.totalPeople }}人)
                        </el-text>
                    </div>
                </div>

                <!-- 額外預約人列表 -->
                <div v-if="extraPersons.length > 0" class="extra-persons-list">
                    <div v-for="(person, index) in extraPersons" :key="index" class="extra-person-item">
                        <div class="person-info">
                            <div class="person-field">
                                <label>姓名</label>
                                <div class="person-value">{{ person.name }}</div>
                            </div>
                            <div class="person-field">
                                <label>聯絡方式</label>
                                <div class="person-value">
                                    <span v-if="person.phone">{{ person.phone }}</span>
                                    <span v-else-if="person.email">{{ person.email }}</span>
                                    <span v-else class="no-contact">未提供</span>
                                </div>
                            </div>
                        </div>
                        <el-button type="danger" size="small" @click="removeExtraPerson(index)" class="remove-btn">
                            移除
                        </el-button>
                    </div>
                </div>

                <!-- 空狀態提示 -->
                <div v-else class="empty-extra-persons">
                    <el-text type="info">請點選上方按鈕新增額外預約人資訊</el-text>
                </div>
            </div>

            <!-- 提交按鈕區域 -->
            <div class="submit-container">
                <el-button type="warning" size="large" @click="submitForm" class="submit-btn">
                    確認資料並加入購物車
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
                    <div class="contact-info-hint">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useServiceStore } from '@/stores/servicesStore'
import { useBookingStore } from '@/stores/bookingStore'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const serviceStore = useServiceStore()
const bookingStore = useBookingStore()

const formRef = ref<FormInstance>()
const extraPersonFormRef = ref<FormInstance>()
const extraPersonDialogVisible = ref(false)
const isSubmittingExtraPerson = ref(false)
const showConfirm = ref(false)
let nextRoute: any = null

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

// 目前選中的服務類型
const selectedServiceType = computed(() => {
    if (!bookingStore.selectedServiceId) return null
    return serviceStore.getServiceTypeById(bookingStore.selectedServiceId)
})

// 根據服務類型獲取可用的服務人員
const availableStaff = computed(() => {
    if (!selectedServiceType.value) return []
    return serviceStore.getStaffByServiceType(selectedServiceType.value)
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
        const prices = availableStaff.value.map(staff => staff.price)
        if (prices.length === 0) return 0
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        return minPrice === maxPrice ? minPrice : `${minPrice}-${maxPrice}`
    }
})

// 已選擇的服務（根據服務人員）
const selectedService = computed(() => {
    if (!bookingForm.value.selectedStaffId) return null
    const staff = serviceStore.getStaffById(bookingForm.value.selectedStaffId)
    return staff
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
        { required: true, message: '請選擇預約人數', trigger: 'change' }
    ],
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' },
        { max: 20, message: '姓名最多20個字', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '請輸入電話', trigger: 'blur' },
        { pattern: /^09\d{8}$/, message: '請輸入正確的台灣手機號碼格式', trigger: 'blur' }
    ],
    date: [
        { required: true, message: '請選擇預約日期', trigger: 'change' }
    ]
}

// 禁用今日之前的日期
function disabledDate(date: Date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
}

// 選擇服務人員
function selectStaff(staff: any) {
    bookingStore.setSelectedStaff(staff.staffId)
}

// 選擇時段 - 直接修改 store 的 formData
function selectTimeSlot(slot: string) {
    bookingStore.formData.timeSlot = slot
}

// 開啟額外預約人Dialog
function openExtraPersonDialog() {
    console.log('openExtraPersonDialog called')
    console.log('isAddPersonDisabled:', isAddPersonDisabled.value)
    console.log('extraPersons.length:', extraPersons.value.length)
    console.log('totalPeople:', bookingForm.value.totalPeople)
    extraPersonDialogVisible.value = true
    console.log('extraPersonDialogVisible set to:', extraPersonDialogVisible.value)
}

// 新增額外預約人
function addExtraPerson(person: { name: string, phone: string, email: string }) {
    bookingStore.formData.extraPersons.push(person)
}

// 處理確認新增額外預約人
function handleConfirmExtraPerson() {
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
function handleCancelExtraPerson() {
    console.log('handleCancelExtraPerson called')
    extraPersonDialogVisible.value = false
    resetExtraPersonForm()
}

// 重置額外預約人表單
function resetExtraPersonForm() {
    extraPersonForm.value = { name: '', phone: '', email: '' }
    extraPersonFormRef.value?.clearValidate()
}

// 移除額外預約人
function removeExtraPerson(index: number) {
    bookingStore.formData.extraPersons.splice(index, 1)
}

// 提交表單
function submitForm() {
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
            // 檢查額外預約人數量
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

            // 儲存到 Pinia store
            bookingStore.setBookingData({
                ...bookingForm.value,
                extraPersons: extraPersons.value,
                serviceId: bookingStore.selectedServiceId // 使用已選擇的服務類型ID
            })

            // 跳轉到頁面3
            router.push({ name: 'booking-summary' })
        }
    })
}

// 處理離開頁面
function handleLeave() {
    bookingStore.clear()
    showConfirm.value = false
    router.push({ name: 'service-list' })
}

// 路由守衛 - 檢查是否有表單資料
onBeforeRouteLeave((to, from, next) => {
    if (bookingStore.hasFormData) {
        showConfirm.value = true
        nextRoute = next
        return false // 阻止導航
    } else {
        next()
    }
})

// 處理 confirm dialog 的響應
watch(showConfirm, (val) => {
    if (!val && nextRoute) {
        nextRoute(false) // 取消導航
        nextRoute = null
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
    console.log('Current bookingStore.selectedServiceId:', bookingStore.selectedServiceId)
    console.log('Selected service type:', selectedServiceType.value)
    console.log('Available staff:', availableStaff.value)
    console.log('Restored form data:', bookingForm.value)
    console.log('Selected service name:', selectedServiceName.value)
    console.log('Selected service price:', selectedServicePrice.value)

    // 如果沒有選中的服務，跳回頁面1
    if (!bookingStore.selectedServiceId) {
        console.log('No selected service, redirecting to service-list')
        router.push({ name: 'service-list' })
    }
})

// 計算新增額外預約人的限制
const isAddPersonDisabled = computed(() => {
    return extraPersons.value.length >= bookingForm.value.totalPeople - 1
})

// 額外預約人表單
const extraPersonForm = ref({
    name: '',
    phone: '',
    email: ''
})

// 電話或Email必填驗證器
function phoneOrEmailRequired(_: any, __: string, callback: (error?: Error) => void) {
    const hasPhone = extraPersonForm.value.phone.trim() !== ''
    const hasEmail = extraPersonForm.value.email.trim() !== ''

    if (!hasPhone && !hasEmail) {
        callback(new Error('電話或Email必須至少填寫一項'))
    } else {
        callback()
    }
}

// 台灣手機號碼驗證器
function validatePhone(_: any, value: string, callback: (error?: Error) => void) {
    if (value && !/^09\d{8}$/.test(value)) {
        callback(new Error('請輸入正確的台灣手機號碼格式'))
    } else {
        callback()
    }
}

// Email格式驗證器
function validateEmail(_: any, value: string, callback: (error?: Error) => void) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        callback(new Error('請輸入正確的Email格式'))
    } else {
        callback()
    }
}

// 額外預約人表單驗證規則
const extraPersonRules: FormRules = {
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' },
        { min: 1, message: '姓名不能為空', trigger: 'blur' },
        { max: 20, message: '姓名最多20個字', trigger: 'blur' }
    ],
    phone: [
        { validator: phoneOrEmailRequired, trigger: ['blur', 'change'] },
        { validator: validatePhone, trigger: 'blur' }
    ],
    email: [
        { validator: phoneOrEmailRequired, trigger: ['blur', 'change'] },
        { validator: validateEmail, trigger: 'blur' }
    ]
}
</script>

<style scoped>
.page-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background: #f5f5f5;
}

.content-wrapper {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
}

.title {
    color: #222;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 16px;
    text-align: center;
}

.selected-service-card {
    background: #e8f4fd;
    border: 1px solid #b3d7f0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 20px;
}

.service-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 4px 0;
    color: #333;
}

.service-price {
    font-size: 14px;
    margin: 0;
    color: #333;
}

.form-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 16px;
    color: #333;
}

/* 服務人員選擇區塊 */
.staff-selection-section {
    margin-bottom: 16px;
}

.staff-selection-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.staff-cards-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
}

.staff-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
}

.staff-card:hover {
    border-color: #2196F3;
    background: #f8fafe;
}

.staff-card.selected {
    border-color: #2196F3;
    background: #e3f2fd;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.staff-name {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
}

.staff-work-time {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.staff-price {
    font-size: 13px;
    color: #FF5722;
    font-weight: 600;
}

.no-staff-message {
    text-align: center;
    color: #999;
    font-size: 13px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px dashed #ddd;
}

.time-slots-section {
    margin-bottom: 16px;
}

.time-slots-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}

.time-slots-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.time-slots-placeholder {
    text-align: center;
    color: #999;
    font-size: 13px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px dashed #ddd;
}

.time-slot-btn {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 6px;
    padding: 8px 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.time-slot-btn:hover {
    border-color: #4CAF50;
}

.time-slot-btn.selected {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

.extra-person-section {
    margin-bottom: 20px;
}

.add-person-container {
    margin-bottom: 12px;
}

.add-person-btn {
    width: 100%;
    background: #2196F3;
    border-color: #2196F3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.add-person-hint {
    margin-top: 8px;
    text-align: center;
}

.extra-persons-list {
    margin-bottom: 12px;
}

.extra-person-item {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.person-info {
    flex: 1;
}

.person-field {
    margin-bottom: 6px;
}

.person-field label {
    font-size: 12px;
    color: #666;
    display: block;
    margin-bottom: 2px;
}

.person-value {
    font-size: 13px;
    color: #333;
}

.remove-btn {
    margin-left: 8px;
    min-width: 60px;
}

.submit-container {
    position: sticky;
    bottom: 0;
    padding: 16px;
    background: #fff;
    border-top: 1px solid #eee;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background: #FF5722;
    border-color: #FF5722;
    font-size: 16px;
    font-weight: 600;
}

/* Element Plus 表單樣式覆寫 */
:deep(.el-form-item__label) {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

:deep(.el-input__inner) {
    font-size: 14px;
}

:deep(.el-input-number) {
    width: 100%;
}

.person-count-info {
    font-size: 12px;
    color: #666;
    font-weight: normal;
}

.no-contact {
    color: #999;
    font-style: italic;
}

.empty-extra-persons {
    text-align: center;
    color: #999;
    font-size: 13px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px dashed #ddd;
}

.add-person-btn:disabled {
    background: #d1d5db;
    border-color: #d1d5db;
    cursor: not-allowed;
}

/* 額外預約人對話框樣式 */
.contact-info-hint {
    margin-top: -8px;
    margin-bottom: 16px;
    padding-left: 4px;
}
</style>