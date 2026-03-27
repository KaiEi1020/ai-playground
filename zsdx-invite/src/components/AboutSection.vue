<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'

const features = [
  {
    image: '/assets/school-icon-2.png',
    title: '加入本校专属校友圈',
    description: '丰富的校友资源 交流、分享、互助',
  },
  {
    image: '/assets/jimeng-illustration.png',
    title: '找工作 找兼职',
    description: '安全有保障，有学习有成长有报酬就业更体面Offer',
  },
  {
    image: '/assets/crystal-3d.png',
    title: '购物享专属学生价88折',
    description: '全网精选品质商品88折\n学生专享 真低价',
  },
  {
    image: '/assets/decoration-3.png',
    title: '平台下单 送货到寝',
    description: '极速代取 送到门口',
  },
]
</script>

<template>
  <div class="about-section">
    <div class="about-header">
      <span class="header-deco">✦</span>
      <h3 class="about-title">关于掌上大学</h3>
      <span class="header-deco">✦</span>
    </div>

    <p class="about-desc">
      掌上大学 专注服务于全国3000多所高校，是一款专为大学生打造的真实、有用、有趣的宝藏APP，能让你的校园生活更精彩丰富，在这里你可以：
    </p>

    <div class="feature-list">
      <FeatureCard
        v-for="feature in features"
        :key="feature.title"
        v-bind="feature"
      />
    </div>
  </div>
</template>

<style scoped>
.about-section {
  background: linear-gradient(to bottom, #fff7e7, #ffe9eb);
  border-radius: var(--radius-card);
  border: 2px solid white;
  padding: 24px 16px;
}

.about-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.header-deco {
  color: var(--color-action-red);
  font-size: 12px;
}

.about-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.about-desc {
  font-size: 12px;
  color: var(--color-secondary);
  line-height: 20px;
  margin-bottom: 16px;
  text-align: justify;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
