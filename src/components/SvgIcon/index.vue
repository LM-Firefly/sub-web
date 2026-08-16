<template>
    <span :class="svgClass" aria-hidden="true" v-html="iconContent"></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import githubSvg from '@/icons/svg/github.svg?raw';
import telegramSvg from '@/icons/svg/telegram.svg?raw';
import clashSvg from '@/icons/svg/clash.svg?raw';

interface Props {
    iconClass: string;
    className?: string;
}

const props = withDefaults(defineProps<Props>(), {
    className: ""
});

const svgMap: Record<string, string> = {
    github: githubSvg,
    telegram: telegramSvg,
    clash: clashSvg,
};

const iconContent = computed(() => svgMap[props.iconClass] ?? '');

const svgClass = computed(() => {
    if (props.className) {
        return "svg-icon " + props.className;
    } else {
        return "svg-icon";
    }
});
</script>

<style scoped>
    .svg-icon {
        display: inline-flex;
        width: 18px;
        height: 18px;
        vertical-align: -0.15em;
        overflow: hidden;
    }
    .svg-icon :deep(svg) {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }
</style>
