<template>
  <el-tooltip :content="hint" placement="right" effect="light" :show-after="200">
    <span
      class="tsc"
      :class="[`is-${stateKey}`, { 'is-disabled': disabled }]"
      role="checkbox"
      :aria-checked="modelValue === null ? 'mixed' : String(!!modelValue)"
      :aria-disabled="disabled"
      tabindex="0"
      @click="cycle"
      @keydown.space.prevent="cycle"
      @keydown.enter.prevent="cycle"
    >
      <span class="tsc__box"></span>
      <span class="tsc__label">{{ label }}</span>
      <span class="tsc__state">{{ stateText }}</span>
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TriState } from '@/utils/formatters';

const props = withDefaults(defineProps<{
  label: string;
  modelValue: TriState;
  disabled?: boolean;
}>(), { disabled: false });

const emit = defineEmits<{ (e: 'update:modelValue', value: TriState): void }>();

// 点击循环：默认(不覆写) → 强制开 → 强制关
const cycle = () => {
  if (props.disabled) return;
  const next: TriState = props.modelValue === null ? true : props.modelValue === true ? false : null;
  emit('update:modelValue', next);
};

const stateKey = computed(() => (props.modelValue === null ? 'auto' : props.modelValue ? 'on' : 'off'));
const stateText = computed(() => (stateKey.value === 'auto' ? '默认' : stateKey.value === 'on' ? '开' : '关'));
const hint = computed(() => `${props.label}：${stateText.value}｜点击切换：默认(不覆写) → 开 → 关`);
</script>

<style scoped>
.tsc {
  display: inline-flex;
  align-items: center;
  height: 32px;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.tsc__box {
  width: 14px;
  height: 14px;
  border: 1px solid var(--el-border-color);
  border-radius: 2px;
  background: var(--el-fill-color-blank);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, background-color 0.2s;
}
.tsc:hover .tsc__box {
  border-color: var(--el-color-primary);
}
.tsc.is-on .tsc__box {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.tsc.is-on .tsc__box::after {
  content: '';
  width: 3px;
  height: 7px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
}
.tsc.is-auto .tsc__box {
  border-color: var(--el-color-primary);
}
.tsc.is-auto .tsc__box::after {
  content: '';
  width: 8px;
  height: 2px;
  background: var(--el-color-primary);
  border-radius: 1px;
}
.tsc:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
.tsc.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.tsc__state {
  font-size: 11px;
}
.tsc.is-auto .tsc__state {
  color: var(--el-text-color-secondary);
}
.tsc.is-on .tsc__state {
  color: var(--el-color-success);
}
.tsc.is-off .tsc__state {
  color: var(--el-color-danger);
}
</style>
