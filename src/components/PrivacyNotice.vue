<template>
  <Transition name="privacy-fade">
    <el-alert
      v-if="visible"
      title="隐私提示"
      type="warning"
      show-icon
      :closable="true"
      @close="dismiss"
      class="privacy-notice"
    >
      订阅链接的生成过程完全在前端完成，不会上传您的隐私数据。如对默认转换后端有顾虑，请自行部署后端服务。
    </el-alert>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const dismiss = () => {
  visible.value = false;
  if (timer) clearTimeout(timer);
};

onMounted(() => {
  visible.value = true;
  timer = setTimeout(dismiss, 5000);
});
</script>

<style scoped>
.privacy-notice {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 360px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.privacy-fade-enter-active {
  transition: opacity 0.3s ease;
}
.privacy-fade-leave-active {
  transition: opacity 0.6s ease;
}
.privacy-fade-enter-from,
.privacy-fade-leave-to {
  opacity: 0;
}
</style>
