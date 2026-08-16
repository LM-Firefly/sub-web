import { ref } from 'vue';
import { getBackendVersion } from '@/services/backendService';

export function useBackend() {
  const backendVersion = ref("");

  const fetchBackendVersion = async (backendUrl: string) => {
    if (!backendUrl) return;
    try {
      backendVersion.value = await getBackendVersion(backendUrl);
    } catch {
      ElMessageBox.alert('<span style="color: orange;">获取后端版本信息失败, 当前后端不可用！</span>', "提示", { type: "error", dangerouslyUseHTMLString: true });
    }
  };
  return {
    backendVersion,
    fetchBackendVersion
  };
}
