export const buildUrlParams = (
  form: any,
  advanced: string,
  customParams: Array<{ name: string; value: string }>,
  defaultBackend: string
) => {
  const backend = form.customBackend || defaultBackend;
  const params = new URLSearchParams();
  // target / ver — clientType now stores { target, ver? }
  const client = form.clientType || {};
  params.append('target', client.target || '');
  if (client.ver) {
    params.append('ver', client.ver);
  }
  params.append('url', form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|"));
  if (form.remoteConfig) {
    params.append('config', form.remoteConfig);
  }
  if (advanced === '2') {
    // mapping: [frontendKey, paramKey]
    const simpleFields: Array<[string, string]> = [
      ['excludeRemarks', 'exclude'],
      ['includeRemarks', 'include'],
      ['filename', 'filename'],
      ['devid', 'dev_id'],
      ['ua', 'ua'],
    ];
    simpleFields.forEach(([fk, pk]) => {
      const val = form[fk];
      if (val) params.append(pk, val);
    });
    // boolean fields — always send true/false so backend tribool can be overridden
    const booleanFields: Array<[string, string]> = [
      ['insert', 'insert'],
      ['expand', 'expand'],
      ['classic', 'classic'],
      ['appendType', 'append_type'],
      ['tfo', 'tfo'],
      ['tls13', 'tls13'],
      ['scv', 'scv'],
      ['udp', 'udp'],
      ['xudp', 'xudp'],
      ['sort', 'sort'],
      ['emoji', 'emoji'],
      ['nodeList', 'list'],
      ['fdn', 'fdn'],
    ];
    booleanFields.forEach(([fk, pk]) => {
      params.append(pk, form[fk] ? 'true' : 'false');
    });
    // clash-specific: new_name only when target is clash
    if (client.target === 'clash') {
      params.append('new_name', form.new_name ? 'true' : 'false');
    }
    if (client.target === 'clash' && form.clashdns) {
      params.append('clash.dns', form.clashdns);
    }
    if (form.agekey && client.target === 'clash') {
      params.append('agekey', form.agekey);
    }
    customParams.forEach(({ name, value }) => {
      if (name && value) {
        params.append(name, value);
      }
    });
  }
  return { backend, queryParams: params.toString() };
};
