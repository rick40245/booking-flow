<template>
    <div class="min-h-screen w-full flex items-center justify-center py-6 px-2" style="background:#f5f5f5;">
        <div class="w-full max-w-md flex flex-col items-center">
            <h1 class="title">頁面1 - 服務項目列表頁</h1>
            <el-form :model="{ search }" class="w-full mb-4">
                <el-form-item>
                    <el-input v-model="search" placeholder="搜尋服務項目..." prefix-icon="el-icon-search" clearable />
                </el-form-item>
            </el-form>
            <div class="service-list">
                <ServiceCard v-for="serviceType in filteredServiceTypes" :key="serviceType.type" :service="serviceType"
                    :isSelected="selectedServiceType === serviceType.type" @select="handleSelect" />
                <div v-if="filteredServiceTypes.length === 0" class="empty-state">
                    <el-empty description="沒有找到符合的服務" />
                </div>
            </div>
            <ConfirmDialog v-model:visible="showConfirm" @confirm="handleLeave" @cancel="showConfirm = false" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ServiceCard from '../components/ServiceCard.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useRouter } from 'vue-router'
import { useServiceStore } from '@/stores/servicesStore'
import { useBookingStore } from '@/stores/bookingStore'

const router = useRouter()
const serviceStore = useServiceStore()
const bookingStore = useBookingStore()

// 將服務按類型分組
const serviceTypes = computed(() => {
    const groups = new Map()

    serviceStore.services.forEach(service => {
        if (!groups.has(service.serviceType)) {
            groups.set(service.serviceType, {
                type: service.serviceType,
                id: service.id, // 使用第一個服務的ID作為代表
                name: service.name,
                staffCount: 0,
                staffList: [],
                minPrice: Infinity,
                maxPrice: 0
            })
        }

        const group = groups.get(service.serviceType)

        // 計算該服務類型下所有服務人員的資訊
        service.staffIds.forEach(staffId => {
            const staff = serviceStore.getStaffById(staffId)
            if (staff) {
                group.staffCount++
                group.staffList.push(staff.name)
                group.minPrice = Math.min(group.minPrice, staff.price)
                group.maxPrice = Math.max(group.maxPrice, staff.price)
            }
        })
    })

    // 處理只有一個服務人員的情況
    groups.forEach(group => {
        if (group.minPrice === Infinity) {
            group.minPrice = 0
        }
    })

    return Array.from(groups.values())
})

const search = ref('')
const filteredServiceTypes = computed(() => {
    if (!search.value) return serviceTypes.value
    return serviceTypes.value.filter(serviceType =>
        serviceType.name.includes(search.value) ||
        serviceType.staffList.some((staff: string) => staff.includes(search.value))
    )
})

const selectedServiceType = ref(null)
const showConfirm = ref(false)

function handleSelect(serviceTypeId: number) {
    // 設定選中的服務到 store (使用該類型的第一個服務ID)
    bookingStore.setSelectedService(serviceTypeId)

    // 跳轉到頁面2
    router.push({ name: 'booking-form' })
}

function handleLeave() {
    // Handle leaving the service
}

console.log('serviceTypes:', serviceTypes.value)
console.log('filteredServiceTypes:', filteredServiceTypes.value)
</script>

<style scoped>
.service-list-outer {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0;
}

.service-list-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
    padding: 24px 16px 32px 16px;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
}

.service-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 12px;
}

.empty-state {
    margin-top: 32px;
}

.mt-4 {
    margin-top: 16px;
}

@media (min-width: 768px) {
    .service-list-card {
        max-width: 700px;
        padding: 32px 32px 40px 32px;
    }

    .service-list {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 24px;
        justify-content: center;
    }
}
</style>