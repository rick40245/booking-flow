<template>
  <PageContainer title="頁面1 - 服務項目列表頁" max-width="lg">
    <div class="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-6 md:justify-center">
      <ServiceCard
        v-for="serviceType in serviceTypes"
        :key="serviceType.type"
        :service="serviceType"
        :isSelected="selectedServiceType === serviceType.type"
        @select="handleSelect"
      />
    </div>
    <ConfirmDialog
      v-model:visible="showConfirm"
      @confirm="handleLeave"
      @cancel="showConfirm = false"
    />
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

// Group services by type
const serviceTypes = computed(() => {
  const groups = new Map()

  serviceStore.services.forEach((service) => {
    if (!groups.has(service.serviceType)) {
      groups.set(service.serviceType, {
        type: service.serviceType,
        id: service.id, // Use the ID of the first service as representative
        name: service.name,
        staffCount: 0,
        staffList: [],
        minPrice: Infinity,
        maxPrice: 0,
      })
    }

    const group = groups.get(service.serviceType)

    // Calculate information for all service staff under this service type
    service.staffIds.forEach((staffId) => {
      const staff = serviceStore.getStaffById(staffId)
      if (staff) {
        group.staffCount++
        group.staffList.push(staff.name)
        group.minPrice = Math.min(group.minPrice, staff.price)
        group.maxPrice = Math.max(group.maxPrice, staff.price)
      }
    })
  })

  // Handle cases where there is only one service staff
  groups.forEach((group) => {
    if (group.minPrice === Infinity) {
      group.minPrice = 0
    }
  })

  return Array.from(groups.values())
})

const selectedServiceType = ref(null)
const showConfirm = ref(false)

function handleSelect(serviceTypeId: number) {
  // Set the selected service to the store (using the ID of the first service of this type)
  bookingStore.setSelectedService(serviceTypeId)

  // Navigate to page 2
  router.push({ name: 'booking-form' })
}

function handleLeave() {
  // Handle leaving the service
}
</script>
