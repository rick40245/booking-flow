<template>
    <PageContainer title="頁面3 - 品項確認頁" max-width="lg">
        <div v-if="bookingItems.length === 0" class="empty-cart">
            <p>您的預約清單是空的。</p>
            <el-button type="primary" @click="addNewItem" class="mt-4">開始新增預約</el-button>
        </div>

        <div v-else v-for="item in bookingItems" :key="item.id" class="summary-item">
            <div class="item-header">
                <h2 class="item-title">預約內容與預約人資訊</h2>
            </div>

            <!-- 區塊1 - 預約內容 -->
            <div class="summary-section booking-details-section">
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">預約日期時間:</span>
                        <span class="detail-value">{{ item.formattedDateTime }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">服務項目:</span>
                        <span class="detail-value">{{ item.serviceName }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">服務人員:</span>
                        <span class="detail-value">{{ item.staffName }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">總價格:</span>
                        <span class="detail-value price-value">NT${{ item.price }}</span>
                    </div>
                </div>
                <el-button type="primary" size="small" @click="editItem(item.originalIndex)"
                    class="edit-button">編輯</el-button>
            </div>

            <!-- 區塊2 - 預約人資訊 -->
            <div class="summary-section person-info-section">
                <h3 class="section-subtitle">預約人資訊</h3>
                <div class="detail-item">
                    <span class="detail-label">主要預約人:</span>
                    <span class="detail-value">{{ item.mainPersonDisplay }}</span>
                </div>
                <div v-if="item.extraPersonsDisplay && item.extraPersonsDisplay.length > 0" class="detail-item">
                    <span class="detail-label">額外預約人:</span>
                    <ul class="extra-persons-list">
                        <li v-for="(personDisplay, idx) in item.extraPersonsDisplay" :key="idx"
                            class="extra-person-value">
                            {{ personDisplay }}
                        </li>
                    </ul>
                </div>
                <el-button type="danger" size="small" @click="removeItem(item.originalIndex)"
                    class="remove-button-bottom">刪除</el-button>
            </div>
        </div>

        <div class="page-actions" v-if="bookingItems.length > 0">
            <el-button class="action-button" type="primary" @click="addNewItem">新增預約項目</el-button>
            <el-button class="action-button" type="primary" @click="goToCheckout">前往結帳</el-button>
        </div>

        <!-- 流程中斷警告 Dialog -->
        <ConfirmDialog v-model:visible="showConfirmDialog" title="中斷流程警告" content="您確定要離開嗎？未儲存的資料將會遺失。"
            confirm-text="確定離開" cancel-text="取消" @confirm="handleConfirmLeave" @cancel="handleCancelLeave" />
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

// 從 store 獲取預約項目，並加入詳細資訊
const bookingItems = computed(() => {
    return bookingStore.bookingHistory.map((item: BookingData, index) => {
        const service = item.serviceId ? serviceStore.getServiceById(item.serviceId) : null
        const staff = item.selectedStaffId ? serviceStore.getStaffById(item.selectedStaffId) : null

        const dateStr = item.date ? item.date.toString() : new Date().toISOString()
        const date = new Date(dateStr)
        const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
        const formattedTime = item.timeSlot || ''

        const staffName = staff?.name || (staff as any)?.staffName || '未指定'
        const itemPrice = staff?.price !== undefined ? staff.price : 0 // 優先使用 staff.price，否則為 0

        return {
            ...item,
            id: item.id || `temp-id-${index}`,
            originalIndex: index,
            serviceName: service ? service.name : '未知服務',
            staffName: staffName,
            price: itemPrice,
            formattedDateTime: `${formattedDate} ${formattedTime}`,
            mainPersonDisplay: `${item.name} (${item.phone})`,
            extraPersonsDisplay: item.extraPersons.map((p, i) => {
                let contact = p.phone ? p.phone : (p.email ? p.email : '無聯絡方式')
                return `${i + 1}. ${p.name} (${contact})`
            })
        }
    })
})

function editItem(originalIndex: number) {
    console.log('=== editItem 被呼叫 ===')
    console.log('originalIndex:', originalIndex)
    console.log('bookingHistory length:', bookingStore.bookingHistory.length)

    const itemToEdit = bookingStore.bookingHistory[originalIndex]
    console.log('itemToEdit:', itemToEdit)

    if (itemToEdit) {
        // 將要編輯的項目資料填充到 formData
        bookingStore.formData = { ...itemToEdit }
        console.log('formData updated:', bookingStore.formData)

        // 設定編輯模式和索引
        bookingStore.setEditingItemIndex(originalIndex)
        console.log('editing index set to:', originalIndex)

        // 設定選中的服務（重要：讓頁面2知道當前選擇的服務）
        if (itemToEdit.serviceId) {
            bookingStore.setSelectedService(itemToEdit.serviceId)
            console.log('selectedService set to:', itemToEdit.serviceId)
        }

        // 跳轉回 PageBookingForm
        console.log('準備跳轉到 booking-form')
        router.push({ name: 'booking-form' }).then(() => {
            console.log('✅ 成功跳轉到 booking-form')
        }).catch((error) => {
            console.error('❌ 跳轉失敗:', error)
        })
    } else {
        console.error('❌ 找不到要編輯的項目')
        ElMessage.error('找不到要編輯的項目')
    }
}

async function removeItem(originalIndex: number) {
    console.log('=== removeItem 被呼叫 ===')
    console.log('originalIndex:', originalIndex)

    try {
        await ElMessageBox.confirm(
            '確定要刪除此預約項目嗎？',
            '確認刪除',
            {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        console.log('用戶確認刪除')
        bookingStore.removeBookingFromHistory(originalIndex)
        console.log('項目已從 bookingHistory 移除')
        ElMessage.success('項目已刪除')
    } catch (error) {
        console.log('用戶取消刪除或發生錯誤:', error)
        if (error !== 'cancel') {
            ElMessage.error('刪除失敗')
        }
    }
}

function addNewItem() {
    console.log('=== addNewItem 被呼叫 ===')

    // 完全重置所有狀態
    bookingStore.resetAllState()

    // 跳轉到頁面1
    console.log('準備跳轉到 service-list')
    router.push({ name: 'service-list' }).then(() => {
        console.log('✅ 成功跳轉到 service-list')
    }).catch((error) => {
        console.error('❌ 跳轉失敗:', error)
    })
}

function goToCheckout() {
    ElMessage.info('「前往結帳」功能尚未開放')
}

onBeforeRouteLeave((to, from, next) => {
    // 如果是跳轉到 service-list（新增項目）或 booking-form（編輯項目），允許跳轉
    if (to.name === 'service-list' || to.name === 'booking-form') {
        console.log('✅ 允許跳轉到:', to.name)
        next()
        return
    }

    // 其他情況下，如果有預約項目，顯示確認對話框
    if (bookingItems.value.length > 0) {
        console.log('⚠️ 有預約項目，顯示確認對話框')
        showConfirmDialog.value = true
        nextCallback = () => {
            bookingStore.clearCart()
            next()
        }
        next(false)
    } else {
        console.log('✅ 沒有預約項目，允許跳轉')
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
<style scoped>
.empty-cart {
    text-align: center;
    padding: 32px 0;
    color: #666;
}

.empty-cart p {
    margin-bottom: 16px;
    font-size: 16px;
}

.summary-item {
    width: 100%;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #eee;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.item-header {
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
}

.item-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.summary-section {
    margin-bottom: 16px;
    position: relative;
}

.booking-details-section {
    padding-bottom: 40px;
    /* 增加底部空間給編輯按鈕 */
}

.detail-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: start;
    /* 改為 start 對齊 */
}

.detail-item {
    display: contents;
}

.detail-label {
    font-weight: 500;
    color: #555;
    font-size: 14px;
    text-align: left;
    /* 改為靠左對齊 */
    padding-right: 8px;
}

.detail-value {
    font-size: 14px;
    color: #333;
    word-break: break-all;
}

.price-value {
    font-weight: bold;
    color: #E65100;
}

.edit-button {
    position: absolute;
    bottom: 8px;
    /* 放在區塊底部 */
    right: 8px;
    /* 放在區塊右側 */
}

.person-info-section {
    padding-top: 12px;
    padding-bottom: 40px;
    /* 增加底部空間給刪除按鈕 */
    border-top: 1px dashed #ddd;
    margin-top: 16px;
}

.section-subtitle {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #444;
}

/* 預約人資訊區塊內的 detail-item 也使用 grid */
.person-info-section .detail-item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    margin-bottom: 8px;
}

.person-info-section .detail-label {
    text-align: left;
    padding-right: 0;
}

.extra-persons-list {
    list-style-type: none;
    padding-left: 0;
    margin-top: 4px;
}

.extra-person-value {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    padding-left: 1em;
    text-indent: -1em;
}

.remove-button-bottom {
    position: absolute;
    bottom: 8px;
    /* 放在區塊底部 */
    right: 8px;
    /* 放在區塊右側 */
}

.page-actions {
    margin-top: 24px;
    display: flex;
    flex-direction: row;
    /* 改為水平排列 */
    gap: 12px;
    width: 100%;
}

.action-button {
    flex: 1;
    /* 各占一半空間 */
    font-size: 16px;
    padding: 12px 0;
    background: #409EFF;
    /* Element Plus 藍色 */
    border-color: #409EFF;
    color: white;
}

.action-button:hover {
    background: #337ECC;
    /* 深一點的藍色 */
    border-color: #337ECC;
}

.page-actions .el-button {
    font-size: 16px;
    padding: 12px 0;
}

.mt-4 {
    margin-top: 16px;
}

:deep(.el-dialog__title) {
    font-weight: 600;
}

:deep(.el-dialog__body) {
    font-size: 15px;
}
</style>