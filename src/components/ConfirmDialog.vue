<template>
    <el-dialog v-model:visible="dialogVisible" title="流程中斷警告" width="350px" :close-on-click-modal="false"
        :close-on-press-escape="false" :show-close="false">
        <div>你尚未完成預約流程，確定要離開嗎？</div>
        <template #footer>
            <el-button @click="onCancel">取消</el-button>
            <el-button type="danger" @click="onConfirm">確認離開</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const dialogVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
})

function onConfirm() {
    emit('confirm')
}
function onCancel() {
    emit('cancel')
}
</script>