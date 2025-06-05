<template>
    <div :class="[
        'flex justify-between items-end bg-gray-100 rounded-xl shadow-sm p-4.5 transition-shadow gap-3 md:min-w-70 md:max-w-80',
        isSelected ? 'shadow-lg shadow-blue-200' : ''
    ]">
        <div class="flex flex-col gap-1">
            <div class="text-base font-bold mb-0.5">{{ service.name }}</div>
            <div v-if="service.staffCount" class="text-sm text-blue-500 font-medium">
                {{ service.staffCount }} 位服務人員
            </div>
            <div v-if="service.minPrice && service.maxPrice" class="text-sm text-gray-800">
                價格: ${{ service.minPrice === service.maxPrice ? service.minPrice : `${service.minPrice} -
                ${service.maxPrice}` }} / 小時
            </div>
            <div v-else-if="service.price" class="text-sm text-gray-800">價格: ${{ service.price }} / 小時</div>
            <div v-if="service.staff" class="text-sm text-gray-800">服務人員: {{ service.staff }}</div>
            <div v-if="service.time" class="text-sm text-gray-800">可預約: {{ service.time }}</div>
            <div v-if="service.staffList && service.staffList.length > 0" class="text-xs text-gray-600 leading-tight">
                服務人員: {{ service.staffList.join('、') }}
            </div>
        </div>
        <el-button 
            type="primary" 
            @click="emit('select', service.id)" 
            class="bg-blue-500! border-blue-500! text-white! hover:bg-blue-700! hover:border-blue-700! focus:bg-blue-700! focus:border-blue-700!"
        >
            {{ isSelected ? '已選擇' : '選擇' }}
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface ServiceProps {
    id: number
    name: string
    staff?: string
    price?: number
    time?: string
    type?: string
    staffCount?: number
    staffList?: string[]
    minPrice?: number
    maxPrice?: number
}

defineProps<{
    service: ServiceProps
    isSelected: boolean
}>()
const emit = defineEmits(['select'])
</script>