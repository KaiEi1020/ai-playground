<script setup lang="ts">
import TaskItem from './TaskItem.vue'

const tasks = [
  {
    emoji: '🎓',
    iconBg: '#dbf3ff',
    title: '完成学生认证',
    reward: '20元',
    description: '立享美食7折、书店等平台学生优惠',
    buttonText: '去认证',
  },
  {
    emoji: '📝',
    iconBg: '#ffe6d4',
    title: '发5条动态',
    reward: '6元',
    description: '大学生社区、分享校园生活',
    buttonText: '去发布',
  },
  {
    emoji: '👍',
    iconBg: '#ffe1f5',
    title: '逛社区点赞10条动态',
    reward: '6元',
    description: '探索校友生活',
    buttonText: '去点赞',
  },
  {
    emoji: '💬',
    iconBg: '#f4e3ff',
    title: '逛社区评论2条动态',
    reward: '6元',
    description: '探索校友、精彩互动',
    buttonText: '去评论',
  },
  {
    emoji: '💼',
    iconBg: '#bee8ff',
    title: '浏览兼职/工作15秒',
    reward: '6元',
    description: '兼职投简历、工作15秒',
    buttonText: '去看看',
  },
  {
    emoji: '🛒',
    iconBg: '#defff5',
    title: '购买1件商品并成为代理',
    reward: '6元',
    description: '全网精选好商品',
    buttonText: '去看看',
  },
]
</script>

<template>
  <div class="task-card">
    <div class="task-header">
      <h3 class="task-card-title">新人专属礼 赢50元购物金 💰</h3>
    </div>
    <div class="task-list">
      <TaskItem
        v-for="task in tasks"
        :key="task.title"
        v-bind="task"
      />
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: linear-gradient(to bottom, #fff7e7, #ffe9eb);
  border-radius: var(--radius-card);
  border: 2px solid white;
  padding: 20px 16px;
}

.task-header {
  margin-bottom: 8px;
}

.task-card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.task-list {
  padding: 0 4px;
}
</style>
