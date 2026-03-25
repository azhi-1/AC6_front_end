<template>
  <div class="status-view panel panel-chamfer">
    <div class="section-header">
      <span class="section-title">PILOT STATUS</span>
      <span class="section-sub">{{ store.pilotData?.驾驶属性?.驾驶分档 ?? 'UNKNOWN' }}</span>
    </div>

    <div class="status-grid">
      <div class="status-column">
        <div class="stat-group">
          <div class="stat-label">AP (HP)</div>
          <div class="stat-bar-container">
            <div class="stat-bar" :class="{ critical: hpPercent < 30 }">
              <div class="stat-bar-fill" :style="{ width: hpPercent + '%' }"></div>
            </div>
            <span class="stat-value">{{ hpValue }} / {{ hpMax }}</span>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label">SP (精神力)</div>
          <div class="stat-bar-container">
            <div class="stat-bar sp-bar">
              <div class="stat-bar-fill sp-fill" :style="{ width: spPercent + '%' }"></div>
            </div>
            <span class="stat-value">{{ spValue }} / {{ spMax }}</span>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label">珂若尔护盾</div>
          <div class="stat-bar-container">
            <div class="stat-bar shield-bar">
              <div class="stat-bar-fill shield-fill" :style="{ width: shieldPercent + '%' }"></div>
            </div>
            <span class="stat-value">{{ shieldCur }} / {{ shieldMax }}</span>
          </div>
        </div>
      </div>

      <div class="status-column">
        <div class="stat-item">
          <span class="stat-label">APM (操作力)</span>
          <span class="stat-val">{{ store.driveData?.APM ?? 0 }}</span>
        </div>

        <div class="stat-item">
          <span class="stat-label">神经同步率</span>
          <span class="stat-val sync">
            {{ syncRate }} / {{ maxSync }}%
          </span>
        </div>

        <div class="stat-item">
          <span class="stat-label">主角默契度</span>
          <span class="stat-val">{{ store.pilotData?.默契度 ?? 0 }}</span>
        </div>
      </div>
    </div>

    <div class="section-divider"></div>

    <div class="section-header">
      <span class="section-title">SYSTEM SYNC</span>
    </div>

    <div class="sync-grid">
      <div class="sync-status" :class="{ active: syncEnabled }">
        <span class="sync-label">交感同操状态</span>
        <span class="sync-val">{{ syncEnabled ? 'ONLINE' : 'OFFLINE' }}</span>
      </div>

      <div class="sync-info" v-if="syncEnabled">
        <div class="sync-item">
          <span class="stat-label">共鸣效率</span>
          <span class="stat-val">{{ resonanceEfficiency }}</span>
        </div>
        <div class="sync-item">
          <span class="stat-label">接触方式</span>
          <span class="stat-val">{{ contactType }}</span>
        </div>
        <div class="sync-item" v-if="inputerName">
          <span class="stat-label">inputer</span>
          <span class="stat-val">{{ inputerName }}</span>
        </div>
        <div class="sync-item" v-if="outputerName">
          <span class="stat-label">outputer</span>
          <span class="stat-val">{{ outputerName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAC6Store } from '../store';

const store = useAC6Store();

const hpValue = computed(() => store.pilotData?.主角状态栏?.HP值 ?? 100);
const hpMax = computed(() => 100);
const hpPercent = computed(() => Math.max(0, Math.min(100, hpValue.value)));

const spValue = computed(() => store.pilotData?.主角状态栏?.SP值 ?? 100);
const spMax = computed(() => 100);
const spPercent = computed(() => Math.max(0, Math.min(100, spValue.value)));

const shieldCur = computed(() => store.pilotData?.珂若尔护盾?.现 ?? 10);
const shieldMax = computed(() => store.pilotData?.珂若尔护盾?.满 ?? 10);
const shieldPercent = computed(() => shieldMax.value > 0 ? (shieldCur.value / shieldMax.value * 100) : 0);

const syncRate = computed(() => store.driveData?.神经同步率 ?? 0);
const maxSync = computed(() => store.driveData?.最大同步上限 ?? 60);

const syncEnabled = computed(() => store.syncData?.启用状态 ?? false);
const resonanceEfficiency = computed(() => store.syncData?.共鸣效率 ?? '-');
const contactType = computed(() => store.syncData?.接触方式 ?? '-');
const inputerName = computed(() => store.syncData?.inputer?.姓名 || '');
const outputerName = computed(() => store.syncData?.outputer?.姓名 || '');
</script>

<style lang="scss" scoped>
.status-view {
  width: 100%;
  max-width: 480px;
  max-height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ac-border);
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--ac-light);
}

.section-sub {
  font-size: 12px;
  color: var(--ac-base);
  letter-spacing: 1px;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--ac-border), transparent);
  margin: 20px 0;
}

.status-grid {
  display: flex;
  gap: 24px;
}

.status-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--ac-base);
  letter-spacing: 1px;
}

.stat-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: rgba(114, 130, 131, 0.3);
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: var(--ac-light);
  transition: width 0.3s ease;
}

.stat-bar.critical .stat-bar-fill {
  background: var(--ac-alert);
  animation: pulse-glow 1s infinite;
}

.sp-fill {
  background: var(--ac-blue);
}

.shield-fill {
  background: var(--ac-green);
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--ac-light);
  min-width: 70px;
  text-align: right;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(114, 130, 131, 0.15);
}

.stat-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--ac-light);
}

.stat-val.sync {
  color: var(--ac-purple);
}

.sync-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sync-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-left: 3px solid var(--ac-base);
  transition: all 0.3s;
}

.sync-status.active {
  border-left-color: var(--ac-purple);
  background: rgba(158, 107, 255, 0.1);
}

.sync-label {
  font-size: 11px;
  color: var(--ac-base);
}

.sync-val {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--ac-base);
}

.sync-status.active .sync-val {
  color: var(--ac-purple);
  text-shadow: 0 0 8px rgba(158, 107, 255, 0.5);
}

.sync-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.sync-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
