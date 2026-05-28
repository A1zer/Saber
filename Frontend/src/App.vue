<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PublicLayout from "./layouts/PublicLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";

const route = useRoute();

// Mapování názvů layoutů na komponenty
const layouts = {
  PublicLayout,
  AuthLayout,
};

// Dynamicky určíme layout, výchozí je PublicLayout
const currentLayout = computed(() => {
  const layoutName = (route.meta.layout as keyof typeof layouts) || "PublicLayout";
  return layouts[layoutName];
});
</script>

<template>
<!--  <component :is="currentLayout">-->
    <router-view />
<!--  </component>-->
</template>
