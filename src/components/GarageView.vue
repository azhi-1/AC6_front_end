<template>
  <div class="garage-view">
    <div class="garage-left panel panel-chamfer">
      <div class="section-header">
        <span class="section-title">AC GARAGE</span>
        <span class="section-sub">{{ store.currentMechName || '未选择' }}</span>
      </div>

      <div class="parts-list">
        <div 
          v-for="slot in garageSlots" 
          :key="slot.key"
          class="part-slot"
          :class="{ active: store.selectedGarageSlot === slot.key }"
          @click="selectSlot(slot.key)"
        >
          <div class="slot-type">{{ slot.label }}</div>
          <div class="slot-name">{{ getEquippedPart(slot.key) || 'EMPTY' }}</div>
        </div>
      </div>

      <div class="weapons-section">
        <div class="section-label">WEAPONS</div>
        <div class="weapon-item">
          <span class="weapon-label">R-ARM</span>
          <span class="weapon-name">{{ getWeaponName('主武器槽') || 'EMPTY' }}</span>
        </div>
        <div class="weapon-item">
          <span class="weapon-label">L-ARM</span>
          <span class="weapon-name">{{ getWeaponName('副武器槽') || 'EMPTY' }}</span>
        </div>
      </div>
    </div>

    <div class="garage-right">
      <div class="parts-selector panel panel-chamfer" v-if="store.selectedGarageSlot">
        <div class="section-header">
          <span class="section-title">{{ getSlotLabel(store.selectedGarageSlot) }}</span>
          <button class="close-btn" @click="store.setGarageSlot(null)">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/></svg>
          </button>
        </div>
        
        <div class="available-parts">
          <div 
            v-for="part in filteredParts" 
            :key="part.key"
            class="part-option"
            :class="{ selected: isPartSelected(part.key) }"
            @click="equipPart(part.key)"
          >
            <div class="part-name">{{ part.name }}</div>
            <div class="part-info">
              <span class="part-manufacturer">{{ part.manufacturer }}</span>
              <span class="part-weight">{{ part.weight }}</span>
            </div>
          </div>
          
          <div v-if="filteredParts.length === 0" class="no-parts">
            无可用部件
          </div>
        </div>
      </div>

      <div class="stats-panel panel panel-chamfer">
        <div class="section-label">■ 装甲结构</div>
        <div class="stat-line">
          <span>装甲值</span>
          <span class="stat-value">{{ armorStr }}/{{ armorFull }}</span>
        </div>
        <div class="stat-line">
          <span>结构值</span>
          <span class="stat-value">{{ structStr }}/{{ structFull }}</span>
        </div>
        <div class="stat-line">
          <span>珂若尔护盾</span>
          <span class="stat-value">{{ shieldStr }}/{{ shieldFull }}</span>
        </div>

        <div class="section-label" style="margin-top: 16px;">■ AC 性能</div>
        <div class="stat-line">
          <span>装甲等级</span>
          <span class="stat-value">{{ mechOverview?.装甲等级 || '-' }}</span>
        </div>
        <div class="stat-line">
          <span>机体类型</span>
          <span class="stat-value">{{ mechOverview?.机体类型 || '-' }}</span>
        </div>
        <div class="stat-line">
          <span>推重比</span>
          <span class="stat-value">{{ thrustRatio }}</span>
        </div>
        <div class="stat-line">
          <span>推重加值</span>
          <span class="stat-value">{{ thrustBonus }}</span>
        </div>
        <div class="stat-line">
          <span>电子战评级</span>
          <span class="stat-value">{{ mechOverview?.电子战评级 || 0 }}</span>
        </div>
        <div class="stat-line">
          <span>观测效益</span>
          <span class="stat-value">{{ mechOverview?.观测效益 || 0 }}</span>
        </div>
        <div class="stat-line">
          <span>续航回合</span>
          <span class="stat-value">{{ mechOverview?.续航回合数 || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAC6Store } from '../store';

const store = useAC6Store();

const garageSlots = [
  { key: 'HEAD', label: 'HEAD' },
  { key: 'CORE', label: 'CORE' },
  { key: 'EWR', label: 'EWR' },
  { key: 'BOOSTER', label: 'BOOSTER' },
  { key: 'GENERATOR', label: 'GENERATOR' },
  { key: 'LEGS', label: 'LEGS' },
];

const mechOverview = computed(() => store.mechOverview);

const getEquippedPart = (slot: string): string => {
  return store.mechBuild[slot] || '';
};

const getWeaponName = (slot: string): string => {
  const weapons = store.weaponsMount;
  const weapon = weapons?.[slot as keyof typeof weapons];
  return weapon?.武器名 || '';
};

const getSlotLabel = (slot: string): string => {
  const found = garageSlots.find(s => s.key === slot);
  return found?.label || slot;
};

const selectSlot = (slot: string) => {
  if (store.selectedGarageSlot === slot) {
    store.setGarageSlot(null);
  } else {
    store.setGarageSlot(slot);
  }
};

const filteredParts = computed(() => {
  if (!store.selectedGarageSlot) return [];
  return store.availableParts.filter(p => p.type === store.selectedGarageSlot);
});

const isPartSelected = (partName: string): boolean => {
  if (!store.selectedGarageSlot) return false;
  return store.mechBuild[store.selectedGarageSlot] === partName;
};

const equipPart = (partName: string) => {
  if (!store.selectedGarageSlot) return;
  store.updateMechPart(store.selectedGarageSlot, partName);
  store.setGarageSlot(null);
};

const armorStr = computed(() => mechOverview.value?.装甲值?.现 ?? 0);
const armorFull = computed(() => mechOverview.value?.装甲值?.满 ?? 0);
const structStr = computed(() => mechOverview.value?.结构值?.现 ?? 0);
const structFull = computed(() => mechOverview.value?.结构值?.满 ?? 0);
const shieldStr = computed(() => mechOverview.value?.珂若尔护盾?.现 ?? 0);
const shieldFull = computed(() => mechOverview.value?.珂若尔护盾?.满 ?? 0);
const thrustRatio = computed(() => {
  const ratio = mechOverview.value?.推重比;
  return ratio !== undefined ? ratio.toFixed(2) : '0.00';
});
const thrustBonus = computed(() => mechOverview.value?.推重加值 ?? 0);
</script>

<style lang="scss" scoped>
.garage-view {
  display: flex;
  gap: 20px;
  width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.garage-left {
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
}

.garage-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ac-border);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--ac-light);
}

.section-sub {
  font-size: 11px;
  color: var(--ac-base);
}

.section-label {
  font-size: 10px;
  color: var(--ac-base);
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.parts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.part-slot {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--ac-border);
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.part-slot:hover {
  border-color: var(--ac-light);
  background: rgba(216, 232, 233, 0.05);
}

.part-slot.active {
  border-color: var(--ac-light);
  background: rgba(216, 232, 233, 0.1);
  box-shadow: 0 0 10px rgba(216, 232, 233, 0.2);
}

.slot-type {
  font-size: 9px;
  color: var(--ac-base);
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.slot-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ac-light);
}

.weapons-section {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--ac-border);
}

.weapon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.weapon-label {
  font-size: 10px;
  color: var(--ac-base);
}

.weapon-name {
  font-size: 12px;
  color: var(--ac-light);
}

.parts-selector {
  padding: 16px;
  max-height: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--ac-base);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--ac-light);
}

.available-parts {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.part-option {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--ac-border);
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.part-option:hover {
  border-color: var(--ac-light);
  background: rgba(216, 232, 233, 0.08);
}

.part-option.selected {
  border-color: var(--ac-green);
  background: rgba(107, 255, 158, 0.1);
}

.part-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ac-light);
}

.part-info {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.part-manufacturer {
  font-size: 10px;
  color: var(--ac-base);
}

.part-weight {
  font-size: 10px;
  color: var(--ac-base);
}

.no-parts {
  text-align: center;
  color: var(--ac-base);
  padding: 20px;
  font-size: 12px;
}

.stats-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.stat-line {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
}

.stat-line span:first-child {
  color: var(--ac-base);
}

.stat-value {
  color: var(--ac-light);
  font-weight: 600;
}
</style>
