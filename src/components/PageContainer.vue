<template>
    <div class="page-outer">
        <div :class="['page-container', `size-${maxWidth}`]">
            <!-- 頁面標題 -->
            <h1 v-if="title" class="page-title">{{ title }}</h1>

            <!-- 頁面內容 -->
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    maxWidth: 'md'
})

// 直接使用 props，Vue 3 模板會自動解包
</script>

<style scoped>
.page-outer {
    min-height: 100vh;
    width: 100%;
    background: #f5f5f5;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
}

.page-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* 響應式寬度設定 - 使用更強制的設定 */
.page-container.size-sm {
    max-width: 400px !important;
    width: 400px !important;
}

.page-container.size-md {
    max-width: 480px !important;
    width: 480px !important;
}

.page-container.size-lg {
    max-width: 520px !important;
    width: 520px !important;
}

.page-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
    text-align: center;
    color: #333;
}

/* 移動端優化 */
@media (max-width: 768px) {
    .page-outer {
        padding: 16px;
    }

    .page-container {
        padding: 20px;
    }

    .page-container.size-sm,
    .page-container.size-md,
    .page-container.size-lg {
        width: 100% !important;
        max-width: 100% !important;
    }

    .page-title {
        font-size: 18px;
        margin-bottom: 20px;
    }
}
</style>