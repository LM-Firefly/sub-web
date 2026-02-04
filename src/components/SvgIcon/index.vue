<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    iconClass: string;
    className?: string;
}

const props = withDefaults(defineProps<Props>(), {
    className: ""
});

// 根据vite配置中的symbolId: 'icon-[dir]-[name]'格式进行适配
// 所有图标都在src/icons/svg目录下，所以目录名是固定的
const iconName = computed(() => `#icon-${props.iconClass}`);

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
        width: 18px;
        height: 18px;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
