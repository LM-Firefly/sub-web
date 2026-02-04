import { reactive, ref, watch, computed } from 'vue';
import { validateRequiredFields } from '@/utils/validators';
import { buildUrlParams } from '@/utils/formatters';
import { copyToClipboard } from '@/utils/index';
import { setLocalStorageItem } from '@/utils/storage';

export function useSubconverter(defaultBackend: string) {
  const advanced = ref("1");
  const customSubUrl = ref("");
  const form = reactive({
    appendType: false,
    clashdns: "",
    classic: false,
    clientType: "",
    customBackend: "",
    emoji: true,
    excludeRemarks: "",
    expand: true,
    tls13: false,
    fdn: false,
    filename: "",
    devid: "",
    ua: "",
    includeRemarks: "",
    insert: false,
    new_name: true,
    nodeList: false,
    remoteConfig: "",
    scv: false,
    sort: false,
    sourceSubUrl: "",
    tfo: false,
    udp: false,
    xudp: false,
  });
  const customParams = ref<Array<{ name: string; value: string }>>([]);
  // Computed
  const canMakeUrl = computed(() => !!(form.sourceSubUrl && form.clientType));
  const canInstall = computed(() => !!customSubUrl.value);
  // Watchers
  watch(() => form.classic, (val) => {
    if (val) form.expand = false;
  });
  watch(() => form.expand, (val) => {
    if (val) form.classic = false;
  });
  watch(() => form.nodeList, (val) => {
    if (val) form.expand = false;
  });
  const saveSubUrl = () => {
    if (form.sourceSubUrl) setLocalStorageItem("sourceSubUrl", form.sourceSubUrl);
  };
  const checkRequired = () => {
    const { valid, message } = validateRequiredFields(form);
    if (!valid && message) {
      ElMessage.error(message);
      return false;
    }
    return true;
  };
  const makeUrl = () => {
    if (!checkRequired()) return false;
    const { backend, queryParams } = buildUrlParams(form, advanced.value, customParams.value, defaultBackend);
    customSubUrl.value = `${backend}${queryParams}`;
    copyToClipboard(customSubUrl.value).then(() => {
        ElMessage.success("定制订阅已复制到剪贴板");
    }).catch(err => {
        ElMessage.error(err as string);
    });
  };
  const clashInstall = () => {
    if (!customSubUrl.value) return;
    const url = "clash://install-config?url=";
    window.open(url + encodeURIComponent(customSubUrl.value));
  };
  const surgeInstall = () => {
    if (!customSubUrl.value) return;
    window.open("surge://install-config?url=" + customSubUrl.value);
  };
  const addCustomParam = () => customParams.value.push({ name: "", value: "" });
  const removeCustomParam = (i: number) => customParams.value.splice(i, 1);
  const notify = () => {
    ElNotification({
      title: "隐私提示",
      type: "warning",
      message: "各种订阅链接生成纯前端实现, 无隐私问题。默认提供后端转换服务, 隐私担忧者请自行搭建后端服务。",
      customClass: 'custom-notify',
      position: 'top-right',
      duration: 2000,
      showClose: true
    });
  };
  return {
    form,
    advanced,
    customParams,
    customSubUrl,
    canMakeUrl, // exposed computed
    canInstall, // exposed computed
    saveSubUrl,
    makeUrl,
    clashInstall,
    surgeInstall,
    addCustomParam,
    removeCustomParam,
    checkRequired, // maybe not needed to expose if only used internally by makeUrl? But original used it in surgeInstall separately?
    // original surgeInstall used validateRequiredFields. Here I use customSubUrl check for install buttons.
    notify
  };
}
