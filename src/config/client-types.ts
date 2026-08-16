// 客户端类型配置  { target, ver? }
export interface ClientTypeEntry {
  target: string;
  ver?: string;
}
export const clientTypes: Record<string, ClientTypeEntry> = {
  Clash: { target: "clash" },
  Surge: { target: "surge", ver: "5" },
  Surge4: { target: "surge", ver: "4" },
  Quantumult: { target: "quan" },
  QuantumultX: { target: "quanx" },
  Singbox: { target: "singbox" },
  Loon: { target: "loon" },
  Surfboard: { target: "surfboard" },
  "Shadowsocks(SIP002)": { target: "ss" },
  "Shadowsocks(SIP008)": { target: "sssub" },
  Mellow: { target: "mellow" },
  ShadowsocksR: { target: "ssr" },
  ShadowsocksD: { target: "ssd" },
  V2Ray: { target: "v2ray" },
  Trojan: { target: "trojan" },
  "混合订阅(mixed)": { target: "mixed" },
  自动判断客户端: { target: "auto" },
};
