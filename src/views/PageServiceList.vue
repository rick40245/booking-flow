<template>
    <PageContainer title="頁面1 - 服務項目列表頁" max-width="lg">
        <div class="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6 md:justify-center">
            <ServiceCard v-for="serviceType in serviceTypes" :key="serviceType.type" :service="serviceType"
                :isSelected="selectedServiceType === serviceType.type" @select="handleSelect" />
        </div>
        <ConfirmDialog v-model:visible="showConfirm" @confirm="handleLeave" @cancel="showConfirm = false" />
    </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ServiceCard from '../components/ServiceCard.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import PageContainer from '../components/PageContainer.vue'
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

</script>