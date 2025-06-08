<template>
  <PageContainer title="頁面3 - 品項確認頁" max-width="lg">
    <div v-if="bookingItems.length === 0" class="text-center py-8 text-gray-600">
      <p class="mb-4 text-base">您的預約清單是空的。</p>
      <el-button type="primary" @click="addNewItem" class="mt-4">開始新增預約</el-button>
    </div>

    <div
      v-else
      v-for="item in bookingItems"
      :key="item.id"
      class="w-full bg-gray-50 rounded-lg border border-gray-200 p-5 mb-5 shadow-sm"
    >
      <div class="mb-4 border-b border-gray-200 pb-3">
        <h2 class="text-lg font-semibold text-gray-800">預約內容與預約人資訊</h2>
      </div>

      <!-- Block 1 - Booking Details -->
      <div class="mb-4 relative pb-10">
        <div class="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 items-start">
          <span class="font-medium text-gray-600 text-sm">預約日期時間:</span>
          <span class="text-sm text-gray-800">{{ item.formattedDateTime }}</span>

          <span class="font-medium text-gray-600 text-sm">服務項目:</span>
          <span class="text-sm text-gray-800">{{ item.serviceName }}</span>

          <span class="font-medium text-gray-600 text-sm">服務人員:</span>
          <span class="text-sm text-gray-800">{{ item.staffName }}</span>

          <span class="font-medium text-gray-600 text-sm">總價格:</span>
          <span class="text-sm text-gray-800 font-bold text-orange-700">NT${{ item.price }}</span>
        </div>
        <el-button
          type="primary"
          size="small"
          @click="editItem(item.originalIndex)"
          class="absolute bottom-2 right-2"
          >編輯</el-button
        >
      </div>

      <!-- Black Divider Line -->
      <div style="border-top: 1px solid #666666; margin: 20px 0"></div>

      <!-- Block 2 - Booker Information -->
      <div class="pt-3 pb-10 relative">
        <h3 class="text-base font-semibold mb-3 text-gray-700">預約人資訊</h3>
        <div class="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 items-start">
          <span class="font-medium text-gray-600 text-sm">主要預約人:</span>
          <span class="text-sm text-gray-800">{{ item.mainPersonDisplay }}</span>

          <template v-if="item.extraPersonsDisplay && item.extraPersonsDisplay.length > 0">
            <span class="font-medium text-gray-600 text-sm">額外預約人:</span>
            <ul class="list-none pl-0 m-0">
              <li
                v-for="(personDisplay, idx) in item.extraPersonsDisplay"
                :key="idx"
                class="text-sm text-gray-800 mb-1"
              >
                {{ personDisplay }}
              </li>
            </ul>
          </template>
        </div>
        <el-button
          type="danger"
          size="small"
          @click="removeItem(item.originalIndex)"
          class="absolute bottom-2 right-2"
          >刪除</el-button
        >
      </div>
    </div>

    <div class="mt-6 flex flex-row gap-3 w-full" v-if="bookingItems.length > 0">
      <el-button
        class="flex-1 text-base py-3 bg-blue-500 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700"
        type="primary"
        @click="addNewItem"
        >新增預約項目</el-button
      >
      <el-button
        class="flex-1 text-base py-3 bg-blue-500 border-blue-500 text-white hover:bg-blue-700 hover:border-blue-700"
        type="primary"
        @click="goToCheckout"
        >前往結帳</el-button
      >
    </div>

    <!-- Process Interruption Warning Dialog -->
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      title="中斷流程警告"
      content="您確定要離開嗎？未儲存的資料將會遺失。"
      confirm-text="確定離開"
      cancel-text="取消"
      @confirm="handleConfirmLeave"
      @cancel="handleCancelLeave"
    />
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import { useServiceStore } from '@/stores/servicesStore'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageContainer from '@/components/PageContainer.vue'
import type { BookingData } from '@/stores/bookingStore'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const bookingStore = useBookingStore()
const serviceStore = useServiceStore()

const showConfirmDialog = ref(false)
let nextCallback: (() => void) | null = null

// Get booking items from store and add detailed information
const bookingItems = computed(() => {
  return bookingStore.bookingHistory.map((item: BookingData, index) => {
    const service = item.serviceId ? serviceStore.getServiceById(item.serviceId) : null
    const staff = item.selectedStaffId ? serviceStore.getStaffById(item.selectedStaffId) : null

    const dateStr = item.date ? item.date.toString() : new Date().toISOString()
    const date = new Date(dateStr)
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const formattedTime = item.timeSlot || ''

    const staffName = staff?.name || (staff as { staffName?: string })?.staffName || '未指定' // Reverted
    const itemPrice = staff?.price !== undefined ? staff.price : 0 // Prioritize staff.price, otherwise 0

    return {
      ...item,
      id: item.id || `temp-id-${index}`,
      originalIndex: index,
      serviceName: service ? service.name : '未知服務', // Reverted
      staffName: staffName,
      price: itemPrice,
      formattedDateTime: `${formattedDate} ${formattedTime}`,
      mainPersonDisplay: `${item.name} (${item.phone})`,
      extraPersonsDisplay: item.extraPersons.map((p, i) => {
        const contact = p.phone ? p.phone : p.email ? p.email : '無聯絡方式' // Reverted
        return `${i + 1}. ${p.name} (${contact})`
      }),
    }
  })
})

function editItem(originalIndex: number) {
  const itemToEdit = bookingStore.bookingHistory[originalIndex]

  if (itemToEdit) {
    // Populate formData with the item to be edited
    bookingStore.formData = { ...itemToEdit }

    // Set edit mode and index
    bookingStore.setEditingItemIndex(originalIndex)

    // Set selected service (important: let page 2 know the currently selected service)
    if (itemToEdit.serviceId) {
      bookingStore.setSelectedService(itemToEdit.serviceId)
    }

    // Navigate back to PageBookingForm
    router
      .push({ name: 'booking-form' })
      .then(() => {})
      .catch((error) => {
        console.error('❌ 跳轉失敗:', error) // Reverted
      })
  } else {
    ElMessage.error('找不到要編輯的項目') // Reverted
  }
}

async function removeItem(originalIndex: number) {
  try {
    await ElMessageBox.confirm('確定要刪除此預約項目嗎？', '確認刪除', { // Reverted
      confirmButtonText: '確定', // Reverted
      cancelButtonText: '取消', // Reverted
      type: 'warning',
    })
    bookingStore.removeBookingFromHistory(originalIndex)
    ElMessage.success('項目已刪除') // Reverted
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('刪除失敗') // Reverted
    }
  }
}

function addNewItem() {
  // Completely reset all state
  bookingStore.resetAllState()

  // Navigate to page 1
  router
    .push({ name: 'service-list' })
    .then(() => {})
    .catch((error) => {
      console.error('❌ 跳轉失敗:', error) // Reverted
    })
}

function goToCheckout() {
  ElMessage.info('「前往結帳」功能尚未開放') // Reverted
}

onBeforeRouteLeave((to, from, next) => {
  // If navigating to service-list (add item) or booking-form (edit item), allow navigation
  if (to.name === 'service-list' || to.name === 'booking-form') {
    next()
    return
  }

  // Otherwise, if there are booking items, show confirmation dialog
  if (bookingItems.value.length > 0) {
    showConfirmDialog.value = true
    nextCallback = () => {
      bookingStore.clearCart()
      next()
    }
    next(false)
  } else {
    next()
  }
})

function handleConfirmLeave() {
  showConfirmDialog.value = false
  if (nextCallback) {
    nextCallback()
    nextCallback = null
  }
}

function handleCancelLeave() {
  showConfirmDialog.value = false
  nextCallback = null
}
</script>
