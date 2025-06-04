<template>
    <div class="service-card" :class="{ 'selected': isSelected }">
        <div class="service-info">
            <div class="service-title">{{ service.name }}</div>
            <div v-if="service.staffCount" class="service-staff-count">
                {{ service.staffCount }} 位服務人員
            </div>
            <div v-if="service.minPrice && service.maxPrice" class="service-price">
                價格: ${{ service.minPrice === service.maxPrice ? service.minPrice : `${service.minPrice} -
                ${service.maxPrice}` }} / 小時
            </div>
            <div v-else-if="service.price" class="service-price">價格: ${{ service.price }} / 小時</div>
            <div v-if="service.staff" class="service-staff">服務人員: {{ service.staff }}</div>
            <div v-if="service.time" class="service-time">可預約: {{ service.time }}</div>
            <div v-if="service.staffList && service.staffList.length > 0" class="staff-list">
                服務人員: {{ service.staffList.join('、') }}
            </div>
        </div>
        <el-button type="submit" @click="emit('select', service.id)">
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

const props = defineProps<{
    service: ServiceProps
    isSelected: boolean
}>()
const emit = defineEmits(['select'])
function toggleSelect() {
    emit('select', props.service)
}
</script>
<style scoped>
.el-card.service-card {
    background: #fff !important;
    border-radius: 16px;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 32px;
    padding: 24px 20px;
    color: #222;
}

.font-bold {
    color: #222;
}

.service-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
    padding: 18px 16px;
    transition: box-shadow 0.2s;
    gap: 12px;
}

.service-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.service-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 2px;
}

.service-price,
.service-staff,
.service-staff-count,
.service-time,
.staff-list {
    font-size: 14px;
    color: #333;
}

.service-staff-count {
    color: #2196F3;
    font-weight: 500;
}

.staff-list {
    font-size: 13px;
    color: #666;
    line-height: 1.4;
}

.selected {
    box-shadow: 0 2px 8px rgba(60, 179, 113, 0.15);
}

@media (min-width: 768px) {
    .service-card {
        min-width: 280px;
        max-width: 320px;
    }
}
</style>