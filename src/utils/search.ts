export const parseConfigParams = (
  url: URL
): { formUpdates: Record<string, any>; customParams: Array<{ name: string; value: string }> } => {
  const params = new URLSearchParams(url.search);
  const excludeParams = new Set<string>();
  const getParam = (key: string) => {
    excludeParams.add(key);
    return params.get(key);
  };
  const formUpdates: Record<string, any> = {};
  const target = getParam("target");
  formUpdates.clientType = target === "surge" ? target + "&ver=" + (getParam("ver") || "4") : target || "";
  formUpdates.customBackend = url.origin + url.pathname + "?";
  const paramMappings: Record<string, { key: string; processor?: (v: string) => any }> = {
    url: { key: 'sourceSubUrl', processor: v => decodeURIComponent(v).replace(/\|/g, "\n") },
    insert: { key: 'insert' },
    config: { key: 'remoteConfig' },
    exclude: { key: 'excludeRemarks' },
    include: { key: 'includeRemarks' },
    filename: { key: 'filename' },
    dev_id: { key: 'devid' },
    ua: { key: 'ua' },
    append_type: { key: 'appendType' },
    tfo: { key: 'tfo' },
    tls13: { key: 'tls13' },
    scv: { key: 'scv' },
    udp: { key: 'udp' },
    xudp: { key: 'xudp' },
    sort: { key: 'sort' },
    emoji: { key: 'emoji' },
    list: { key: 'nodeList' },
    'clash.dns': { key: 'clashdns' },
    new_name: { key: 'new_name' },
    fdn: { key: 'fdn' },
    expand: { key: 'expand' },
    classic: { key: 'classic' }
  };
  Object.entries(paramMappings).forEach(([param, { key, processor }]) => {
    const value = getParam(param);
    if (value !== null) {
      if (processor) {
        formUpdates[key] = processor(value);
      } else {
        if (value === 'true') formUpdates[key] = true;
        else if (value === 'false') formUpdates[key] = false;
        else if (value === '1') {
           formUpdates[key] = true; 
        } else {
           formUpdates[key] = value;
        }
      }
    }
  });
  const customParams = Array.from(params.entries())
    .filter(([key]) => !excludeParams.has(key) && key !== 'append_type' && key !== 'list')
    .map(([name, value]) => ({ name, value }));
  return { formUpdates, customParams };
};
