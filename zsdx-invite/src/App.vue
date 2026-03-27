<script setup lang="ts">
import StatusBar from './components/StatusBar.vue'
import NavBar from './components/NavBar.vue'
import HeroBanner from './components/HeroBanner.vue'
import RewardCard from './components/RewardCard.vue'
import TaskList from './components/TaskList.vue'
import AboutSection from './components/AboutSection.vue'
</script>

<template>
  <div class="page">
    <StatusBar />
    <NavBar />
    <HeroBanner />
    <main class="content">
      <RewardCard />
      <TaskList />
      <AboutSection />
      <div class="footer">已经到底了～</div>
    </main>
  </div>
</template>

<style scoped>
.page {
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #abf1f1 0%,
    #b8fffe 48%,
    rgba(171, 241, 241, 0) 100%
  );
  position: relative;
  overflow: hidden;
}

.content {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
}

.footer {
  text-align: center;
  color: var(--color-light-teal);
  font-size: 12px;
  padding: 20px 0 40px;
}
</style>
