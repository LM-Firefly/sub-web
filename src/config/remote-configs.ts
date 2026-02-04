export const remoteConfigs = [
  { label: "默认", options: [{ label: "默认不选, 使用后端默认pref配置", value: "" }] },
  {
    label: "LM-Firefly (Online, 与Github 同步)",
    options: [
      { label: "MultiSub-NoReject", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/MultiSub-NoReject.toml" },
      { label: "AllSub-NoReject", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AllSub-NoReject.toml" },
      { label: "MultiSub-AdBlock", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/MultiSub-AdBlock.toml" },
      { label: "AllSub-AdBlock", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AllSub-AdBlock.toml" },
      { label: "AIO", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AIO.toml" },
      { label: "AIO-NoReject", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AIO-NoReject.toml" },
      { label: "CordCloud", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/CordCloud.toml" },
      { label: "CordCloud-NoReject", value: "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/CordCloud-NoReject.toml" }
    ]
  },
  {
    label: "ACL4SSR (Online, 与Github 同步)",
    options: [
      { label: "ACL4SSR 默认版 分组比较全", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini" },
      { label: "ACL4SSR 更多去广告", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini" },
      { label: "ACL4SSR 全分组 自动测速、故障转移、负载均衡", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini" },
      { label: "ACL4SSR 全分组 重度用户使用", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini" },
      { label: "ACL4SSR 全分组 重度用户使用 更多去广告", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini" },
      { label: "ACL4SSR 全分组 重度用户使用 奈飞全量", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini" },
      { label: "ACL4SSR 全分组 无自动测速 重度用户使用", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini" },
      { label: "ACL4SSR 精简版", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini" },
      { label: "ACL4SSR 精简版 带港美日国家", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini" },
      { label: "ACL4SSR 精简版 更多去广告", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini" },
      { label: "ACL4SSR 精简版 带故障转移", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini" },
      { label: "ACL4SSR 精简版 自动测速、故障转移、负载均衡", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini" },
      { label: "ACL4SSR 精简版 不带自动测速", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini" },
      { label: "ACL4SSR 无自动测速", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini" },
      { label: "ACL4SSR 无广告拦截规则", value: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini" }
    ]
  },
  {
    label: "Special",
    options: [
      { label: "NeteaseUnblock(仅规则, No-Urltest)", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini" },
      { label: "Basic(仅GEOIP CN + Final)", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini" }
    ]
  },
];
