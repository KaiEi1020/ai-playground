<script setup lang="ts">
</script>

<template>
  <div class="status-bar">
    <span class="time">9:41</span>
    <div class="status-icons">
      <img src="/assets/cellular.svg" alt="" class="icon-cellular" />
      <img src="/assets/wifi.svg" alt="" class="icon-wifi" />
      <img src="/assets/battery.svg" alt="" class="icon-battery" />
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px 0;
  height: 44px;
}

.time {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-teal-dark);
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-cellular {
  width: 18px;
  height: 12px;
}

.icon-wifi {
  width: 16px;
  height: 12px;
}

.icon-battery {
  width: 27px;
  height: 13px;
}
</style>
