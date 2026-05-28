<script setup lang="ts">
import { useRoute } from "vue-router";
import AuthHeader from "../components/layout/AuthHeader.vue";
import AuthFooter from "../components/layout/AuthFooter.vue";


const route = useRoute();


</script>

<template>
  <div class="auth-layout">
    <header>
      <AuthHeader />
    </header>

    <main>
      <div class="content-wrapper">
        <!-- Sem se vykreslí stránky po přihlášení -->
        <RouterView />
      </div>
    </main>

    <footer v-if="!route.meta.hideFooter">
      <AuthFooter />
    </footer>
  </div>
</template>

<style scoped>

header {
  background-color: var(--background);
}

</style>
