<script lang="ts" setup>
import mediumZoom from 'medium-zoom'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

function initZoom() {
  mediumZoom('img', { background: 'var(--vp-c-bg)' })
}

onMounted(() => {
  initZoom()
})

watch(
  () => route.path,
  () => {
    nextTick(() => initZoom())
  },
)
</script>

<template>
  <Layout />
</template>

<style>
.medium-zoom-overlay,
.medium-zoom-image--opened {
  z-index: 2147483647;
}
</style>
