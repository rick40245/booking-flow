<template>
    <div class="summary-outer">
        <div class="summary-card">
            <h1 class="title">頁面3 - 品項確認頁</h1>
            <div v-for="(item, idx) in bookingItems" :key="idx" class="summary-item">
                <div class="summary-section">
                    <div class="summary-label">預約內容</div>
                    <div>預約日期與時間: {{ item.date }} {{ item.slot }}</div>
                    <div>服務項目名稱: {{ item.serviceName }}</div>
                    <div>服務人員名稱: {{ item.staff }}</div>
                    <div>總價格: ${{ item.price }}</div>
                </div>
                <div class="summary-section">
                    <div class="summary-label">預約人資訊</div>
                    <div>主要預約人: {{ item.mainPerson.name }} ({{ item.mainPerson.phone }})</div>
                    <div v-if="item.extraPersons.length > 0">
                        額外預約人:
                        <ul>
                            <li v-for="(p, i) in item.extraPersons" :key="i">{{ i + 1 }}. {{ p.name }} ({{ p.phone ||
                                p.email }})</li>
                        </ul>
                    </div>
                </div>
                <div class="summary-actions">
                    <el-button type="primary" size="small" @click="editItem(idx)">編輯</el-button>
                    <el-button type="danger" size="small" @click="removeItem(idx)">刪除</el-button>
                </div>
            </div>
            <el-button class="w-full mt-4" type="primary" @click="addNewItem">+ 新增預約項目</el-button>
            <el-button class="w-full mt-2" type="warning">前往結帳</el-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
// 實際應從 Pinia 取得 bookingItems
const bookingItems = ref([
    {
        date: '2025/5/20', slot: '11:00', serviceName: '臉部護理', staff: '張美容師', price: 1000,
        mainPerson: { name: '王小明', phone: '0912345678' },
        extraPersons: [{ name: '李小美', phone: '0987654321', email: '' }]
    },
    {
        date: '2025/5/21', slot: '14:00', serviceName: '按摩', staff: '李按摩師', price: 1200,
        mainPerson: { name: '王小明', phone: '0912345678' },
        extraPersons: []
    }
])
function editItem(idx: number) {
    // 跳轉到頁面2並帶入該品項資料
}
function removeItem(idx: number) {
    bookingItems.value.splice(idx, 1)
}
function addNewItem() {
    // 跳轉到頁面1
}
</script>
<style scoped>
.summary-outer {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0;
}

.summary-card {
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

.summary-item {
    width: 100%;
    background: #f8f8f8;
    border-radius: 12px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
    padding: 16px;
    margin-bottom: 16px;
}

.summary-section {
    margin-bottom: 8px;
}

.summary-label {
    font-weight: bold;
    margin-bottom: 4px;
}

.summary-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}
</style>