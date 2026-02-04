export const buildUrlParams = (
  form: any,
  advanced: string,
  customParams: Array<{ name: string; value: string }>,
  defaultBackend: string
) => {
  const backend = form.customBackend || defaultBackend;
  const params = new URLSearchParams();
  params.append('target', form.clientType);
  params.append('url', form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|"));
  if (form.remoteConfig) {
    params.append('config', form.remoteConfig);
  }
  if (advanced === '2') {
    const advancedParams: Record<string, any> = {
      insert: form.insert,
      expand: !form.nodeList ? form.expand : undefined,
      classic: form.classic && !form.nodeList && !form.expand ? true : undefined,
      exclude: form.excludeRemarks,
      include: form.includeRemarks,
      filename: form.filename,
      dev_id: form.devid,
      ua: form.ua,
      append_type: form.appendType,
      tfo: form.tfo,
      tls13: form.tls13,
      scv: form.scv,
      udp: form.udp,
      xudp: form.xudp,
      sort: form.sort,
      emoji: form.emoji,
      list: form.nodeList,
      fdn: form.fdn,
      new_name: form.clientType === 'clash' && form.new_name ? true : undefined,
    };
    const booleanFalseExcludes = ['append_type', 'insert', 'tfo', 'tls13', 'scv', 'udp', 'xudp', 'sort', 'emoji', 'list', 'fdn', 'new_name'];
    Object.entries(advancedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
          if (value === false && booleanFalseExcludes.includes(key)) {
            return;
          }
          params.append(key, value ? 'true' : 'false');
        } else if (value) {
          params.append(key, value);
        }
      }
    });
    if (form.clientType === 'clash' && form.clashdns) {
      params.append('clash.dns', form.clashdns);
    }
    customParams.forEach(({ name, value }) => {
      if (name && value) {
        params.append(name, value);
      }
    });
  }
  return { backend, queryParams: params.toString() };
};
