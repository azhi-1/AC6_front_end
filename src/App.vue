<template>
  <div id="ac6-outer">
    <div id="ac6-system">
      <div id="ac-hud-overlay"></div>
      <div id="ac-vignette"></div>

      <div class="main-layout interactive-layer">
        <div class="sidebar-nav">
          <div class="nav-header">
            <svg class="hex-icon" viewBox="0 0 24 24" width="28" height="28">
              <polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            <span class="nav-title">SYSTEM</span>
          </div>
          
          <button 
            class="nav-btn" 
            :class="{ active: store.activeView === 'status' }"
            @click="store.setActiveView('status')"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M22 12h-4l-3 9L9 3l-3 9H2" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            状态总览
          </button>
          
          <button 
            class="nav-btn" 
            :class="{ active: store.activeView === 'garage' }"
            @click="store.setActiveView('garage')"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            AC整备
          </button>
          
          <button 
            class="nav-btn" 
            :class="{ active: store.activeView === 'comms' }"
            @click="store.setActiveView('comms')"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            通讯频道
          </button>
          
          <button 
            class="nav-btn" 
            :class="{ active: store.activeView === 'missions' }"
            @click="store.setActiveView('missions')"
          >
            <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
            作战与行动
          </button>
        </div>

        <div class="content-area">
          <Transition name="slide" mode="out-in">
            <StatusView v-if="store.activeView === 'status'" key="status" />
            <GarageView v-else-if="store.activeView === 'garage'" key="garage" />
            <CommsView v-else-if="store.activeView === 'comms'" key="comms" />
            <MissionsView v-else-if="store.activeView === 'missions'" key="missions" />
          </Transition>
        </div>

        <div class="bottom-bar">
          <div class="resource-item">
            <span class="res-label">COAM</span>
            <span class="res-value">{{ store.pilotData?.资金?.CAGE?.toLocaleString() ?? '0' }}</span>
          </div>
          <div class="resource-item">
            <span class="res-label">KRL</span>
            <span class="res-value">{{ store.driveData?.KRL等级 ?? 1 }}</span>
          </div>
          <div class="resource-item">
            <span class="res-label">APM</span>
            <span class="res-value">{{ store.driveData?.APM ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAC6Store } from './store';
import StatusView from './components/StatusView.vue';
import GarageView from './components/GarageView.vue';
import CommsView from './components/CommsView.vue';
import MissionsView from './components/MissionsView.vue';

const store = useAC6Store();
let pollTimer: number | undefined;

onMounted(() => {
  store.fetchData();
  pollTimer = window.setInterval(() => store.fetchData(), 2000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.sidebar-nav {
  width: 140px;
  height: 100%;
  padding: 20px 12px;
  background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ac-border);
}

.hex-icon {
  color: var(--ac-light);
  filter: drop-shadow(0 0 4px rgba(216, 232, 233, 0.5));
}

.nav-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--ac-light);
}

.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.bottom-bar {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 20px;
  background: rgba(0,0,0,0.6);
  padding: 10px 16px;
  border: 1px solid var(--ac-border);
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.res-label {
  font-size: 10px;
  color: var(--ac-base);
  letter-spacing: 2px;
}

.res-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--ac-light);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
