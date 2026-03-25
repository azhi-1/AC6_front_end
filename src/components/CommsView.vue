<template>
  <div class="comms-view panel panel-chamfer">
    <div class="section-header">
      <span class="section-title">COMM CHANNELS</span>
    </div>

    <div class="comms-content">
      <div class="contact-list">
        <div 
          v-for="contact in store.commsList" 
          :key="contact.id"
          class="contact-item"
          :class="{ active: store.selectedContactId === contact.id }"
          @click="store.setContact(contact.id)"
        >
          <div class="contact-avatar">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-phase">{{ contact.phase }}</div>
          </div>
          <div class="unread-badge" v-if="contact.unread > 0">
            {{ contact.unread }}
          </div>
        </div>
      </div>

      <div class="contact-detail" v-if="store.selectedContact">
        <div class="detail-header">
          <span class="detail-name">{{ store.selectedContact.name }}</span>
          <span class="detail-faction">{{ store.selectedContact.faction || '无阵营' }}</span>
        </div>

        <div class="detail-stats">
          <div class="detail-stat">
            <span class="stat-label">关系阶段</span>
            <span class="stat-val phase">{{ store.selectedContact.phase }}</span>
          </div>
          <div class="detail-stat">
            <span class="stat-label">好感度</span>
            <span class="stat-val">{{ store.selectedContact.affinity }}</span>
          </div>
          <div class="detail-stat">
            <span class="stat-label">默契度</span>
            <span class="stat-val">{{ store.selectedContact.rapport }}</span>
          </div>
        </div>

        <div class="affinity-bar">
          <div class="affinity-label">好感度进度</div>
          <div class="affinity-track">
            <div class="affinity-fill" :style="{ width: affinityPercent + '%' }"></div>
          </div>
        </div>

        <div class="comm-placeholder">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3 10l9 5 9-5" fill="none" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>[ 加密通讯记录 ]</span>
        </div>
      </div>

      <div class="contact-empty" v-else>
        <svg viewBox="0 0 24 24" width="48" height="48">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>SELECT CHANNEL</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAC6Store } from '../store';

const store = useAC6Store();

const affinityPercent = computed(() => {
  if (!store.selectedContact) return 0;
  return Math.min(100, Math.max(0, store.selectedContact.affinity));
});
</script>

<style lang="scss" scoped>
.comms-view {
  width: 100%;
  max-width: 560px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--ac-border);
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--ac-light);
}

.comms-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.contact-list {
  width: 180px;
  border-right: 1px solid var(--ac-border);
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.contact-item:hover {
  background: rgba(216, 232, 233, 0.05);
  border-color: var(--ac-border);
}

.contact-item.active {
  background: rgba(216, 232, 233, 0.1);
  border-color: var(--ac-light);
}

.contact-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(114, 130, 131, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ac-base);
}

.contact-info {
  flex: 1;
  overflow: hidden;
}

.contact-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--ac-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-phase {
  font-size: 10px;
  color: var(--ac-base);
  margin-top: 2px;
}

.unread-badge {
  min-width: 18px;
  height: 18px;
  background: var(--ac-light);
  color: var(--ac-dark);
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.contact-detail {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ac-border);
}

.detail-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ac-light);
}

.detail-faction {
  font-size: 11px;
  color: var(--ac-base);
  padding: 4px 8px;
  background: rgba(114, 130, 131, 0.2);
}

.detail-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: var(--ac-base);
}

.stat-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--ac-light);
}

.stat-val.phase {
  color: var(--ac-gold);
}

.affinity-bar {
  margin-top: 8px;
}

.affinity-label {
  font-size: 10px;
  color: var(--ac-base);
  margin-bottom: 6px;
}

.affinity-track {
  width: 100%;
  height: 6px;
  background: rgba(114, 130, 131, 0.3);
  overflow: hidden;
}

.affinity-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ac-gold), var(--ac-green));
  transition: width 0.3s ease;
}

.comm-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ac-base);
  opacity: 0.5;
  font-size: 11px;
  letter-spacing: 2px;
}

.contact-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--ac-base);
  opacity: 0.4;
}
</style>
