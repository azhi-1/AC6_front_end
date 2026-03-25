<template>
  <div class="missions-view">
    <div class="missions-header">
      <span class="section-title">SORTIE / MISSIONS</span>
      <div class="filter-tabs">
        <button 
          class="filter-tab" 
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
        >全部</button>
        <button 
          class="filter-tab" 
          :class="{ active: filter === 'active' }"
          @click="filter = 'active'"
        >进行中</button>
        <button 
          class="filter-tab" 
          :class="{ active: filter === 'completed' }"
          @click="filter = 'completed'"
        >已完成</button>
      </div>
    </div>

    <div class="missions-grid" v-if="filteredMissions.length > 0">
      <div 
        v-for="mission in filteredMissions" 
        :key="mission.id"
        class="mission-card panel panel-chamfer"
      >
        <div class="mission-header">
          <span class="mission-title">{{ mission.name }}</span>
          <span class="mission-type" :class="mission.type">{{ mission.type }}</span>
        </div>

        <div class="mission-status" :class="getStatusClass(mission.status)">
          <span class="status-dot"></span>
          <span class="status-text">{{ mission.status }}</span>
        </div>

        <div class="mission-objectives" v-if="mission.objectives.length > 0">
          <div class="objectives-label">目标</div>
          <div class="objective-list">
            <div v-for="(obj, idx) in mission.objectives" :key="idx" class="objective-item">
              {{ obj }}
            </div>
          </div>
        </div>

        <div class="mission-faction" v-if="mission.faction">
          <span class="faction-label">阵营</span>
          <span class="faction-value">{{ mission.faction }}</span>
        </div>

        <div class="mission-rewards">
          <div class="reward-item">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>{{ mission.rewardCage }}</span>
          </div>
          <div class="reward-item" v-if="mission.rewardExp > 0">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <polygon points="12 2 15 9 22 9 17 14 19 22 12 17 5 22 7 14 2 9 9 9" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>{{ mission.rewardExp }}</span>
          </div>
        </div>

        <div class="mission-deadline" v-if="mission.deadline">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ mission.deadline }}</span>
        </div>
      </div>
    </div>

    <div class="missions-empty" v-else>
      <svg viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
      <span>NO ACTIVE MISSIONS</span>
      <span class="empty-sub">STANDBY</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAC6Store } from '../store';

const store = useAC6Store();
const filter = ref<'all' | 'active' | 'completed'>('all');

const filteredMissions = computed(() => {
  const missions = store.missionsList;
  if (filter.value === 'all') return missions;
  if (filter.value === 'active') return missions.filter(m => m.status === '进行中');
  if (filter.value === 'completed') return missions.filter(m => m.status === '已完成');
  return missions;
});

const getStatusClass = (status: string): string => {
  switch (status) {
    case '进行中': return 'status-active';
    case '已完成': return 'status-completed';
    case '失败': return 'status-failed';
    default: return 'status-pending';
  }
};
</script>

<style lang="scss" scoped>
.missions-view {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.missions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--ac-light);
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  background: transparent;
  border: 1px solid var(--ac-border);
  color: var(--ac-base);
  padding: 4px 12px;
  font-family: var(--font-main);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  color: var(--ac-light);
  border-color: var(--ac-light);
}

.filter-tab.active {
  background: var(--ac-light);
  color: var(--ac-dark);
  border-color: var(--ac-light);
}

.missions-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  overflow-y: auto;
  padding: 4px;
}

.mission-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;
}

.mission-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.mission-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ac-light);
  flex: 1;
}

.mission-type {
  font-size: 9px;
  padding: 2px 6px;
  border: 1px solid var(--ac-base);
  color: var(--ac-base);
  letter-spacing: 1px;
}

.mission-type.困难 {
  border-color: var(--ac-gold);
  color: var(--ac-gold);
}

.mission-type.极难 {
  border-color: var(--ac-alert);
  color: var(--ac-alert);
}

.mission-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 1px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ac-base);
}

.status-active .status-dot {
  background: var(--ac-light);
  box-shadow: 0 0 6px var(--ac-light);
}

.status-completed .status-dot {
  background: var(--ac-green);
}

.status-failed .status-dot {
  background: var(--ac-alert);
}

.status-pending {
  color: var(--ac-base);
}

.status-active {
  color: var(--ac-light);
}

.status-completed {
  color: var(--ac-green);
}

.status-failed {
  color: var(--ac-alert);
}

.mission-objectives {
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.objectives-label {
  font-size: 9px;
  color: var(--ac-base);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.objective-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.objective-item {
  font-size: 11px;
  color: var(--ac-light);
  padding-left: 8px;
  border-left: 2px solid var(--ac-border);
}

.mission-faction {
  display: flex;
  align-items: center;
  gap: 8px;
}

.faction-label {
  font-size: 10px;
  color: var(--ac-base);
}

.faction-value {
  font-size: 11px;
  color: var(--ac-light);
}

.mission-rewards {
  display: flex;
  gap: 16px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ac-gold);
  font-size: 12px;
  font-weight: 600;
}

.mission-deadline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--ac-base);
  padding-top: 8px;
  border-top: 1px solid rgba(114, 130, 131, 0.2);
}

.missions-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ac-base);
  opacity: 0.4;
}

.empty-sub {
  font-size: 11px;
  letter-spacing: 2px;
}
</style>
