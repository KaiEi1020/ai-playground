<script setup lang="ts">
</script>

<template>
  <nav class="nav-bar">
    <button class="nav-back">
      <img src="/assets/back-arrow.svg" alt="返回" />
    </button>
    <h1 class="nav-title">邀同学，赢现金</h1>
    <button class="nav-rules">规则</button>
  </nav>
</template>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  height: 44px;
}

.nav-back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-back img {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-teal-dark);
}

.nav-rules {
  font-size: 14px;
  color: var(--color-teal-dark);
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: var(--radius-button);
}
</style>
