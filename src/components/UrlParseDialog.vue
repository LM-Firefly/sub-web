<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80vw"
    style="max-width: 100%;"
  >
    <template #header>可以从老的订阅信息中解析信息, 填入页面中去</template>
    <el-form label-position="left" style="width: 100%">
      <el-form-item prop="uploadConfig">
        <el-input
          v-model="configContent"
          type="textarea"
          :autosize="{ minRows: 15, maxRows: 30 }"
          maxlength="10000"
          show-word-limit
          placeholder="请输入订阅链接或相关配置 URL"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="!configContent.trim()"
        :loading="loading"
      >确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { fetchConfig } from '@/services/backendService';
import { parseConfigParams } from '@/utils/search';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'config-loaded', payload: { formUpdates: any, customParams: any[] }): void;
}>();

const configContent = ref("");
const loading = ref(false);

const handleCancel = () => {
  configContent.value = "";
  emit('update:visible', false);
};

const handleConfirm = async () => {
  const content = configContent.value;
  if (!content.trim()) {
    ElMessage.error("订阅链接不能为空");
    return;
  }
  loading.value = true;
  try {
    let urlStr = content;
    if (!content.includes("target")) {
      urlStr = await fetchConfig(content);
    }
    const url = new URL(urlStr);
    const { formUpdates, customParams } = parseConfigParams(url);
    emit('config-loaded', { formUpdates, customParams });
    ElMessage.success("长/短链接已成功解析为订阅信息");
    handleCancel();
  } catch (error) {
    console.error(error);
    ElMessage.error("请输入正确的订阅地址!");
  } finally {
    loading.value = false;
  }
};

watch(() => props.visible, (val) => {
  if (!val) {
    // optional cleanup or reset if needed, but we do it on cancel/confirm
  }
});
</script>
