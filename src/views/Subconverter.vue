<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <div slot="header">
            <span class="brand-name">Firefly-SubConverter</span>
            <svg-icon icon-class="github" style="margin-left: 20px" @click=" goToProject " />
            <svg-icon icon-class="telegram" style="margin-left: 20px" @click=" gotoTgChannel " />
            <svg-icon icon-class="clash" style="margin-left: 20px" @click=" gotoGayhubRuleset " />
            <div style="font-style: normal; font-size: 80%; text-align: right; margin-top: 5px;">{{ backendVersion }}
            </div>
          </div>
          <el-container>
            <el-form :model=" form " label-width="90px" label-position="left"
              style="width: 100%; align-content: center;  " class="sub-form">
              <el-form-item label="模式设置:">
                <el-radio v-model=" advanced " label="1">基础模式</el-radio>
                <el-radio v-model=" advanced " label="2">进阶模式</el-radio>
              </el-form-item>
              <el-form-item label="订阅链接:">
                <el-input v-model=" form.sourceSubUrl " style="width: 100%" type="textarea" :rows=" 4 "
                  placeholder="支持各种订阅链接或单节点链接，多个链接每行一个或用 | 分隔" @blur=" saveSubUrl " />
              </el-form-item>
              <el-form-item label="客户端项:">
                <el-select v-model=" form.clientType " style="width: 100%">
                  <el-option v-for=" ( v, k ) in options.clientTypes " :key=" k " :label=" k " :value=" v " />
                </el-select>
              </el-form-item>
              <el-form-item label="远程配置:">
                <el-select v-model=" form.remoteConfig " style="width: 100%" allow-create filterable
                  placeholder="默认不选，使用后端默认pref配置">
                  <div>
                    <el-link slot="append" @click=" gotoRemoteConfig "><el-icon>
                        <InfoFilled />
                      </el-icon>远程配置示例</el-link>
                  </div>
                  <el-option-group label-position="left" style="width: 100%" v-for=" group in options.remoteConfig "
                    :key=" group.label " :label=" group.label ">
                    <el-option v-for=" item in group.options " :key=" item.value " :label=" item.label "
                      :value=" item.value " />
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="后端地址:">
                <el-select v-model=" form.customBackend " style="width: 100%" allow-create filterable>
                  <div>
                    <el-link slot="append" @click=" gotoGayhub "><el-icon>
                        <InfoFilled />
                      </el-icon>Docker快速部署Demo，前往项目仓库</el-link>
                  </div>
                  <el-option v-for=" ( v, k ) in options.customBackend " :key=" k " :label=" k " :value=" v " />
                </el-select>
              </el-form-item>
              <div v-if=" advanced === '2' ">
                <el-form-item label="包含节点:">
                  <el-input v-model=" form.includeRemarks " style="width: 100%" placeholder="包含有关键字的节点，支持正则" />
                </el-form-item>
                <el-form-item label="排除节点:">
                  <el-input v-model=" form.excludeRemarks " style="width: 100%" placeholder="不包含有关键字的节点，支持正则" />
                </el-form-item>
                <el-form-item label="输出文件名:">
                  <el-input v-model=" form.filename " style="width: 100%" placeholder="返回的订阅文件名" />
                </el-form-item>
                <el-form-item label="Clash.TUN:">
                  <el-select v-model=" form.clashdns " style="width: 100%" allow-create filterable
                    placeholder="默认不开启TUN/TAP">
                    <el-option v-for=" ( v, k ) in options.clashdns " :key=" k " :label=" k " :value=" v "></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="远程设备:">
                  <el-input v-model=" form.devid " placeholder="用于设置QuantumultX的远程设备ID" />
                </el-form-item>
                <el-form-item v-for=" ( param, i ) in customParams " :key=" i "
                  style="display: flex; align-items: left; margin-bottom: 10px">
                  <el-input v-model=" param.name " placeholder="自定义参数名"
                    style="width: 100px; margin-left: -90px; margin-right: 5px"></el-input>
                  <span style="margin-right: 5px">:</span>
                  <el-input v-model=" param.value " placeholder="自定义参数内容" style="flex: 1; margin-right: 5px"></el-input>
                  <el-button type="text" @click="customParams.splice( i, 1 )"><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </el-form-item>
                <el-form-item style="width: 100%; text-align: center" label-width="0px">
                  <el-row type="flex">
                    <el-popover placement="bottom" v-model=" form.extraset "
                      style="text-align: center; min-width: 600px;">
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.new_name " label="Clash新字段"></el-checkbox>
                        <el-checkbox v-model=" form.emoji " label="Emoji"></el-checkbox>
                        <el-checkbox v-model=" form.appendType " label="节点类型"></el-checkbox>
                        <el-checkbox v-model=" form.sort " label="排序节点"></el-checkbox>
                        <el-checkbox v-model=" form.fdn " label="过滤非法节点"></el-checkbox>
                        <el-checkbox v-model=" form.nodeList " label="输出为 Node List"></el-checkbox>
                        <el-checkbox v-model=" form.tls13 " label="开启TLS_1.3"></el-checkbox>
                        <el-checkbox v-model=" form.insert " label="插入默认节点"></el-checkbox>
                      </el-row>
                      <template #reference>
                        <el-button><el-icon>
                            <Setting />
                          </el-icon>全局字段</el-button>
                      </template>
                    </el-popover>
                    <el-popover placement="bottom" v-model=" form.extraset "
                      style="text-align: center; min-width: 600px;">
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.udp " label="启用 UDP"></el-checkbox>
                        <el-checkbox v-model=" form.tfo " label="TCP Fast Open"></el-checkbox>
                        <el-checkbox v-model=" form.scv " label="Skip Cert Verify"></el-checkbox>
                        <el-checkbox v-model=" form.xudp " label="启用 XUDP"></el-checkbox>
                      </el-row>
                      <template #reference>
                        <el-button><el-icon>
                            <Setting />
                          </el-icon>节点字段</el-button>
                      </template>
                    </el-popover>
                    <el-popover placement="bottom" v-model=" form.rule " style="text-align: center; min-width: 200px;">
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.expand " label="展开规则"></el-checkbox>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.classic " label="Classic Rule Provider" style="white-space:
                          normal"></el-checkbox>
                      </el-row>
                      <template #reference>
                        <el-button style="margin-left: 10px">Rule Provider 选项</el-button>
                      </template>
                    </el-popover>
                    <el-popover placement="top-end" title="添加自定义转换参数" trigger="hover">
                      <el-link type="primary" :href=" subDocAdvanced " target="_blank"><el-icon>
                          <InfoFilled />
                        </el-icon>参考文档</el-link>
                      <template #reference>
                        <el-button @click=" addCustomParam " style="margin-left: 10px"><el-icon>
                            <Plus />
                          </el-icon></el-button>
                      </template>
                    </el-popover>
                  </el-row>
                </el-form-item>
              </div>
              <div style="margin-top: 50px"></div>
              <el-divider content-position="center"><el-icon>
                  <MagicStick />
                </el-icon>
              </el-divider>
              <el-form-item label="定制订阅:" label-width="90px" label-position="left" style="width: 100%">
                <el-input class="copy-content" disabled v-model=" customSubUrl ">
                  <el-button slot="append" v-clipboard:copy=" customSubUrl " v-clipboard:success=" onCopy "
                    ref="copy-btn" icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>
              <div style="margin-top: 20px; display: flex; justify-content: center;">
                <el-row type="flex" justify="center">
                  <el-col :span=" 24 " style="text-align: center">
                    <el-button style="width: 120px; " type="danger" @click=" makeUrl "
                      :disabled=" form.sourceSubUrl.length === 0 "><el-icon>
                        <Document />
                      </el-icon>生成订阅链接</el-button>
                    <el-button style="width: 120px; margin: 0 5px" type="danger" @click=" clashInstall "
                      :disabled=" customSubUrl.length === 0 "><el-icon>
                        <DocumentChecked />
                      </el-icon>一键导入Clash</el-button>
                    <!-- <el-button style="width: 144px; " type="primary" @click="surgeInstall" icon="el-icon-connection">一键导入Surge</el-button> -->
                  </el-col>
                  <el-row>
                    <el-button style="width: 250px; margin-top: 10px; " type="primary" @click=" openLoadConfigDialog "
                      :loading=" loading "><el-icon>
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
    <el-dialog v-model=" dialogLoadConfigVisible " :show-close=" false " :close-on-click-modal=" false "
      :close-on-press-escape=" false " width="80vw" style="max-width: 100%;">
      <div slot="title">可以从老的订阅信息中解析信息,填入页面中去</div>
      <el-form label-position="left" style="width: 100%">
        <el-form-item prop="uploadConfig">
          <el-input v-model=" loadConfig " type="textarea" :autosize=" { minRows: 15, maxRows: 30 } " maxlength="10000"
            show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" loadConfig = ''; dialogLoadConfigVisible = false;">取 消</el-button>
        <el-button type="primary" @click=" confirmLoadConfig " :disabled=" loadConfig.length === 0 ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const project = process.env.VUE_APP_PROJECT;
  const remoteConfigSample = process.env.VUE_APP_SUBCONVERTER_REMOTE_CONFIG;
  const gayhubSource = process.env.VUE_APP_BACKEND;
  const gayhubRuleset = process.env.VUE_APP_RULESET_LINK;
  const defaultBackend = process.env.VUE_APP_SUBCONVERTER_DEFAULT_BACKEND + "/sub?";
  const tgBotLink = process.env.VUE_APP_BOT_LINK;
  const subDocAdvanced = process.env.VUE_APP_SUBCONVERTER_DOC_ADVANCED;
  export default {
    data ()
    {
      var data = {
        backendVersion: "",
        advanced: 1,
        // 是否为 PC 端
        isPC: true,
        // 定义所有布尔类型表单字段
        booleanFields: [
          'appendType', 'emoji', 'tls13', 'fdn', 'nodeList', 'sort',
          'scv', 'tfo', 'udp', 'xudp', 'new_name', 'expand', 'classic'
        ],
        options: {
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
            "混合订阅（mixed）": "mixed",
            自动判断客户端: "auto",
          },
          customBackend: {
            "localhost:25500/sub? 本地版": "http://localhost:25500/sub?",
            "fly-sub.fly.dev/sub?": "https://fly-sub.fly.dev/sub?",
            "sub.koyeb.app/sub?": "https://sub.koyeb.app/sub?",
            "render-sub.onrender.com/sub?": "https://render-sub.onrender.com/sub?",
            "subs-fireflylzh.b4a.run/sub?": "https://subs-fireflylzh.b4a.run/sub?",
            "flysub.firefly-lm.workers.dev/sub?": "https://flysub.firefly-lm.workers.dev/sub?",
            "sub.firefly-lm.workers.dev/sub?": "https://sub.firefly-lm.workers.dev/sub?",
            "rensub.firefly-lm.workers.dev/sub?": "https://rensub.firefly-lm.workers.dev/sub?",
            "subs.firefly-lm.workers.dev/sub?": "https://subs.firefly-lm.workers.dev/sub?",
          },
          clashdns: {
            "默认不开启TUN/TAP": "",
            tap: "tap",
            "win-tun": "win-tun",
            "linux-tun": "linux-tun",
            "meta-tun": "meta-tun",
          },
          remoteConfig: [
            { label: "默认", options: [ { label: "默认不选，使用后端默认pref配置", value: "" } ] },
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
                { label: "NeteaseUnblock(仅规则，No-Urltest)", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini" },
                { label: "Basic(仅GEOIP CN + Final)", value: "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini" }
              ]
            },
          ],
        },
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
          insert: false, // 是否插入默认订阅的节点，对应配置项 insert_url
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
      let phoneUserAgent =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if ( phoneUserAgent )
      {
        let acl4ssrConfig = data.options.remoteConfig[ 1 ].options;
        for ( let i = 0; i < acl4ssrConfig.length; i++ )
        {
          if ( acl4ssrConfig[ i ].label.length > 10 )
          {
            acl4ssrConfig[ i ].label = acl4ssrConfig[ i ].label.replace( /\s.*/, "" );
          }
        }
        var serverList = {};
        let serverKeys = Object.keys( data.options.customBackend );
        for ( let i = 0; i < serverKeys.length; i++ )
        {
          let key = serverKeys[ i ].replace( /\(.*/, "" );
          serverList[ key ] = data.options.customBackend[ serverKeys[ i ] ];
        }
        data.options.customBackend = serverList;
      }
      return data;
    },
    created ()
    {
      document.title = "Firefly-SubConverter";
      this.isPC = this.$getOS().isPc;
      // 获取 url cache
      if ( process.env.VUE_APP_USE_STORAGE === "true" )
      {
        this.form.sourceSubUrl = this.getLocalStorageItem( "sourceSubUrl" );
      }
    },
    mounted ()
    {
      this.form.clientType = "clash";
      this.form.customBackend = defaultBackend;
      this.form.remoteConfig = "";
      this.form.clashdns = "";
      this.notify();
      this.getBackendVersion();
    },

    watch: {
      'form.classic': function ( newVal )
      {
        if ( newVal )
        {
          this.form.expand = false;
        }
      },
      'form.nodeList': function ( newVal )
      {
        if ( newVal )
        {
          this.form.expand = false;
        }
      }
    },
    methods: {
      onCopy ()
      {
        this.$message.success( "Copied!" );
      },
      goToProject ()
      {
        window.open( project );
      },
      gotoTgChannel ()
      {
        window.open( tgBotLink );
      },
      gotoGayhub ()
      {
        window.open( gayhubSource );
      },
      gotoGayhubRuleset ()
      {
        window.open( gayhubRuleset );
      },
      gotoRemoteConfig ()
      {
        window.open( remoteConfigSample );
      },
      clashInstall ()
      {
        if ( !this.validateFormFields( [ 'customSubUrl' ], "请先填写必填项，生成订阅链接" ) )
        {
          return false;
        }
        const url = "clash://install-config?url=";
        window.open(
          url +
          encodeURIComponent(
            this.curtomShortSubUrl !== "" ? this.curtomShortSubUrl
              : this.customSubUrl
          )
        );
      },
      surgeInstall ()
      {
        if ( !this.validateFormFields( [ 'customSubUrl' ], "请先填写必填项，生成订阅链接" ) )
        {
          return false;
        }
        const url = "surge://install-config?url=";
        window.open( url + this.customSubUrl );
      },
      addCustomParam ()
      {
        this.customParams.push( {
          name: "",
          value: "",
        } );
      },
      /**
       * 构建URL查询参数
       * @returns {Object} 包含backend和queryParams的对象
       */
      buildUrlParams ()
      {
        const backend = this.form.customBackend || defaultBackend;
        const sourceSub = this.form.sourceSubUrl.replace( /(\n|\r|\n\r)/g, "|" );

        // 定义参数映射表
        const paramMappings = [
          { key: 'target', value: this.form.clientType },
          { key: 'url', value: encodeURIComponent( sourceSub ) },
          { key: 'config', value: this.form.remoteConfig ? this.form.remoteConfig : undefined, encode: true },
          { key: 'insert', value: this.advanced === '2' && this.form.insert ? 'true' : undefined },
          { key: 'expand', value: this.advanced === '2' && !this.form.nodeList ? ( this.form.expand ? 'true' : 'false' ) : undefined },
          { key: 'classic', value: this.advanced === '2' && this.form.classic && !this.form.nodeList && !this.form.expand ? 'true' : undefined },
          { key: 'exclude', value: this.advanced === '2' && this.form.excludeRemarks ? this.form.excludeRemarks : undefined, encode: true },
          { key: 'include', value: this.advanced === '2' && this.form.includeRemarks ? this.form.includeRemarks : undefined, encode: true },
          { key: 'filename', value: this.advanced === '2' && this.form.filename ? this.form.filename : undefined, encode: true },
          { key: 'dev_id', value: this.advanced === '2' && this.form.devid ? this.form.devid : undefined, encode: true },
          { key: 'append_type', value: this.advanced === '2' && this.form.appendType ? 'true' : undefined },
          { key: 'tfo', value: this.advanced === '2' && this.form.tfo ? 'true' : undefined },
          { key: 'tls13', value: this.advanced === '2' && this.form.tls13 ? 'true' : undefined },
          { key: 'scv', value: this.advanced === '2' && this.form.scv ? 'true' : undefined },
          { key: 'udp', value: this.advanced === '2' && this.form.udp ? 'true' : undefined },
          { key: 'xudp', value: this.advanced === '2' && this.form.xudp ? 'true' : undefined },
          { key: 'sort', value: this.advanced === '2' && this.form.sort ? 'true' : undefined },
          { key: 'emoji', value: this.advanced === '2' && this.form.emoji ? 'true' : undefined },
          { key: 'list', value: this.advanced === '2' && this.form.nodeList ? 'true' : undefined },
          { key: 'fdn', value: this.advanced === '2' && this.form.fdn ? 'true' : undefined },
          { key: 'new_name', value: this.advanced === '2' && this.form.clientType === 'clash' && this.form.new_name ? 'true' : undefined },
          { key: 'clash.dns', value: this.advanced === '2' && this.form.clientType === 'clash' && this.form.clashdns ? this.form.clashdns : undefined, encode: true, skipEmpty: true }
        ];

        // 处理自定义参数
        const customParams = this.advanced === '2'
          ? this.customParams
            .filter( param => param.name && param.value )
            .map( param => ( {
              key: encodeURIComponent( param.name ),
              value: encodeURIComponent( param.value )
            } ) )
          : [];

        // 构建查询参数
        const queryParams = [
          ...paramMappings
            .filter( ( { key, value, skipEmpty } ) =>
            {
              if ( key === 'expand' && this.form.nodeList ) return false;
              return value !== undefined && value !== null && !( skipEmpty && value === "" );
            } )
            .map( ( { key, value, encode } ) =>
              `${ key }=${ encode ? encodeURIComponent( value ) : value }` ),
          ...customParams.map( ( { key, value } ) => `${ key }=${ value }` )
        ];

        return {
          backend,
          queryParams
        };
      },

      /**
       * 验证必填表单字段
       * @returns {boolean} 验证是否通过
       */
      validateRequiredFields ()
      {
        if ( !this.form.sourceSubUrl || !this.form.clientType )
        {
          this.$message.error( "订阅链接与客户端为必填项" );
          return false;
        }
        return true;
      },

      makeUrl ()
      {
        if ( !this.validateRequiredFields() )
        {
          return false;
        }

        const { backend, queryParams } = this.buildUrlParams();
        this.customSubUrl = `${ backend }${ queryParams.join( '&' ) }`;
        this.$copyText( this.customSubUrl );
        this.$message.success( "定制订阅已复制到剪贴板" );
      },
      notify ()
      {
        this.$notify( {
          title: "隐私提示",
          type: "warning",
          message: "各种订阅链接生成纯前端实现，无隐私问题。默认提供后端转换服务，隐私担忧者请自行搭建后端服务。",
          customClass: 'custom-notify'
        } );
      },

      handleError ( error, defaultMessage = '操作失败' )
      {
        console.error( error );
        const message = error.response?.data?.message ||
          error.message ||
          defaultMessage;
        this.$message.error( message );
        return false;
      },
      /**
       * Asynchronously analyzes the URL.
       *
       * @return {Promise<string>} The result of the analysis.
       */
      async analyzeUrl ()
      {
        if ( this.loadConfig.includes( "target" ) )
        {
          return this.loadConfig;
        }

        this.loading = true;
        try
        {
          const response = await fetch( this.loadConfig, {
            method: "GET",
            redirect: "follow",
          } );
          return response.url;
        } catch ( error )
        {
          this.handleError( error, "解析短链接失败，请检查短链接服务端是否配置跨域" );
          throw error; // 重新抛出错误以便上层捕获
        } finally
        {
          this.loading = false;
        }
      },
      /**
       * Confirm and load the configuration.
       *
       * @return {boolean} Returns false if the 'loadConfig' is empty, otherwise returns true.
       */
      /**
       * 处理布尔类型表单字段
       * @param {string} value - 字段值
       * @returns {boolean} 转换后的布尔值
       */
      processBooleanField ( value )
      {
        return value === "true";
      },

      confirmLoadConfig ()
      {
        if ( this.loadConfig.trim() === "" )
        {
          this.$message.error( "订阅链接不能为空" );
          return false;
        }

        ( async () =>
        {
          try
          {
            const url = new URL( await this.analyzeUrl() );
            this.form.customBackend = url.origin + url.pathname + "?";
            const params = new URLSearchParams( url.search );

            // 记录已处理的参数
            const excludeParams = new Set();
            const getParam = ( key ) =>
            {
              excludeParams.add( key );
              return params.get( key );
            };

            // 处理基础参数
            const target = getParam( "target" );
            this.form.clientType = target === "surge"
              ? target + "&ver=" + ( getParam( "ver" ) || "4" )
              : target;

            // 处理表单参数
            const formParams = {
              url: ( v ) => v.replace( /\|/g, "\n" ),
              insert: this.processBooleanField,
              config: ( v ) => v,
              exclude: ( v ) => v,
              include: ( v ) => v,
              filename: ( v ) => v,
              dev_id: ( v ) => v,
              append_type: this.processBooleanField,
              tfo: this.processBooleanField,
              tls13: this.processBooleanField,
              scv: this.processBooleanField,
              udp: this.processBooleanField,
              xudp: this.processBooleanField,
              sort: this.processBooleanField,
              emoji: this.processBooleanField,
              list: this.processBooleanField,
              "clash.dns": ( v ) => v,
              new_name: this.processBooleanField,
              fdn: this.processBooleanField,
              expand: this.processBooleanField,
              classic: this.processBooleanField
            };

            Object.entries( formParams ).forEach( ( [ key, processor ] ) =>
            {
              const value = getParam( key );
              if ( value !== null )
              {
                // 特殊处理append_type和list到对应的表单字段
                if ( key === 'append_type' )
                {
                  this.form.appendType = processor( value );
                } else if ( key === 'list' )
                {
                  this.form.nodeList = processor( value );
                } else
                {
                  this.form[ key.replace( '.', '_' ) ] = processor( value );
                }
              }
            } );

            // 处理 sourceSubUrl 参数
            const sourceSubUrl = getParam( "url" );
            if ( sourceSubUrl )
            {
              this.form.sourceSubUrl = decodeURIComponent( sourceSubUrl ).replace( /\|/g, "\n" );
            }

            // 统一处理参数赋值
            const paramMappings = [
              { param: 'remoteConfig', key: 'config' },
              { param: 'includeRemarks', key: 'include' },
              { param: 'excludeRemarks', key: 'exclude' },
              { param: 'clashdns', key: 'clash.dns' },
              { param: 'devid', key: 'dev_id' }
            ];
            paramMappings.forEach( mapping =>
            {
              this.form[ mapping.param ] = getParam( mapping.key ) || "";
            } );

            // 处理自定义参数，排除append_type和list
            this.customParams = Array.from( params.entries() )
              .filter( ( [ key ] ) => !excludeParams.has( key ) &&
                key !== 'append_type' && key !== 'list' )
              .map( ( [ name, value ] ) => ( { name, value } ) );

            console.log( 'Form after parsing:', JSON.stringify( this.form, null, 2 ) );
            this.dialogLoadConfigVisible = false;
            this.$message.success( "长/短链接已成功解析为订阅信息" );
          } catch ( error )
          {
            console.error( 'Error parsing URL:', error );
            this.$message.error( "请输入正确的订阅地址!" );
          }
        } )();
      },
      renderPost ()
      {
        let data = new FormData();
        data.append( "target", encodeURIComponent( this.form.clientType ) );
        data.append( "url", encodeURIComponent( this.form.sourceSubUrl ) );
        data.append( "insert", encodeURIComponent( this.form.insert ) );
        data.append( "config", encodeURIComponent( this.form.remoteConfig ) );
        data.append( "exclude", encodeURIComponent( this.form.excludeRemarks ) );
        data.append( "include", encodeURIComponent( this.form.includeRemarks ) );
        data.append( "filename", encodeURIComponent( this.form.filename.toString() ) );
        data.append( "dev_id", encodeURIComponent( this.form.devid.toString() ) );
        data.append( "append_type", encodeURIComponent( this.form.appendType.toString() ) );
        data.append( "tfo", encodeURIComponent( this.form.tfo.toString() ) );
        data.append( "tls13", encodeURIComponent( this.form.tls13.toString() ) );
        data.append( "scv", encodeURIComponent( this.form.scv.toString() ) );
        data.append( "udp", encodeURIComponent( this.form.udp.toString() ) );
        data.append( "xudp", encodeURIComponent( this.form.xudp.toString() ) );
        data.append( "sort", encodeURIComponent( this.form.sort.toString() ) );
        data.append( "emoji", encodeURIComponent( this.form.emoji.toString() ) );
        data.append( "list", encodeURIComponent( this.form.nodeList.toString() ) );
        data.append( "clash.dns", encodeURIComponent( this.form.clashdns.toString() ) );
        data.append( "newname", encodeURIComponent( this.form.new_name.toString() ) );
        data.append( "fdn", encodeURIComponent( this.form.fdn.toString() ) );
        data.append( "expand", encodeURIComponent( this.form.expand.toString() ) );
        data.append( "classic", encodeURIComponent( this.form.classic.toString() ) );
        return data;
      },
      backendSearch ( queryString, cb )
      {
        let backends = this.options.customBackend;
        let results = queryString
          ? backends.filter( this.createFilter( queryString ) )
          : backends;
        // 调用 callback 返回建议列表的数据
        cb( results );
      },
      createFilter ( queryString )
      {
        return ( candidate ) =>
        {
          return (
            candidate.value.toLowerCase().indexOf( queryString.toLowerCase() ) === 0
          );
        };
      },
      async getBackendVersion ()
      {
        try
        {
          const response = await this.$axios.get(
            `${ defaultBackend.substring( 0, defaultBackend.length - 5 ) }/version`
          );
          this.backendVersion = response.data
            .replace( /backend\n$/gm, "" )
            .replace( "subconverter", "" );
        } catch ( error )
        {
          this.handleError( error, "获取后端版本信息失败" );
        }
      },
      saveSubUrl ()
      {
        if ( this.form.sourceSubUrl !== "" )
        {
          this.setLocalStorageItem( "sourceSubUrl", this.form.sourceSubUrl );
        }
      },
      getLocalStorageItem ( itemKey )
      {
        const now = +new Date();
        let ls = localStorage.getItem( itemKey );
        let itemValue = "";
        if ( ls !== null )
        {
          let data = JSON.parse( ls );
          if ( data.expire > now )
          {
            itemValue = data.value;
          } else
          {
            localStorage.removeItem( itemKey );
          }
        }
        return itemValue;
      },
      setLocalStorageItem ( itemKey, itemValue )
      {
        const ttl = process.env.VUE_APP_CACHE_TTL;
        const now = +new Date();
        let data = {
          setTime: now,
          ttl: parseInt( ttl ),
          expire: now + ttl * 1000,
          value: itemValue,
        };
        localStorage.setItem( itemKey, JSON.stringify( data ) );
      },

      filterRemoteConfig ( query )
      {
        // 确保搜索功能不影响默认显示
        if ( !query ) return this.options.remoteConfig;
        return this.options.remoteConfig.map( group => ( {
          ...group,
          options: group.options.filter( item =>
            item.label.toLowerCase().includes( query.toLowerCase() )
          )
        } ) );
      },
      openLoadConfigDialog ()
      {
        this.dialogLoadConfigVisible = true;
      },
    },
  };
</script>
