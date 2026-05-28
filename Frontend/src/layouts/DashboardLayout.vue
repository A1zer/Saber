<script setup lang="ts">

</script>

<template>
  <div class="dashboard-layout">
    <div class="nav-header">
      <div class="nav-title">
        <h1>Dashboard</h1>
      </div>

      <div>
        <nav class="nav-content">
          <router-link :to="{ name: 'my-courses' }">My Courses</router-link>
          <router-link :to="{ name: 'favorites' }">Favorites</router-link>
          <router-link :to="{ name: 'wishlist' }">Wishlist</router-link>
          <router-link :to="{ name: 'certifications' }">Certifications</router-link>
          <router-link :to="{ name: 'achievements' }">Achievements</router-link>
        </nav>
      </div>
    </div>
    <div class="inner-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
a {
  white-space: nowrap;
  border-radius: 4px 4px 0 0;
}

.nav-header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--background-black);
  color: var(--text);
  padding-top: 2rem;
  text-align: center;
  align-items: center;
}

.nav-title {
  width: max-content;
  padding: 0 2rem;
  border-bottom: 3px solid var(--accent);
}

.nav-content {
  display: flex;
  justify-content: center;
  //gap: 1rem;

  & > * {
    padding: 1rem;
    font-weight: 500;
  }

  & .router-link-active {
    background-color: var(--background-dark); /* Zvýrazněné pozadí aktivní záložky */
    border-bottom: 2px solid var(--background);
  }
}

.content-wrapper {
  display: block;
}
</style>