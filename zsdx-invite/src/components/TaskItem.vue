<script setup lang="ts">
defineProps<{
  emoji: string
  iconBg: string
  title: string
  reward: string
  description: string
  buttonText: string
}>()
</script>

<template>
  <div class="task-item">
    <div class="task-icon" :style="{ background: iconBg }">
      <span class="task-emoji">{{ emoji }}</span>
    </div>
    <div class="task-info">
      <div class="task-title-row">
        <span class="task-title">{{ title }}（{{ reward }}）</span>
      </div>
      <p class="task-desc">{{ description }}</p>
    </div>
    <button class="task-btn">{{ buttonText }}</button>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.task-item + .task-item {
  border-top: 1px solid rgba(166, 87, 87, 0.08);
}

.task-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-emoji {
  font-size: 22px;
  line-height: 1;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-dark);
}

.task-desc {
  font-size: 10px;
  color: var(--color-secondary);
  margin-top: 2px;
  line-height: 16px;
}

.task-btn {
  flex-shrink: 0;
  padding: 6px 16px;
  background: linear-gradient(to bottom, #ff2663, #ff3826);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-button);
  white-space: nowrap;
}
</style>
