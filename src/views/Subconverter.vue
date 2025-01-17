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
            <el-form :model=" form " label-width="90px" label-position="left" style="width: 100%" class="sub-form">
              <el-form-item label="模式设置:">
                <el-radio v-model=" advanced " label="1">基础模式</el-radio>
                <el-radio v-model=" advanced " label="2">进阶模式</el-radio>
              </el-form-item>
              <el-form-item label="订阅链接:">
                <el-input v-model=" form.sourceSubUrl " style="width: 100%" type="textarea" rows="4"
                  placeholder="支持各种订阅链接或单节点链接，多个链接每行一个或用 | 分隔" @blur=" saveSubUrl " />
              </el-form-item>
              <el-form-item label="客户端项:">
                <el-select v-model=" form.clientType " style="width: 100%">
                  <el-option v-for=" ( v, k ) in options.clientTypes " :key=" k " :label=" k " :value=" v " />
                </el-select>
              </el-form-item>
              <el-form-item label="远程配置:">
                <el-select v-model=" form.remoteConfig " style="width: 100%" allow-create filterable>
                  <div>
                    <el-link slot="append" @click=" gotoRemoteConfig " icon="el-icon-info">远程配置示例</el-link>
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
                    <el-link slot="append" @click=" gotoGayhub " icon="el-icon-info">Docker快速部署Demo，前往项目仓库</el-link>
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
                  <el-select v-model=" form.clashdns " style="width: 100%" allow-create filterable>
                    <el-option v-for=" ( v, k ) in options.clashdns " :key=" k " :label=" k " :value=" v "></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="远程设备:">
                  <el-input v-model=" form.devid " placeholder="用于设置QuantumultX的远程设备ID" />
                </el-form-item>
                <el-form-item v-for=" ( param, i ) in customParams " :key=" i ">
                  <el-input slot="label" v-model=" param.name " placeholder="自定义参数名">
                    <div slot="suffix" style="width: 10px">:</div>
                  </el-input>
                  <el-input v-model=" param.value " placeholder="自定义参数内容">
                    <el-button slot="suffix" type="text" icon="el-icon-delete" style="margin-right: 5px"
                      @click="customParams.splice( i, 1 )" />
                  </el-input>
                </el-form-item>
                <el-form-item style="width: 100%; text-align: center" label-width="0px">
                  <el-row type="flex">
                    <el-popover placement="bottom" v-model=" form.extraset " style="text-align: center">
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.new_name " label="Clash新字段"></el-checkbox>
                        </el-col>
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.emoji " label="Emoji"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.udp " label="启用 UDP"></el-checkbox>
                        </el-col>
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.appendType " label="节点类型"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.sort " label="排序节点"></el-checkbox>
                        </el-col>
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.fdn " label="过滤非法节点"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.tfo " label="TCP Fast Open"></el-checkbox>
                        </el-col>
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.scv " label="Skip Cert Verify"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.nodeList " label="输出为 Node List"></el-checkbox>
                        </el-col>
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.tls13 " label="开启TLS_1.3"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-col :span=" 12 ">
                          <el-checkbox v-model=" form.xudp " label="启用 XUDP"></el-checkbox>
                        </el-col>
                      </el-row>
                      <el-button slot="reference">节点处理</el-button>
                    </el-popover>
                    <el-popover placement="bottom" v-model=" form.rule " style="text-align: center">
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.expand " label="展开规则"></el-checkbox>
                      </el-row>
                      <el-row :gutter=" 10 ">
                        <el-checkbox v-model=" form.classic " label="Classic Rule Provider"></el-checkbox>
                      </el-row>
                      <el-button slot="reference" style="margin-left: 10px">Rule Provider 选项</el-button>
                    </el-popover>
                    <el-popover placement="top-end" title="添加自定义转换参数" trigger="hover">
                      <el-link type="primary" :href=" subDocAdvanced " target="_blank"
                        icon="el-icon-info">参考文档</el-link>
                      <el-button slot="reference" @click=" addCustomParam " style="margin-left: 10px">
                        <i class="el-icon-plus"></i>
                      </el-button>
                    </el-popover>
                  </el-row>
                </el-form-item>
              </div>
              <div style="margin-top: 50px"></div>
              <el-divider content-position="center">
                <i class="el-icon-magic-stick"></i>
              </el-divider>
              <el-form-item label="定制订阅:" label-width="80px" label-position="left" style="width: 100%">
                <el-input class="copy-content" disabled v-model=" customSubUrl ">
                  <el-button slot="append" v-clipboard:copy=" customSubUrl " v-clipboard:success=" onCopy "
                    ref="copy-btn" icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label-width="0px" style="margin-top: 40px; text-align: center">
                <el-button style="width: 120px" type="danger" @click=" makeUrl " icon="el-icon-document"
                  :disabled=" form.sourceSubUrl.length === 0 ">生成订阅链接</el-button>
                <el-button style="width: 120px" type="danger" @click=" clashInstall " icon="el-icon-document-checked"
                  :disabled=" customSubUrl.length === 0 ">一键导入Clash</el-button>
                <!-- <el-button style="width: 144px" type="primary" @click="surgeInstall" icon="el-icon-connection">一键导入Surge</el-button> -->
              </el-form-item>
              <el-form-item label-width="0px" style="text-align: center">
                <el-button style="width: 250px" type="primary" @click="dialogLoadConfigVisible = true"
                  icon="el-icon-link" :loading=" loading ">从URL解析</el-button>
              </el-form-item>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync=" dialogLoadConfigVisible " :show-close=" false " :close-on-click-modal=" false "
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
        advanced: "1",
        // 是否为 PC 端
        isPC: true,
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
            {
              label: "默认",
              options: [ { label: "不选，由接口提供方提供", value: "" } ],
            },
            {
              label: "LM-Firefly (Online, 与Github 同步)",
              options: [
                {
                  label: "MultiSub-NoReject",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/MultiSub-NoReject.toml",
                },
                {
                  label: "AllSub-NoReject",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AllSub-NoReject.toml",
                },
                {
                  label: "MultiSub-AdBlock",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/MultiSub-AdBlock.toml",
                },
                {
                  label: "AllSub-AdBlock",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AllSub-AdBlock.toml",
                },
                {
                  label: "AIO",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AIO.toml",
                },
                {
                  label: "AIO-NoReject",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/AIO-NoReject.toml",
                },
                {
                  label: "CordCloud",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/CordCloud.toml",
                },
                {
                  label: "CordCloud-NoReject",
                  value:
                    "https://raw.githubusercontent.com/LM-Firefly/Rules/master/Subconverter-base/CordCloud-NoReject.toml",
                },
              ],
            },
            {
              label: "ACL4SSR (Online, 与Github 同步)",
              options: [
                {
                  label: "ACL4SSR 默认版 分组比较全",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online.ini",
                },
                {
                  label: "ACL4SSR 更多去广告",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_AdblockPlus.ini",
                },
                {
                  label: "ACL4SSR 全分组 自动测速、故障转移、负载均衡",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_MultiMode.ini",
                },
                {
                  label: "ACL4SSR 全分组 重度用户使用",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full.ini",
                },
                {
                  label: "ACL4SSR 全分组 重度用户使用 更多去广告",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini",
                },
                {
                  label: "ACL4SSR 全分组 重度用户使用 奈飞全量",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_Netflix.ini",
                },
                {
                  label: "ACL4SSR 全分组 无自动测速 重度用户使用",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini",
                },
                {
                  label: "ACL4SSR 精简版",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini.ini",
                },
                {
                  label: "ACL4SSR 精简版 带港美日国家",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiCountry.ini",
                },
                {
                  label: "ACL4SSR 精简版 更多去广告",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_AdblockPlus.ini",
                },
                {
                  label: "ACL4SSR 精简版 带故障转移",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_Fallback.ini",
                },
                {
                  label: "ACL4SSR 精简版 自动测速、故障转移、负载均衡",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_MultiMode.ini",
                },
                {
                  label: "ACL4SSR 精简版 不带自动测速",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Mini_NoAuto.ini",
                },
                {
                  label: "ACL4SSR 无自动测速",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoAuto.ini",
                },
                {
                  label: "ACL4SSR 无广告拦截规则",
                  value:
                    "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_NoReject.ini",
                },
              ],
            },
            {
              label: "Special",
              options: [
                {
                  label: "NeteaseUnblock(仅规则，No-Urltest)",
                  value:
                    "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/netease.ini",
                },
                {
                  label: "Basic(仅GEOIP CN + Final)",
                  value:
                    "https://raw.githubusercontent.com/SleepyHeeead/subconverter-config/master/remote-config/special/basic.ini",
                },
              ],
            },
          ],
        },
        form: {
          appendType: false,
          clashdns: "", // 选择base.tpl 里面Clash DNS区块
          classic: false, // 是否使用 Clash Classic Rule Provider
          clientType: "",
          customBackend: "",
          emoji: true,
          excludeRemarks: "",
          expand: true, // 是否展开规则
          extraset: false,
          tls13: false,
          fdn: false,
          filename: "",
          devid: "",
          includeRemarks: "",
          insert: false, // 是否插入默认订阅的节点，对应配置项 insert_url
          new_name: true, // 是否使用 Clash 新字段
          nodeList: false,
          remoteConfig: "",
          rule: false,
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
      // window.console.log(data.options.remoteConfig);
      // window.console.log(data.options.customBackend);
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
      // document.title = "Subscription Converter";
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
        if ( this.customSubUrl === "" )
        {
          this.$message.error( "请先填写必填项，生成订阅链接" );
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
        if ( this.customSubUrl === "" )
        {
          this.$message.error( "请先填写必填项，生成订阅链接" );
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
      makeUrl ()
      {
        if ( this.form.sourceSubUrl === "" || this.form.clientType === "" )
        {
          this.$message.error( "订阅链接与客户端为必填项" );
          return false;
        }
        // 远程接口
        let backend =
          this.form.customBackend === "" ? defaultBackend
            : this.form.customBackend;
        // 远程配置
        let config = this.form.remoteConfig === "" ? "" : this.form.remoteConfig;
        let sourceSub = this.form.sourceSubUrl;
        sourceSub = sourceSub.replace( /(\n|\r|\n\r)/g, "|" );
        // 薯条屏蔽
        if (
          sourceSub.indexOf( "losadhwse" ) !== -1 &&
          ( backend.indexOf( "py6.pw" ) !== -1 ||
            backend.indexOf( "subconverter-web.now.sh" ) !== -1 ||
            backend.indexOf( "api.wcc.best" ) !== -1 )
        )
        {
          this.$alert(
            "此机场订阅已将该后端屏蔽，请自建后端转换。",
            "转换错误提示",
            {
              confirmButtonText: "确定",
              callback: ( action ) =>
              {
                this.$message( { type: "error", message: `action: ${ action }` } );
              },
            }
          );
          return false;
        }
        this.customSubUrl =
          backend +
          "target=" +
          this.form.clientType +
          "&url=" +
          encodeURIComponent( sourceSub ) +
          "&insert=" +
          this.form.insert +
          "&expand=" +
          this.form.expand.toString();
        if ( config )
        {
          this.customSubUrl += "&config=" + encodeURIComponent( config );
        }
        if ( this.advanced === "2" )
        {
          if ( this.form.expand === false )
          {
            if ( this.form.classic )
            {
              this.customSubUrl += "&classic=" + this.form.classic.toString();
            }
          }
          if ( this.form.excludeRemarks )
          {
            this.customSubUrl +=
              "&exclude=" + encodeURIComponent( this.form.excludeRemarks );
          }
          if ( this.form.includeRemarks )
          {
            this.customSubUrl +=
              "&include=" + encodeURIComponent( this.form.includeRemarks );
          }
          if ( this.form.filename )
          {
            this.customSubUrl +=
              "&filename=" + encodeURIComponent( this.form.filename );
          }
          if ( this.form.devid )
          {
            this.customSubUrl += "&dev_id=" + encodeURIComponent( this.form.devid );
          }
          if ( this.form.appendType )
          {
            this.customSubUrl +=
              "&append_type=" + this.form.appendType.toString();
          }
          if ( this.form.tfo )
          {
            this.customSubUrl += "&tfo=" + this.form.tfo.toString();
          }
          if ( this.form.tls13 )
          {
            this.customSubUrl += "&tls13=" + this.form.tls13.toString();
          }
          if ( this.form.scv )
          {
            this.customSubUrl += "&scv=" + this.form.scv.toString();
          }
          if ( this.form.udp )
          {
            this.customSubUrl += "&udp=" + this.form.udp.toString();
          }
          if ( this.form.xudp )
          {
            this.customSubUrl += "&xudp=" + this.form.xudp.toString();
          }
          if ( this.form.sort )
          {
            this.customSubUrl += "&sort=" + this.form.sort.toString();
          }
          if ( this.form.emoji )
          {
            this.customSubUrl += "&emoji=" + this.form.emoji.toString();
          }
          if ( this.form.nodeList )
          {
            this.customSubUrl += "&list=" + this.form.nodeList.toString();
          }
          if ( this.form.clientType === "clash" )
          {
            {
              this.customSubUrl += "&new_name=" + this.form.new_name.toString();
            }
            if ( this.form.clashdns )
            {
              this.customSubUrl +=
                "&clash.dns=" + encodeURIComponent( this.form.clashdns );
            }
          }
          if ( this.form.fdn )
          {
            this.customSubUrl += "&fdn=" + this.form.fdn.toString();
          }
          this.customParams
            .filter( ( param ) => param.name && param.value )
            .forEach( ( param ) =>
            {
              this.customSubUrl += `&${ encodeURIComponent(
                param.name
              ) }=${ encodeURIComponent( param.value ) }`;
            } );
        }
        this.$copyText( this.customSubUrl );
        this.$message.success( "定制订阅已复制到剪贴板" );
      },
      notify ()
      {
        const h = this.$createElement;
        this.$notify( {
          title: "隐私提示",
          type: "warning",
          message: h(
            "i",
            { style: "color: teal" },
            "各种订阅链接生成纯前端实现，无隐私问题。默认提供后端转换服务，隐私担忧者请自行搭建后端服务。" ),
        } );
      },
      /**
       * Asynchronously analyzes the URL.
       *
       * @return {Promise<string>} The result of the analysis.
       */
      async analyzeUrl ()
      {
        // Check if `loadConfig` includes "target"
        if ( this.loadConfig.includes( "target" ) )
        {
          // If it does, return `loadConfig`
          return this.loadConfig;
        } else
        {
          // Otherwise, set `loading` to true
          this.loading = true;
          try
          {
            // Fetch the data from `loadConfig` using GET method and follow redirects
            let response = await fetch( this.loadConfig, {
              method: "GET",
              redirect: "follow",
            } );
            // Return the URL from the response
            return response.url;
          } catch ( e )
          {
            // If an error occurs, display an error message with the error details
            this.$message.error(
              "解析短链接失败，请检查短链接服务端是否配置跨域：" + e
            );
          } finally
          {
            // Set `loading` to false
            this.loading = false;
          }
        }
      },
      /**
       * Confirm and load the configuration.
       *
       * @return {boolean} Returns false if the 'loadConfig' is empty, otherwise returns true.
       */
      confirmLoadConfig ()
      {
        // Check if 'loadConfig' is empty
        if ( this.loadConfig.trim() === "" )
        {
          // Display error message if 'loadConfig' is empty
          this.$message.error( "订阅链接不能为空" );
          return false;
        }

        // Async function to handle the configuration loading
        ( async () =>
        {
          try
          {
            // Analyze the URL and extract its components
            const url = new URL( await this.analyzeUrl() );

            // Set the custom backend URL
            this.form.customBackend = url.origin + url.pathname + "?";

            // Parse the URL parameters
            const params = new URLSearchParams( url.search );

            // Record parameters have been read
            const getParam = params.get.bind( params );
            const excludeParams = new Set();
            params.get = ( key ) =>
            {
              excludeParams.add( key );
              return getParam( key );
            };

            // Get the 'target' parameter
            const target = params.get( "target" );

            // Set the client type based on the 'target' parameter
            if ( target === "surge" )
            {
              const ver = params.get( "ver" ) || "4";
              this.form.clientType = target + "&ver=" + ver;
            } else
            {
              this.form.clientType = target;
            }

            // Set other form properties based on the URL parameters
            if ( params.get( "url" ) )
            {
              this.form.sourceSubUrl = params.get( "url" ).replace( /\|/g, "\n" );
            }
            if ( params.get( "insert" ) )
            {
              this.form.insert = params.get( "insert" ) === "true";
            }
            if ( params.get( "config" ) )
            {
              this.form.remoteConfig = params.get( "config" );
            }
            if ( params.get( "exclude" ) )
            {
              this.form.excludeRemarks = params.get( "exclude" );
            }
            if ( params.get( "include" ) )
            {
              this.form.includeRemarks = params.get( "include" );
            }
            if ( params.get( "filename" ) )
            {
              this.form.filename = params.get( "filename" );
            }
            if ( params.get( "dev_id" ) )
            {
              this.form.devid = params.get( "dev_id" );
            }
            if ( params.get( "append_type" ) )
            {
              this.form.appendType = params.get( "append_type" ) === "true";
            }
            if ( params.get( "tfo" ) )
            {
              this.form.tfo = params.get( "tfo" ) === "true";
            }
            if ( params.get( "tls13" ) )
            {
              this.form.tls13 = params.get( "tls13" ) === "true";
            }
            if ( params.get( "scv" ) )
            {
              this.form.scv = params.get( "scv" ) === "true";
            }
            if ( params.get( "udp" ) )
            {
              this.form.udp = params.get( "udp" ) === "true";
            }
            if ( params.get( "xudp" ) )
            {
              this.form.xudp = params.get( "xudp" ) === "true";
            }
            if ( params.get( "sort" ) )
            {
              this.form.sort = params.get( "sort" ) === "true";
            }
            if ( params.get( "emoji" ) )
            {
              this.form.emoji = params.get( "emoji" ) === "true";
            }
            if ( params.get( "list" ) )
            {
              this.form.nodeList = params.get( "list" ) === "true";
            }
            if ( params.get( "clash.dns" ) )
            {
              this.form.clashdns = params.get( "clash.dns" );
            }
            if ( params.get( "new_name" ) )
            {
              this.form.new_name = params.get( "new_name" ) === "true";
            }
            if ( params.get( "fdn" ) )
            {
              this.form.fdn = params.get( "fdn" ) === "true";
            }
            if ( params.get( "expand" ) )
            {
              this.form.expand = params.get( "expand" ) === "true";
            }
            if ( params.get( "classic" ) )
            {
              this.form.classic = params.get( "classic" ) === "false";
            }

            // Filter custom parameters
            this.customParams = Array.from(
              params
                .entries()
                .filter( ( e ) => !excludeParams.has( e[ 0 ] ) )
                .map( ( e ) => ( { name: e[ 0 ], value: e[ 1 ] } ) )
            );

            // Hide the configuration dialog
            this.dialogLoadConfigVisible = false;

            // Display success message
            this.$message.success( "长/短链接已成功解析为订阅信息" );
          } catch ( error )
          {
            // Display error message if URL is not valid
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
        data.append(
          "filename",
          encodeURIComponent( this.form.filename.toString() )
        );
        data.append( "dev_id", encodeURIComponent( this.form.devid.toString() ) );
        data.append(
          "append_type",
          encodeURIComponent( this.form.appendType.toString() )
        );
        data.append( "tfo", encodeURIComponent( this.form.tfo.toString() ) );
        data.append( "tls13", encodeURIComponent( this.form.tls13.toString() ) );
        data.append( "scv", encodeURIComponent( this.form.scv.toString() ) );
        data.append( "udp", encodeURIComponent( this.form.udp.toString() ) );
        data.append( "xudp", encodeURIComponent( this.form.xudp.toString() ) );
        data.append( "sort", encodeURIComponent( this.form.sort.toString() ) );
        data.append( "emoji", encodeURIComponent( this.form.emoji.toString() ) );
        data.append( "list", encodeURIComponent( this.form.nodeList.toString() ) );
        data.append(
          "clash.dns",
          encodeURIComponent( this.form.clashdns.toString() )
        );
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
      getBackendVersion ()
      {
        this.$axios
          .get(
            defaultBackend.substring( 0, defaultBackend.length - 5 ) + "/version" )
          .then( ( res ) =>
          {
            this.backendVersion = res.data.replace( /backend\n$/gm, "" );
            this.backendVersion = this.backendVersion.replace( "subconverter", "" );
          } );
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
    },
  };
</script>
