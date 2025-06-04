<template>
    <div>
        <p>ExtraPersonDialog template loaded</p>
        <el-dialog :model-value="visible" title="新增額外預約人" width="350px">
            <p>對話框內容</p>
            <template #footer>
                <el-button @click="$emit('update:visible', false)">關閉</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
console.log('ExtraPersonDialog script executing')

const props = defineProps<{ visible: boolean }>()

console.log('ExtraPersonDialog props:', props)

defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'confirm', payload: { name: string; phone: string; email: string }): void
}>()
</script>

<style scoped>
.contact-info-hint {
    margin-top: -8px;
    margin-bottom: 16px;
    padding-left: 4px;
}

:deep(.el-dialog__header) {
    padding: 20px 20px 10px 20px;
}

:deep(.el-dialog__body) {
    padding: 10px 20px 20px 20px;
}

:deep(.el-dialog__footer) {
    padding: 0 20px 20px 20px;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
}

:deep(.el-input__inner) {
    height: 36px;
}
</style>