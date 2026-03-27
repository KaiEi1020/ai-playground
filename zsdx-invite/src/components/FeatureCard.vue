<script setup lang="ts">
defineProps<{
  image: string
  title: string
  description: string
}>()
</script>

<template>
  <div class="feature-card">
    <div class="feature-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="feature-info">
      <h4 class="feature-title">{{ title }}</h4>
      <p class="feature-desc">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  background: white;
  border-radius: var(--radius-feature);
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.feature-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #defff5, #c3f2ff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-image img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: var(--color-secondary);
  line-height: 18px;
}
</style>
