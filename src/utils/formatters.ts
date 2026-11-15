// 三值字段：null = 不覆写(不拼入 URL)，true/false = 显式拼接覆写值
export type TriState = boolean | null;

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
    // tri-state fields — null 时不拼接，由后端 pref/源节点自身值决定
    const triFields: Array<[string, string]> = [
      ['insert', 'insert'],
      ['appendType', 'append_type'],
      ['tfo', 'tfo'],
      ['tls13', 'tls13'],
      ['scv', 'scv'],
      ['udp', 'udp'],
      ['sort', 'sort'],
      ['fdn', 'fdn'],
    ];
    triFields.forEach(([fk, pk]) => {
      const val = form[fk] as TriState;
      if (val !== null && val !== undefined) params.append(pk, String(val));
    });
    // emoji=false 会被后端当作 remove_old_emoji=true 删掉源节点已有 emoji，"关闭"只表达"不添加"，故走 add_emoji/remove_emoji 细粒度参数
    if (form.emoji === true) {
      params.append('emoji', 'true');
    } else if (form.emoji === false) {
      params.append('add_emoji', 'false');
      params.append('remove_emoji', 'false');
    }
    // Rule-related — full targets only (not simple)
    // classic 与 Domain-Set 勾选为反相镜像设计；
    // expand=true 时 classic 不生效（managed prefix 清空、renderClashScript 不调用），不拼接
    // list=true 时输出纯节点列表（无 ruleset），expand/classic 均不生效，一并不拼接
    if (!isSimple) {
      if (form.nodeList) {
        params.append('list', 'true');
      } else {
        params.append('expand', String(!!form.expand));
        if (!form.expand) params.append('classic', String(!!form.classic));
        params.append('list', 'false');
      }
    }
    // clash-specific: new_name（三值，null 不拼）
    if (t === 'clash' && form.new_name !== null && form.new_name !== undefined) {
      params.append('new_name', String(form.new_name));
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
