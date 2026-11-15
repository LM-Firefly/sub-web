import { reactive, ref, watch, computed } from 'vue';
import { validateRequiredFields } from '@/utils/validators';
import { buildUrlParams, type TriState } from '@/utils/formatters';
import { copyToClipboard } from '@/utils/index';
import { setLocalStorageItem } from '@/utils/storage';

export function useSubconverter(defaultBackend: string) {
  const advanced = ref("1");
  const customSubUrl = ref("");
  const form = reactive({
    sourceSubUrl: "",
    clientType: {} as Record<string, any>,
    remoteConfig: "",
    customBackend: "",
    includeRemarks: "",
    excludeRemarks: "",
    filename: "",
    clashdns: "",
    agekey: "",
    devid: "",
    ua: "",
    nodeList: false,
    expand: false,
    classic: false,
    // 三值字段（TriState）：null = 不覆写(不拼入 URL)，true/false = 显式覆写
    appendType: null as TriState,
    emoji: null as TriState,
    tls13: null as TriState,
    fdn: null as TriState,
    insert: null as TriState,
    new_name: null as TriState,
    scv: null as TriState,
    sort: null as TriState,
    tfo: null as TriState,
    udp: null as TriState,
  });
  const customParams = ref<Array<{ name: string; value: string }>>([]);
  // Computed
  const canMakeUrl = computed(() => !!(form.sourceSubUrl && form.clientType?.target));
  const canInstall = computed(() => !!customSubUrl.value);
  // domainSet: UI-level "use Domain-Set rules" — inverted from classic (classic=true means non-domain-set)
  const domainSet = computed({
    get: () => !form.classic,
    set: (val: boolean) => { form.classic = !val; },
  });
  // Watchers — domainSet/expand mutual exclusion (domainSet = !classic)
  watch(domainSet, (val) => {
    if (val) form.expand = false; // domain-set on → turn off expand
  });
  watch(() => form.expand, (val) => {
    if (val) form.classic = true; // expand on → classic=true → domainSet=false
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
  return {
    form,
    advanced,
    customParams,
    customSubUrl,
    canMakeUrl, // exposed computed
    canInstall, // exposed computed
    domainSet, // inverted classic for UI
    saveSubUrl,
    makeUrl,
    clashInstall,
    surgeInstall,
    addCustomParam,
    removeCustomParam,
    checkRequired,
  };
}
