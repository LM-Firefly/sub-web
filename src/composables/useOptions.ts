import { reactive, ref, watch, onMounted } from 'vue';
import { clientTypes } from '@/config/client-types';
import { remoteConfigs } from '@/config/remote-configs';
import { customBackendDirectives, clashDnsOptions } from '@/config/constants';

export function useOptions() {
  const phoneUserAgent = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const options = reactive({
    clientTypes,
    customBackend: { ...customBackendDirectives },
    clashdns: clashDnsOptions,
    remoteConfig: JSON.parse(JSON.stringify(remoteConfigs)) // deep copy to avoid mutation issues if any
  });
  if (phoneUserAgent) {
    options.remoteConfig[1].options.forEach((opt: any) => {
      if (opt.label.length > 10) opt.label = opt.label.replace(/\s.*/, "");
    });
    const serverList: Record<string, string> = {};
    Object.keys(options.customBackend).forEach(k => {
      serverList[k.replace(/\(.*/, "")] = options.customBackend[k as keyof typeof options.customBackend];
    });
    options.customBackend = serverList;
  }
  return {
    options,
    phoneUserAgent
  };
}
