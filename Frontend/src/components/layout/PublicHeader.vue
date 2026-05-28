<script setup lang="ts">

</script>

<template>
  <!-- Veřejná navigace (např. Domů, Ceník, Přihlásit se) -->
  <div class="content-wrapper header">
    <div class="logo-wrapper">
      <button class="button transparent">
        <router-link to="/">
          <img src="../../assets/header_logo.svg" alt="logo" />
        </router-link>
      </button>
    </div>
    <nav>
      <ul class="nav-items -header">
        <li><router-link to="/courses">Courses</router-link></li>
        <li><router-link to="/communities">Communities</router-link></li>

        <li>
          <button class="button primary">
            <router-link to="/signup">Learn Free Now</router-link>
          </button>
        </li>

        <li>
          <button class="button secondary">
            <router-link to="/login">Log In</router-link>
          </button>
        </li>
      </ul>
    </nav>
    <nav class="burger-menu">
      <img
          class="icon-burger"
          src="../../assets/burger-menu.svg"
          alt="burger-menu"
      />
    </nav>
  </div>
</template>

<style scoped>
.content-wrapper.header {
  max-width: 1400px;
  padding: 1rem 2rem;
}
</style>