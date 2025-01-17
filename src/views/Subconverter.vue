<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <template #header>
            <span class="brand-name">Firefly-SubConverter</span>
            <svg-icon icon-class="github" style="margin-left: 20px" @click="goToProject" />
            <svg-icon icon-class="telegram" style="margin-left: 20px" @click="gotoTgChannel" />
            <svg-icon icon-class="clash" style="margin-left: 20px" @click="gotoGayhubRuleset" />
            <div style="font-style: normal; font-size: 80%; text-align: right; margin-top: 5px;">{{ backendVersion }}
            </div>
          </template>
          <el-container>
            <el-form :model="form" label-width="90px" label-position="left" style="width: 100%; align-content: center;"
              class="sub-form">
              <el-form-item label="模式设置:">
                <el-radio v-model="advanced" label="1">基础模式</el-radio>
                <el-radio v-model="advanced" label="2">进阶模式</el-radio>
              </el-form-item>
              <el-form-item label="订阅链接:">
                <el-input v-model="form.sourceSubUrl" style="width: 100%" type="textarea" :rows="4"
                  placeholder="支持各种订阅链接或单节点链接, 多个链接每行一个或用 | 分隔" @blur="saveSubUrl" />
              </el-form-item>
              <el-form-item label="客户端项:">
                <el-select v-model="form.clientType" style="width: 100%">
                  <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v" />
                </el-select>
              </el-form-item>
              <el-form-item label="远程配置:">
                <el-select v-model="form.remoteConfig" style="width: 100%" allow-create filterable
                  placeholder="默认不选, 使用后端默认pref配置">
                  <el-link slot="append" @click="gotoRemoteConfig" style="margin-left: 20px"><el-icon>
                      <InfoFilled />
                    </el-icon>远程配置示例</el-link>
                  <el-option-group label-position="left" style="width: 100%" v-for="group in options.remoteConfig"
                    :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="后端地址:">
                <el-select v-model="form.customBackend" style="width: 100%" allow-create filterable>
                  <el-link slot="append" @click="gotoGayhub" style="margin-left: 20px"><el-icon>
                      <InfoFilled />
                    </el-icon>Docker快速部署Demo, 前往项目仓库</el-link>
                  <el-option v-for="(v, k) in options.customBackend" :key="k" :label="k" :value="v" />
                </el-select>
              </el-form-item>
              <div v-if="advanced === '2'">
                <el-form-item label="包含节点:">
                  <el-input v-model="form.includeRemarks" style="width: 100%" placeholder="包含有关键字的节点, 支持正则" />
                </el-form-item>
                <el-form-item label="排除节点:">
                  <el-input v-model="form.excludeRemarks" style="width: 100%" placeholder="不包含有关键字的节点, 支持正则" />
                </el-form-item>
                <el-form-item label="输出文件名:">
                  <el-input v-model="form.filename" style="width: 100%" placeholder="返回的订阅文件名" />
                </el-form-item>
                <el-form-item label="Clash.TUN:">
                  <el-select v-model="form.clashdns" style="width: 100%" allow-create filterable
                    placeholder="默认不开启TUN/TAP">
                    <el-option v-for="(v, k) in options.clashdns" :key="k" :label="k" :value="v"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="远程设备:">
                  <el-input v-model="form.devid" placeholder="用于设置QuantumultX的远程设备ID" />
                </el-form-item>
                <el-form-item v-for="(param, i) in customParams" :key="i"
                  style="display: flex; align-items: left; margin-bottom: 10px">
                  <el-input v-model="param.name" placeholder="自定义参数名"
                    style="width: 100px; margin-left: -90px; margin-right: 5px"></el-input>
                  <span style="margin-right: 5px">:</span>
                  <el-input v-model="param.value" placeholder="自定义参数内容" style="flex: 1; margin-right: 5px"></el-input>
                  <el-button @click="removeCustomParam(i)"><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </el-form-item>
                <el-form-item style="width: 100%; text-align: center" label-width="0px">
                  <el-row type="flex" justify="center">
                    <el-button-group>
                      <el-popover placement="bottom" v-model="extrasetVisible"
                        style="text-align: center; min-width: 600px;">
                        <el-row :gutter="10">
                          <el-checkbox v-model="form.new_name" label="Clash新字段"></el-checkbox>
                          <el-checkbox v-model="form.emoji" label="Emoji"></el-checkbox>
                          <el-checkbox v-model="form.appendType" label="节点类型"></el-checkbox>
                          <el-checkbox v-model="form.sort" label="排序节点"></el-checkbox>
                          <el-checkbox v-model="form.fdn" label="过滤非法节点"></el-checkbox>
                          <el-checkbox v-model="form.nodeList" label="输出为 Node List"></el-checkbox>
                          <el-checkbox v-model="form.tls13" label="开启TLS_1.3"></el-checkbox>
                          <el-checkbox v-model="form.insert" label="插入默认节点"></el-checkbox>
                        </el-row>
                        <template #reference>
                          <el-button><el-icon>
                              <Operation />
                            </el-icon>全局字段</el-button>
                        </template>
                      </el-popover>
                      <el-popover placement="bottom" v-model="extrasetVisible"
                        style="text-align: center; min-width: 600px;">
                        <el-row :gutter="10">
                          <el-checkbox v-model="form.udp" label="启用 UDP"></el-checkbox>
                          <el-checkbox v-model="form.tfo" label="TCP Fast Open"></el-checkbox>
                          <el-checkbox v-model="form.scv" label="Skip Cert Verify"></el-checkbox>
                          <el-checkbox v-model="form.xudp" label="启用 XUDP"></el-checkbox>
                        </el-row>
                        <template #reference>
                          <el-button><el-icon>
                              <Setting />
                            </el-icon>节点字段</el-button>
                        </template>
                      </el-popover>
                      <el-popover placement="bottom" v-model="ruleVisible"
                        style="text-align: center; min-width: 200px;">
                        <el-row :gutter="10">
                          <el-checkbox v-model="form.expand" label="展开规则"></el-checkbox>
                        </el-row>
                        <el-row :gutter="10">
                          <el-checkbox v-model="form.classic" label="Classic Rule-Providers"
                            style="white-space: normal"></el-checkbox>
                        </el-row>
                        <template #reference>
                          <el-button><el-icon>
                              <Expand />
                            </el-icon>Rule-Providers</el-button>
                        </template>
                      </el-popover>
                      <el-popover placement="top-end" title="添加自定义转换参数" trigger="hover">
                        <el-link type="primary" :href="subDocAdvanced" target="_blank"><el-icon>
                            <InfoFilled />
                          </el-icon>参考文档</el-link>
                        <template #reference>
                          <el-button @click="addCustomParam"><el-icon>
                              <Plus />
                            </el-icon></el-button>
                        </template>
                      </el-popover>
                    </el-button-group>
                  </el-row>
                </el-form-item>
              </div>
              <div style="margin-top: 50px"></div>
              <el-divider content-position="center"><el-icon>
                  <MagicStick />
                </el-icon></el-divider>
              <el-form-item label="定制订阅:" label-width="90px" label-position="left" style="width: 100%">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <template #append>
                    <el-button @click="copyToClipboard(customSubUrl)" ref="copy-btn"><el-icon>
                        <DocumentCopy />
                      </el-icon>复制</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <div style="margin-top: 20px; display: flex; justify-content: center;">
                <el-row type="flex" justify="center">
                  <el-col :span="24" style="text-align: center">
                    <el-button style="width: 120px;" type="danger" @click="makeUrl"
                      :disabled="form.sourceSubUrl.length === 0"><el-icon>
                        <Document />
                      </el-icon>生成订阅链接</el-button>
                    <el-button style="width: 120px; margin-left: 10px" type="danger" @click="clashInstall"
                      :disabled="customSubUrl.length === 0"><el-icon>
                        <DocumentChecked />
                      </el-icon>一键导入Clash</el-button>
                    <!-- <el-button style="width: 144px;" type="primary" @click="surgeInstall" icon="el-icon-connection">一键导入Surge</el-button> -->
                  </el-col>
                  <el-row>
                    <el-button style="width: 250px; margin-top: 10px;" type="primary" @click="openLoadConfigDialog"
                      :loading="loading"><el-icon>
                        <Link />
                      </el-icon>从URL解析</el-button>
                  </el-row>
                </el-row>
              </div>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogLoadConfigVisible" :show-close="false" :close-on-click-modal="false"
      :close-on-press-escape="false" width="80vw" style="max-width: 100%;">
      <template #header>可以从老的订阅信息中解析信息,填入页面中去</template>
      <el-form label-position="left" style="width: 100%">
        <el-form-item prop="uploadConfig">
          <el-input v-model="loadConfig" type="textarea" :autosize="{ minRows: 15, maxRows: 30 }" maxlength="10000"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="loadConfig = ''; dialogLoadConfigVisible = false;">取 消</el-button>
        <el-button type="primary" @click="confirmLoadConfig" :disabled="loadConfig.length === 0">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { ElNotification } from 'element-plus';
  const project = import.meta.env.VITE_PROJECT;
  const remoteConfigSample = import.meta.env.VITE_SUBCONVERTER_REMOTE_CONFIG;
  const gayhubSource = import.meta.env.VITE_BACKEND;
  const gayhubRuleset = import.meta.env.VITE_RULESET_LINK;
  const defaultBackend = import.meta.env.VITE_SUBCONVERTER_DEFAULT_BACKEND + "/sub?";
  const tgBotLink = import.meta.env.VITE_BOT_LINK;
  const subDocAdvanced = import.meta.env.VITE_SUBCONVERTER_DOC_ADVANCED;
  export default {
    data() {
      const phoneUserAgent = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const options = {
        clientTypes: {
          Clash: "clash",
          Surge: "surge&ver=4",
          Surge3: "surge&ver=3",
          Quantumult: "quan",
          QuantumultX: "quanx",
          Singbox: "singbox",
          Loon: "loon",
          Surfboard: "surfboard",
          "Shadowsocks(SIP002)": "ss",
          "Shadowsocks(SIP008)": "sssub",
          Mellow: "mellow",
          ShadowsocksR: "ssr",
          ShadowsocksD: "ssd",
          Surge2: "surge&ver=2",
          V2Ray: "v2ray",
          Trojan: "trojan",
          "混合订阅(mixed)": "mixed",
          自动判断客户端: "auto",
        },
        customBackend: {
          "localhost:25500/sub? 本地版": "http://localhost:25500/sub?",
          "fly-sub.fly.dev/sub?": "https://fly-sub.fly.dev/sub?",
          "sub.koyeb.app/sub?": "https://sub.koyeb.app/sub?",
          "zsub.zeabur.app/sub?": "https://zsub.zeabur.app/sub?",
          "render-sub.onrender.com/sub?": "https://render-sub.onrender.com/sub?",
          "flysub.firefly-lm.workers.dev/sub?": "https://flysub.firefly-lm.workers.dev/sub?",
          "sub.firefly-lm.workers.dev/sub?": "https://sub.firefly-lm.workers.dev/sub?",
          "rensub.firefly-lm.workers.dev/sub?": "https://rensub.firefly-lm.workers.dev/sub?",
        },
        clashdns: {
          "默认不开启TUN/TAP": "",
          tap: "tap",
          "win-tun": "win-tun",
          "linux-tun": "linux-tun",
          "meta-tun": "meta-tun",
        },
        remoteConfig: [
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
        ],
      };
      if (phoneUserAgent) {
        // 手机端优化label
        options.remoteConfig[1].options.forEach(opt => {
          if (opt.label.length > 10) opt.label = opt.label.replace(/\s.*/, "");
        });
        // 手机端优化customBackend
        const serverList = {};
        Object.keys(options.customBackend).forEach(k => {
          serverList[k.replace(/\(.*/, "")] = options.customBackend[k];
        });
        options.customBackend = serverList;
      }
      return {
        backendVersion: "",
        advanced: "1",
        isPC: true,
        options,
        extrasetVisible: false,
        ruleVisible: false,
        form: {
          appendType: false,
          clashdns: "", // 选择base.tpl 里面Clash DNS区块
          classic: false, // 是否使用 Clash Classic Rule Provider
          clientType: "",
          customBackend: "",
          emoji: true,
          excludeRemarks: "",
          expand: true, // 是否展开规则
          tls13: false,
          fdn: false,
          filename: "",
          devid: "",
          includeRemarks: "",
          insert: false, // 是否插入默认订阅的节点, 对应配置项 insert_url
          new_name: true, // 是否使用 Clash 新字段
          nodeList: false,
          remoteConfig: "",
          scv: false,
          sort: false,
          sourceSubUrl: "",
          tfo: false,
          udp: false,
          xudp: false,
        },
        customParams: [],
        loading: false,
        customSubUrl: "",
        loadConfig: "",
        dialogLoadConfigVisible: false,
        myBot: tgBotLink,
        sampleConfig: remoteConfigSample,
        subDocAdvanced: subDocAdvanced,
      };
    },
    created() {
      document.title = "Firefly-SubConverter";
      this.isPC = this.$getOS().isPc;
      if (import.meta.env.VITE_USE_STORAGE === "true") {
        this.form.sourceSubUrl = this.getLocalStorageItem("sourceSubUrl");
      }
    },
    mounted() {
      Object.assign(this.form, { clientType: "clash", customBackend: defaultBackend, remoteConfig: "", clashdns: "" });
      this.notify();
      this.getBackendVersion();
    },
    watch: {
      'form.classic'(val) { if (val) this.form.expand = false; },
      'form.nodeList'(val) { if (val) this.form.expand = false; },
      'form.customBackend': 'getBackendVersion'
    },
    methods: {
      goToProject: () => window.open(project),
      gotoTgChannel: () => window.open(tgBotLink),
      gotoGayhub: () => window.open(gayhubSource),
      gotoGayhubRuleset: () => window.open(gayhubRuleset),
      gotoRemoteConfig: () => window.open(remoteConfigSample),
      addCustomParam() { this.customParams.push({ name: "", value: "" }); },
      removeCustomParam(i) { this.customParams.splice(i, 1); },
      buildUrlParams() {
        const { form, advanced, customParams } = this;
        const backend = form.customBackend || defaultBackend;
        const params = new URLSearchParams();
        params.append('target', form.clientType);
        params.append('url', form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|"));
        if (form.remoteConfig) {
          params.append('config', form.remoteConfig);
        }

        if (advanced === '2') {
          const advancedParams = {
            insert: form.insert,
            expand: !form.nodeList ? form.expand : undefined,
            classic: form.classic && !form.nodeList && !form.expand ? true : undefined,
            exclude: form.excludeRemarks,
            include: form.includeRemarks,
            filename: form.filename,
            dev_id: form.devid,
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

          const booleanFalseExcludes = [
            'append_type', 'insert', 'tfo', 'tls13', 'scv', 'udp', 'xudp', 'sort', 'emoji', 'list', 'fdn', 'new_name'
          ];

          Object.entries(advancedParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (typeof value === 'boolean') {
                if (value === false && booleanFalseExcludes.includes(key)) {
                  return; // Skip if it's a boolean false that should be excluded
                }
                params.append(key, value ? 'true' : 'false');
              } else if (value) { // For non-empty strings
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
      },
      validateRequiredFields() {
        if (!this.form.sourceSubUrl || !this.form.clientType) {
          this.$message.error("订阅链接与客户端为必填项");
          return false;
        }
        return true;
      },
      makeUrl() {
        if (!this.validateRequiredFields()) return false;
        const { backend, queryParams } = this.buildUrlParams();
        this.customSubUrl = `${backend}${queryParams}`;
        this.copyToClipboard(this.customSubUrl);
        this.$message.success("定制订阅已复制到剪贴板");
      },
      notify() {
        ElNotification({
          title: "隐私提示",
          type: "warning",
          message: "各种订阅链接生成纯前端实现, 无隐私问题。默认提供后端转换服务, 隐私担忧者请自行搭建后端服务。",
          customClass: 'custom-notify',
          position: 'top-right',
          duration: 2000,
          showClose: true
        });
      },
      handleError(error, defaultMessage = '操作失败') {
        console.error(error);
        this.$message.error(error.response?.data?.message || error.message || defaultMessage);
        return false;
      },
      async analyzeUrl() {
        if (this.loadConfig.includes("target")) return this.loadConfig;
        this.loading = true;
        try {
          const response = await fetch(this.loadConfig, { method: "GET", redirect: "follow" });
          return response.url;
        } catch (error) {
          this.handleError(error, "解析短链接失败, 请检查短链接服务端是否配置跨域");
          throw error;
        } finally {
          this.loading = false;
        }
      },

      confirmLoadConfig() {
        if (!this.loadConfig.trim()) {
          this.$message.error("订阅链接不能为空");
          return false;
        }
        (async () => {
          try {
            const url = new URL(await this.analyzeUrl());
            this.form.customBackend = url.origin + url.pathname + "?";
            const params = new URLSearchParams(url.search);
            const excludeParams = new Set();
            const getParam = key => (excludeParams.add(key), params.get(key));
            // 基础参数
            const target = getParam("target");
            this.form.clientType = target === "surge" ? target + "&ver=" + (getParam("ver") || "4") : target;
            // 表单参数映射
            const paramMappings = {
              url: { key: 'sourceSubUrl', processor: v => decodeURIComponent(v).replace(/\|/g, "\n") },
              insert: { key: 'insert' },
              config: { key: 'remoteConfig' },
              exclude: { key: 'excludeRemarks' },
              include: { key: 'includeRemarks' },
              filename: { key: 'filename' },
              dev_id: { key: 'devid' },
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
                  this.form[key] = processor(value);
                } else if (typeof this.form[key] === 'boolean') {
                  this.form[key] = value === 'true' || value === '1';
                } else {
                  this.form[key] = value;
                }
              }
            });
            // 自定义参数
            this.customParams = Array.from(params.entries())
              .filter(([key]) => !excludeParams.has(key) && key !== 'append_type' && key !== 'list')
              .map(([name, value]) => ({ name, value }));
            this.dialogLoadConfigVisible = false;
            this.$message.success("长/短链接已成功解析为订阅信息");
          } catch (error) {
            this.$message.error("请输入正确的订阅地址!");
          }
        })();
      },
      renderPost() {
        const { form } = this;
        const data = new FormData();
        const paramMappings = {
          clientType: 'target',
          sourceSubUrl: 'url',
          insert: 'insert',
          remoteConfig: 'config',
          excludeRemarks: 'exclude',
          includeRemarks: 'include',
          filename: 'filename',
          devid: 'dev_id',
          appendType: 'append_type',
          tfo: 'tfo',
          tls13: 'tls13',
          scv: 'scv',
          udp: 'udp',
          xudp: 'xudp',
          sort: 'sort',
          emoji: 'emoji',
          nodeList: 'list',
          clashdns: 'clash.dns',
          new_name: 'newname',
          fdn: 'fdn',
          expand: 'expand',
          classic: 'classic'
        };
        Object.entries(paramMappings).forEach(([formKey, paramKey]) => {
          data.append(paramKey, encodeURIComponent(form[formKey].toString()));
        });
        return data;
      },
      async getBackendVersion() {
        try {
          const url = `${this.form.customBackend.substring(0, this.form.customBackend.length - 5)}/version`;
          const { data } = await this.$axios.get(url);
          this.backendVersion = data.replace(/backend\n$/gm, "").replace("subconverter", "");
        } catch {
          this.$alert('<span style="color: orange;">获取后端版本信息失败, 当前后端不可用！</span>', "提示", { type: "error", dangerouslyUseHTMLString: true });
        }
      },
      saveSubUrl() {
        if (this.form.sourceSubUrl) this.setLocalStorageItem("sourceSubUrl", this.form.sourceSubUrl);
      },
      getLocalStorageItem(itemKey) {
        const now = +new Date();
        const ls = localStorage.getItem(itemKey);
        if (!ls) return "";
        const data = JSON.parse(ls);
        if (data.expire > now) return data.value;
        localStorage.removeItem(itemKey);
        return "";
      },
      setLocalStorageItem(itemKey, itemValue) {
        const ttl = parseInt(import.meta.env.VITE_CACHE_TTL);
        const now = +new Date();
        localStorage.setItem(itemKey, JSON.stringify({ setTime: now, ttl, expire: now + ttl * 1000, value: itemValue }));
      },
      filterRemoteConfig(query) {
        if (!query) return this.options.remoteConfig;
        return this.options.remoteConfig.map(group => ({
          ...group,
          options: group.options.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
        }));
      },
      openLoadConfigDialog() { this.dialogLoadConfigVisible = true; },
      copyToClipboard(text) {
        if (!text) return this.$message.error("没有可复制的内容");
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => this.$message.success("已复制到剪贴板")).catch(() => this.$message.error("复制失败, 请手动复制"));
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          try { document.execCommand("copy"); this.$message.success("已复制到剪贴板"); }
          catch { this.$message.error("复制失败, 请手动复制"); }
          document.body.removeChild(textarea);
        }
      },
      clashInstall() {
        if (!this.validateRequiredFields(["customSubUrl"], "请先填写必填项, 生成订阅链接")) return false;
        const url = "clash://install-config?url=";
        window.open(url + encodeURIComponent(this.customShortSubUrl && this.customShortSubUrl !== "" ? this.customShortSubUrl : this.customSubUrl));
      },
      surgeInstall() {
        if (!this.validateRequiredFields(["customSubUrl"], "请先填写必填项, 生成订阅链接")) return false;
        window.open("surge://install-config?url=" + this.customSubUrl);
      }
    },
  };
</script>
