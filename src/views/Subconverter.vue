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
                <el-form-item label="自定义UA:">
                  <el-input v-model="form.ua" placeholder="自定义User-Agent字符串; 如果不指定, 将使用默认的User-Agent" />
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
                      <el-popover placement="bottom" v-model="globalOptionsVisible"
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
                      <el-popover placement="bottom" v-model="nodeOptionsVisible"
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
                      :disabled="!canMakeUrl"><el-icon>
                        <Document />
                      </el-icon>生成订阅链接</el-button>
                    <el-button style="width: 120px; margin-left: 10px" type="danger" @click="clashInstall"
                      :disabled="!canInstall"><el-icon>
                        <DocumentChecked />
                      </el-icon>一键导入Clash</el-button>
                    <!-- <el-button style="width: 144px;" type="primary" @click="surgeInstall" icon="el-icon-connection">一键导入Surge</el-button> -->
                  </el-col>
                  <el-row>
                    <el-button style="width: 250px; margin-top: 10px;" type="primary" @click="dialogLoadConfigVisible = true"><el-icon>
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
    <UrlParseDialog v-model:visible="dialogLoadConfigVisible" @config-loaded="onConfigLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useOptions } from '@/composables/useOptions';
import { useSubconverter } from '@/composables/useSubconverter';
import { useBackend } from '@/composables/useBackend';
import { getLocalStorageItem } from '@/utils/storage';
import { copyToClipboard } from '@/utils/index';
import UrlParseDialog from '@/components/UrlParseDialog.vue';

// Environment variables
const project = import.meta.env.VITE_PROJECT;
const remoteConfigSample = import.meta.env.VITE_SUBCONVERTER_REMOTE_CONFIG;
const gayhubSource = import.meta.env.VITE_BACKEND;
const gayhubRuleset = import.meta.env.VITE_RULESET_LINK;
const defaultBackend = import.meta.env.VITE_SUBCONVERTER_DEFAULT_BACKEND + "/sub?";
const tgBotLink = import.meta.env.VITE_BOT_LINK;
const subDocAdvanced = import.meta.env.VITE_SUBCONVERTER_DOC_ADVANCED;

// Composables
const { options } = useOptions();
const { 
  form, 
  advanced, 
  customParams, 
  customSubUrl, 
  canMakeUrl, 
  canInstall, 
  saveSubUrl, 
  makeUrl, 
  clashInstall, 
  addCustomParam, 
  removeCustomParam, 
  checkRequired, 
  notify 
} = useSubconverter(defaultBackend);
const { backendVersion, fetchBackendVersion } = useBackend();

// UI State
const globalOptionsVisible = ref(false);
const nodeOptionsVisible = ref(false);
const ruleVisible = ref(false);
const dialogLoadConfigVisible = ref(false);

// Methods
const goToProject = () => window.open(project);
const gotoTgChannel = () => window.open(tgBotLink);
const gotoGayhub = () => window.open(gayhubSource);
const gotoGayhubRuleset = () => window.open(gayhubRuleset);
const gotoRemoteConfig = () => window.open(remoteConfigSample);

const onConfigLoaded = ({ formUpdates, customParams: newCustomParams }: any) => {
  Object.assign(form, formUpdates);
  customParams.value = newCustomParams;
};

// Logic
watch(() => form.customBackend, () => {
  fetchBackendVersion(form.customBackend);
});

onMounted(() => {
  document.title = "Firefly-SubConverter";
  if (import.meta.env.VITE_USE_STORAGE === "true") {
    form.sourceSubUrl = getLocalStorageItem("sourceSubUrl");
  }

  // Set defaults
  Object.assign(form, { clientType: "clash", customBackend: defaultBackend, remoteConfig: "", clashdns: "" });

  notify();
  fetchBackendVersion(defaultBackend);
});
</script>
