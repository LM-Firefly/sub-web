// src/icons/index.js
import { createApp, h } from 'vue';
const VueShim = { createApp, h };
export default VueShim;

import SvgIcon from "@/components/SvgIcon"; // svg component

// register globally
const app = VueShim.createApp({});
app.component("svg-icon", SvgIcon);

const req = require.context("./svg", false, /\.svg$/);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);
requireAll(req);
