<script setup lang="ts">
</script>

<template>
  <section class="hero">
    <!-- Diamond pattern overlay -->
    <div class="diamond-overlay"></div>

    <!-- Logo -->
    <div class="hero-top">
      <div class="logo-row">
        <img src="/assets/logo.svg" alt="掌上大学" class="logo" />
      </div>

      <!-- Title -->
      <h2 class="hero-title">
        <span class="title-line">邀同学加入</span>
        <span class="title-line">本校<em>校友圈</em></span>
      </h2>

      <p class="hero-subtitle">真实 有用 有趣的</p>
    </div>

    <!-- School photo frame area -->
    <div class="school-frame-area">
      <div class="photo-frame">
        <img src="/assets/hero-image-1.png" alt="校园" class="school-photo" />
      </div>
    </div>

    <!-- Decorative elements -->
    <img src="/assets/school-frame.png" alt="" class="deco-heart-bubble" />
    <img src="/assets/school-photo.png" alt="" class="deco-chat-bubble" />
    <img src="/assets/join-us-1.png" alt="Join Us" class="deco-joinus" />
    <img src="/assets/hero-coins.png" alt="" class="deco-student" />
    <img src="/assets/decoration-1.png" alt="" class="deco-crystal-1" />
    <img src="/assets/decoration-2.png" alt="" class="deco-crystal-2" />

    <!-- Right side label -->
    <div class="app-label">
      <span>大学生 宝藏App</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 12px 16px 70px;
  overflow: visible;
  min-height: 320px;
}

.diamond-overlay {
  position: absolute;
  inset: 0;
  background-image: repeating-conic-gradient(
    rgba(255, 255, 255, 0.2) 0% 25%,
    transparent 0% 50%
  );
  background-size: 15px 15px;
  transform: rotate(45deg);
  scale: 1.5;
  pointer-events: none;
  z-index: 0;
}

.hero-top {
  position: relative;
  z-index: 1;
}

.logo-row {
  margin-bottom: 12px;
}

.logo {
  height: 20px;
  width: auto;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.hero-title {
  position: relative;
  z-index: 1;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-teal-dark);
  line-height: 1.25;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.title-line {
  display: block;
}

.title-line em {
  font-style: normal;
  color: #ff004d;
  background: linear-gradient(to bottom, #fff423, #ff004d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 12px;
  color: var(--color-teal-dark);
  margin-top: 6px;
  opacity: 0.7;
  letter-spacing: 2px;
}

/* School photo frame */
.school-frame-area {
  position: absolute;
  right: 60px;
  top: 12px;
  z-index: 1;
}

.photo-frame {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: rotate(6deg);
}

.school-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Decorative elements */
.deco-heart-bubble {
  position: absolute;
  left: 10px;
  bottom: 30px;
  width: 48px;
  height: 48px;
  z-index: 2;
  object-fit: contain;
  opacity: 0.8;
}

.deco-chat-bubble {
  position: absolute;
  right: 100px;
  top: 8px;
  width: 36px;
  height: 36px;
  z-index: 2;
  object-fit: contain;
  opacity: 0.7;
}

.deco-joinus {
  position: absolute;
  right: 8px;
  top: 80px;
  width: 90px;
  z-index: 2;
  object-fit: contain;
}

.deco-student {
  position: absolute;
  right: -5px;
  bottom: -10px;
  width: 140px;
  z-index: 3;
  object-fit: contain;
}

.deco-crystal-1 {
  position: absolute;
  left: -5px;
  top: 60px;
  width: 36px;
  height: 36px;
  z-index: 2;
  object-fit: contain;
}

.deco-crystal-2 {
  position: absolute;
  left: 50px;
  bottom: 50px;
  width: 28px;
  height: 28px;
  z-index: 2;
  object-fit: contain;
}

.app-label {
  position: absolute;
  right: 12px;
  bottom: 50px;
  background: rgba(0, 62, 77, 0.25);
  color: white;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 20px;
  z-index: 4;
  white-space: nowrap;
}
</style>
