<script setup lang="ts">

import {useRoute} from "vue-router";
import PublicHeader from "../components/layout/PublicHeader.vue";
import PublicFooter from "../components/layout/PublicFooter.vue";

const route = useRoute();
</script>

<template>
  <main class="public-layout">
    <header>
      <PublicHeader />
    </header>

    <div>
      <!-- Sem se vykreslí konkrétní stránka (Home, Login atd.) -->
      <RouterView />
    </div>

    <footer v-if="!route.meta.hideFooter">
      <PublicFooter />
    </footer>
  </main>
</template>

<style scoped>

</style>