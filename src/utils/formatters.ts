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
  const t = client.target || '';
  params.append('target', t);
  if (client.ver) {
    params.append('ver', client.ver);
  }
  params.append('url', form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|"));
  if (form.remoteConfig) {
    params.append('config', form.remoteConfig);
  }
  if (advanced === '2') {
    // Simple targets: ss/ssd/ssr/sssub/v2ray/trojan/mixed — node-only, no rules
    const isSimple = ['ss', 'ssd', 'ssr', 'sssub', 'v2ray', 'trojan', 'mixed'].includes(t);
    // string fields — always applicable
    const simpleFields: Array<[string, string]> = [
      ['excludeRemarks', 'exclude'],
      ['includeRemarks', 'include'],
      ['filename', 'filename'],
      ['ua', 'ua'],
    ];
    simpleFields.forEach(([fk, pk]) => {
      const val = form[fk];
      if (val) params.append(pk, val);
    });
    // dev_id — QuantumultX only
    if (t === 'quanx' && form.devid) {
      params.append('dev_id', form.devid);
    }
    // boolean fields — universal (all targets)
    const universalBooleans: Array<[string, string]> = [
      ['insert', 'insert'],
      ['appendType', 'append_type'],
      ['tfo', 'tfo'],
      ['tls13', 'tls13'],
      ['scv', 'scv'],
      ['udp', 'udp'],
      ['xudp', 'xudp'],
      ['sort', 'sort'],
      ['emoji', 'emoji'],
      ['fdn', 'fdn'],
    ];
    universalBooleans.forEach(([fk, pk]) => {
      params.append(pk, form[fk] ? 'true' : 'false');
    });
    // Rule-related — full targets only (not simple)
    if (!isSimple) {
      params.append('expand', form.expand ? 'true' : 'false');
      params.append('classic', form.classic ? 'true' : 'false');
      params.append('list', form.nodeList ? 'true' : 'false');
    }
    // clash-specific: new_name
    if (t === 'clash') {
      params.append('new_name', form.new_name ? 'true' : 'false');
    }
    // clash.dns — Clash TUN only
    if (t === 'clash' && form.clashdns) {
      params.append('clash.dns', form.clashdns);
    }
    // agekey — decrypts age-encrypted subscription source, target-independent
    if (form.agekey) {
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
