<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = [
  { name: '计算机专业 张*小', text: '已购得20元' },
  { name: '经济学 李*明', text: '已购得18元' },
  { name: '建筑学 王*华', text: '已购得20元' },
]
const currentNotification = ref(0)
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    currentNotification.value = (currentNotification.value + 1) % notifications.length
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const steps = ['分享链接', '下载App', '完成学生认证', '领取奖励']
</script>

<template>
  <div class="reward-card">
    <!-- Header with decorative wave -->
    <div class="card-header">
      <div class="header-wave">
        <div class="diamond-pattern"></div>
      </div>
      <h3 class="header-title">每成功邀请1位校友</h3>
    </div>

    <!-- Scrolling notification bubble -->
    <div class="notification-bubble">
      <div class="bubble-avatar">
        <img src="/assets/avatar-1.png" alt="" />
      </div>
      <span class="bubble-text">
        {{ notifications[currentNotification].name }} {{ notifications[currentNotification].text }}
      </span>
    </div>

    <!-- Reward envelopes -->
    <div class="envelopes">
      <div class="envelope-card envelope-left">
        <div class="envelope-amount">
          <span class="amount-number">18</span>
          <span class="amount-unit">元</span>
        </div>
        <p class="envelope-desc">最高得1800元现金</p>
        <p class="envelope-tag">你可得</p>
      </div>
      <div class="envelope-card envelope-right">
        <div class="envelope-amount">
          <span class="amount-number">20</span>
          <span class="amount-unit">元</span>
        </div>
        <p class="envelope-desc">新人礼</p>
        <p class="envelope-tag">好友可得</p>
      </div>
    </div>

    <!-- CTA Button -->
    <button class="cta-button">邀请同学加入</button>

    <!-- Invitation list link -->
    <a href="#" class="invite-link">邀请列表</a>

    <!-- Step progress -->
    <div class="steps">
      <template v-for="(step, index) in steps" :key="step">
        <div class="step-item">
          <span class="step-text">{{ step }}</span>
        </div>
        <span v-if="index < steps.length - 1" class="step-arrow">›</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.reward-card {
  background: linear-gradient(to bottom, #fff7e7, #ffe9eb);
  border-radius: var(--radius-card);
  border: 2px solid white;
  padding: 0 16px 20px;
  position: relative;
  overflow: hidden;
}

.card-header {
  position: relative;
  margin: 0 -16px;
  padding: 16px 16px 24px;
  text-align: center;
}

.header-wave {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, #b8f5ff, rgba(255, 255, 255, 0));
  overflow: hidden;
}

.diamond-pattern {
  position: absolute;
  inset: 0;
  background-image: repeating-conic-gradient(
    rgba(255, 255, 255, 0.2) 0% 25%,
    transparent 0% 50%
  );
  background-size: 15px 15px;
  transform: rotate(45deg);
  scale: 1.5;
}

.header-title {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-dark);
  padding-top: 8px;
}

.notification-bubble {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-button);
  padding: 4px 12px 4px 4px;
  margin: 0 auto 16px;
  width: fit-content;
  font-size: 10px;
  color: var(--color-secondary);
}

.bubble-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.bubble-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bubble-text {
  white-space: nowrap;
}

.envelopes {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.envelope-card {
  flex: 1;
  border-radius: 16px;
  padding: 20px 12px 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.envelope-left {
  background: linear-gradient(135deg, #ff2663, #ff3826);
  color: white;
}

.envelope-right {
  background: linear-gradient(135deg, #ff3826, #ff999d);
  color: white;
}

.envelope-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 4px;
}

.amount-number {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}

.amount-unit {
  font-size: 16px;
  font-weight: 600;
}

.envelope-desc {
  font-size: 10px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.envelope-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 2px 12px;
  font-size: 12px;
}

.cta-button {
  display: block;
  width: 100%;
  padding: 16px;
  background: linear-gradient(to bottom, #ff2663, #ff3826);
  color: white;
  font-size: 20px;
  font-weight: 600;
  border-radius: var(--radius-button);
  text-align: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(255, 38, 99, 0.4);
}

.invite-link {
  display: block;
  text-align: center;
  font-size: 12px;
  color: var(--color-secondary);
  text-decoration: underline;
  margin-bottom: 20px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-text {
  font-size: 12px;
  color: var(--color-secondary);
}

.step-arrow {
  color: var(--color-secondary);
  font-size: 14px;
  margin: 0 2px;
}
</style>
