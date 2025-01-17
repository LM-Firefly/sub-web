<template>
    <svg :class=" svgClass " aria-hidden="true">
        <use :xlink:href=" iconName " />
    </svg>
</template>

<script lang="ts">
    export default {
        name: "SvgIcon",
        props: {
            iconClass: {
                type: String,
                required: true,
            },
            className: {
                type: String,
                default: "",
            },
        },
        computed: {
            iconName ()
            {
                // 根据vite配置中的symbolId: 'icon-[dir]-[name]'格式进行适配
                // 所有图标都在src/icons/svg目录下，所以目录名是固定的
                return `#icon-${this.iconClass}`;
            },
            svgClass ()
            {
                if ( this.className )
                {
                    return "svg-icon " + this.className;
                } else
                {
                    return "svg-icon";
                }
            },
        },
    };
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
