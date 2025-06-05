<template>
  <div
    class="min-h-screen w-full bg-gray-100 flex items-start justify-center p-6 md:p-8 box-border"
  >
    <div
      :class="[
        'bg-white rounded-lg shadow-lg p-6 md:p-8 w-full flex flex-col box-border',
        maxWidth === 'sm' ? 'md:max-w-100 md:w-100' : '',
        maxWidth === 'md' ? 'md:max-w-120 md:w-120' : '',
        maxWidth === 'lg' ? 'md:max-w-130 md:w-130' : '',
      ]"
    >
      <!-- 頁面標題 -->
      <h1 v-if="title" class="text-lg md:text-xl font-bold mb-5 md:mb-6 text-center text-gray-800">
        {{ title }}
      </h1>

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

withDefaults(defineProps<Props>(), {
  maxWidth: 'md',
})
</script>
