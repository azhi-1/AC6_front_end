import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { klona } from 'klona';

interface StatData {
  全局信息?: {
    物理位置?: string;
    时间?: string;
  };
  主角?: {
    主角状态栏?: { HP值?: number; SP值?: number };
    驾驶属性?: {
      APM?: number;
      驾驶分档?: string;
      KRL等级?: number;
      神经同步率?: number;
      最大同步上限?: number;
    };
    珂若尔护盾?: { 现?: number; 满?: number };
    默契度?: number;
    资金?: { CAGE?: number };
  };
  交感同操?: {
    启用状态?: boolean;
    inputer?: { 姓名?: string; KRL等级?: number; SP值?: number; 是否生物机甲?: boolean };
    outputer?: { 姓名?: string; APM值?: number; SP值?: number };
    共鸣效率?: number;
    接触方式?: string;
  };
  红颜通讯?: Record<string, {
    角色名称?: string;
    阵营?: string;
    好感度?: number;
    关系阶段?: string;
    默契度?: number;
    未读消息数?: number;
  }>;
  机库?: {
    机库整备设备?: Record<string, string>;
    可用机甲部件?: Record<string, {
      部件类型?: string;
      描述?: string;
      制造商?: string;
      重量?: number;
      [key: string]: unknown;
    }>;
    机甲泊位?: Record<string, {
      机甲总览?: {
        机体类型?: string;
        机体定位?: string;
        装甲等级?: string;
        装甲值?: { 现?: number; 满?: number };
        结构值?: { 现?: number; 满?: number };
        珂若尔护盾?: { 现?: number; 满?: number };
        推重比?: number;
        推重加值?: number;
        续航回合数?: number;
        观测效益?: number;
        电子战评级?: number;
        战斗风格?: string;
      };
      机甲构建?: Record<string, string>;
      武器挂载?: {
        主武器槽?: { 武器名?: string; 类型?: string; 破甲TIER?: string; 固定伤害?: number; 弹药量?: number };
        副武器槽?: { 武器名?: string; 类型?: string; 破甲TIER?: string; 固定伤害?: number; 弹药量?: number };
        导弹挂载?: Record<string, { 弹药量?: number; 追踪性能?: number; 基准伤害?: number; 破甲TIER?: string }>;
      };
    }>;
    当前驾驶机甲?: string;
  };
  任务面板?: Record<string, {
    任务名称?: string;
    任务类型?: string;
    阵营?: string;
    目标列表?: string[];
    进行状态?: string;
    奖励经验?: number;
    奖励资金?: number;
    奖励物品?: string[];
    截止时间?: string;
  }>;
}

const getVal = <T>(obj: unknown, path: string, def?: T): T => {
  try {
    const parts = path.split('.');
    let current: unknown = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return def as T;
      }
    }
    return current as T;
  } catch {
    return def as T;
  }
};

const fmtNum = (num: number): string => Number(num).toLocaleString();

export const useAC6Store = defineStore('ac6-status', () => {
  const statData = ref<StatData | undefined>(undefined);
  const activeView = ref<'status' | 'garage' | 'comms' | 'missions'>('status');
  const selectedGarageSlot = ref<string | null>(null);
  const selectedContactId = ref<string | null>(null);
  const lastUpdate = ref<number>(Date.now());

  const pilotData = computed(() => getVal(statData.value, '主角', {}));
  const driveData = computed(() => pilotData.value?.驾驶属性 || {});
  const syncData = computed(() => getVal(statData.value, '交感同操', {}));
  const garageData = computed(() => getVal(statData.value, '机库', {}));
  const commsData = computed(() => getVal(statData.value, '红颜通讯', {}));
  const missionsData = computed(() => getVal(statData.value, '任务面板', {}));

  const currentMechName = computed(() => 
    garageData.value?.当前驾驶机甲 || ''
  );

  const currentMech = computed(() => {
    const泊位 = garageData.value?.机甲泊位;
    const name = currentMechName.value;
    if (泊位 && name && 泊位[name]) {
      return 泊位[name];
    }
    const keys = Object.keys(泊位 || {});
    if (keys.length > 0) {
      return 泊位[keys[0]];
    }
    return null;
  });

  const mechBuild = computed(() => currentMech.value?.机甲构建 || {});
  const mechOverview = computed(() => currentMech.value?.机甲总览 || {});
  const weaponsMount = computed(() => currentMech.value?.武器挂载 || {});

  const availableParts = computed(() => {
    const parts = garageData.value?.可用机甲部件 || {};
    return Object.entries(parts).map(([key, val]) => ({
      key,
      name: key,
      type: val?.部件类型 || 'UNKNOWN',
      weight: val?.重量 || 0,
      manufacturer: val?.制造商 || '',
      description: val?.描述 || '',
      extra: val,
    }));
  });

  const commsList = computed(() => {
    const list = Object.entries(commsData.value || {});
    if (list.length === 0) {
      return [{ id: 'none', name: '无信号', faction: '', affinity: 0, phase: '陌生人', rapport: 0, unread: 0 }];
    }
    return list.map(([id, info]) => ({
      id,
      name: info?.角色名称 || id,
      faction: info?.阵营 || '',
      affinity: info?.好感度 || 0,
      phase: info?.关系阶段 || '陌生人',
      rapport: info?.默契度 || 0,
      unread: info?.未读消息数 || 0,
    }));
  });

  const missionsList = computed(() => {
    const list = Object.entries(missionsData.value || {});
    return list.map(([id, info]) => ({
      id,
      name: info?.任务名称 || '未知任务',
      type: info?.任务类型 || '普通',
      faction: info?.阵营 || '',
      objectives: info?.目标列表 || [],
      status: info?.进行状态 || '未开始',
      rewardExp: info?.奖励经验 || 0,
      rewardCage: info?.奖励资金 || 0,
      deadline: info?.截止时间 || '',
    }));
  });

  async function fetchData() {
    try {
      if (typeof getLastMessageId !== 'function') return;
      const lastId = getLastMessageId();
      
      if (typeof getChatMessages !== 'function') return;
      const msgs = getChatMessages(`0-${lastId}`, { role: 'assistant' });
      if (!msgs || msgs.length === 0) return;
      const targetMsg = msgs[msgs.length - 1];

      let rawData: { stat_data?: StatData } | null = null;
      if (typeof Mvu !== 'undefined' && Mvu?.getMvuData) {
        rawData = Mvu.getMvuData({ type: 'message', message_id: targetMsg.message_id }) as { stat_data?: StatData };
      } else if (typeof getVariables === 'function') {
        const vars = getVariables({ type: 'message', message_id: targetMsg.message_id });
        rawData = vars as { stat_data?: StatData };
      }

      if (rawData?.stat_data) {
        statData.value = rawData.stat_data;
        lastUpdate.value = Date.now();
      }
    } catch (error) {
      console.error('AC6 Store: Failed to fetch data', error);
    }
  }

  function setActiveView(view: typeof activeView.value) {
    activeView.value = view;
  }

  function setGarageSlot(slot: string | null) {
    selectedGarageSlot.value = slot;
  }

  function setContact(id: string | null) {
    selectedContactId.value = id;
  }

  function updateMechPart(slot: string, partName: string) {
    const currentMechNameVal = currentMechName.value;
    if (!currentMechNameVal) return;

    const newData = klona(statData.value);
    if (!newData?.机库?.机甲泊位?.[currentMechNameVal]) return;

    const mech = newData.机库.机甲泊位[currentMechNameVal];
    if (!mech.机甲构建) {
      mech.机甲构建 = {};
    }
    mech.机甲构建[slot] = partName;

    if (typeof replaceVariables === 'function') {
      replaceVariables({ stat_data: newData }, { type: 'message', message_id: getLastMessageId() });
      statData.value = newData;
    }
  }

  const selectedContact = computed(() => {
    if (!selectedContactId.value) return null;
    const info = commsData.value?.[selectedContactId.value];
    if (!info) return null;
    return {
      id: selectedContactId.value,
      name: info?.角色名称 || selectedContactId.value,
      faction: info?.阵营 || '',
      affinity: info?.好感度 || 0,
      phase: info?.关系阶段 || '陌生人',
      rapport: info?.默契度 || 0,
      unread: info?.未读消息数 || 0,
    };
  });

  return {
    statData,
    activeView,
    selectedGarageSlot,
    selectedContactId,
    lastUpdate,
    pilotData,
    driveData,
    syncData,
    garageData,
    commsData,
    missionsData,
    currentMechName,
    currentMech,
    mechBuild,
    mechOverview,
    weaponsMount,
    availableParts,
    commsList,
    missionsList,
    selectedContact,
    fetchData,
    setActiveView,
    setGarageSlot,
    setContact,
    updateMechPart,
    getVal,
    fmtNum,
  };
});
