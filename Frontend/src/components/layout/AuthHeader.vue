<script setup lang="ts">
import {useRouter} from "vue-router";
import { ref, onMounted } from 'vue';

const router = useRouter();

// BEST PRACTICE: Výchozí prázdná hodnota nebo rozumný placeholder, dokud data nedorazí
const username = ref('Loading...');

const fetchCurrentUser = async () => {
  const token = localStorage.getItem("auth_token");

  // Pokud uživatel nemá token, rovnou ho odhlásíme nebo nastavíme anonymní stav
  if (!token) {
    username.value = 'Guest';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // BEST PRACTICE: Vždy explicitně kontrolovat úspěšnost HTTP odpovědi
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Pokud je token neplatný/expirovaný, vyčistíme úložiště
        logout();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Dosadíme uživatelské jméno z čistého objektu, který nám backend poslal
    username.value = data.username;

  } catch (err) {
    console.error("Chyba při načítání uživatele v headeru:", err);
    username.value = 'User'; // Fallback při chybě sítě
  }
};

// Spustí se okamžitě při montování komponenty do DOMu
onMounted(() => {
  fetchCurrentUser();
});

const logout = () => {
  localStorage.removeItem("auth_token");
  console.log("Uživatel byl úspěšně odhlášen.");
  router.push("/login");
};

const handleFilterClick = () => {
  console.log("Kliknuto na filtr – vyhledávací pole zůstává netknuté!");
  // Zde se otevře vaše menu nebo filtrace
};

</script>

<template>
  <div class="content-wrapper header">
    <div class="logo-wrapper">
      <img src="../../assets/header_logo.svg" alt="logo" />
    </div>
    <div>
      <router-link :to="{ name: 'find-courses' }">Find Courses</router-link>
    </div>
    <div>
      <router-link :to="{ name: 'subscribe' }">Subscribe</router-link>
    </div>
    <label for="searchInput" class="search-wrapper">

      <div class="icon-container-clickable">
        <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
          <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
              stroke-width="1"
          />
        </svg>
      </div>

      <div class="search-container">
        <input
            type="text"
            id="searchInput"
            placeholder="Search Course or Instructor"
            class="search-input"
        />
      </div>

      <!-- @click.stop zabrání tomu, aby kliknutí propadlo do labelu a aktivovalo input -->
      <button type="button" class="filter-button" @click.stop="handleFilterClick">
        <span> Filter </span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
        >
          <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.5"
              d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"
          />
        </svg>
      </button>
    </label>
    <div>
      <router-link :to=" { name: 'teach' }">Teach on Saber</router-link>
    </div>
    <div>
      <router-link :to=" { name: 'my-courses' }">Dashboard</router-link>
    </div>
    <div class="account-wrapper" id="account-toggle">
      <img src="../../assets/dum.jpg" alt="Profile picture" />

      <!-- OPRAVENO: Statický text "user" nahrazen dynamickým provázáním z databáze -->
      <span id="username-display">{{ username }}</span>

      <div class="dropdown-wrapper">
        <nav class="account-dropdown" id="account-menu">
          <ul>
            <li>
              <a href="profile.html" class="dropdown-button">Profile</a>
            </li>
            <li>
              <button id="logout-button" class="dropdown-button" @click="logout">
                Log out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>

<!--  <div>-->
<!--    <div class="nav-title">-->
<!--      <h1>Dashboard</h1>-->
<!--    </div>-->

<!--    <div>-->
<!--      <nav class="nav-content">-->
<!--        <router-link :to="{ name: 'my-courses' }">My Courses</router-link>-->
<!--        <router-link :to="{ name: 'favorites' }">Favorites</router-link>-->
<!--        <router-link :to="{ name: 'wishlist' }">Wishlist</router-link>-->
<!--        <router-link :to="{ name: 'certifications' }">Certifications</router-link>-->
<!--        <router-link :to="{ name: 'achievements' }">Achievements</router-link>-->
<!--      </nav>-->
<!--    </div>-->
<!--  </div>-->
</template>

<style scoped>
a {
  white-space: nowrap;
}

header {
  display: flex;
  position: relative;
  flex-shrink: 0;
  background-color: var(--background);
}

.content-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;

  &.header {
    /* max-width: 2000px; */
    //padding: 2rem 4rem;
  }

  &.section {
    padding: 0 2rem;
    margin: 0;
    flex-direction: column;
    row-gap: 1rem;
  }
}

.logo-wrapper {
  flex: 0 0 auto;
}

.logo-wrapper img {
  display: block;
  filter: invert(100%);
  width: 180px;
  height: auto;
}

.search-wrapper {
  flex: 1;
  display: flex;
  min-width: 400px;
  align-items: center;
  background-color: var(--background);
  box-shadow: inset 0 0 0 1px var(--border-white);
  border-radius: 180px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: text;
  overflow: hidden;
}

.search-wrapper:focus-within {
  box-shadow: inset 0 0 0 2px var(--border-white);
  background-color: var(--background-white);
}

.icon-container-clickable, .filter-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;

  padding: 14px 14px 14px 18px;
  //border-radius: 180px 0 0 180px;

  transition: color 0.2s ease, transform 0.1s ease, background-color 0.2s ease;
}

.search-container {
  flex: 1;
}

.search-input {
  font-size: 16px;
  width: 100%;
  padding: 0.8rem 0;
  border: none;
  background: transparent;
}

.search-input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px var(--background-white) inset !important;
  box-shadow: 0 0 0 30px var(--background-white) inset !important;
  -webkit-text-fill-color: var(--text-black) !important;
}

.search-wrapper:focus-within .search-input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px var(--background-white) inset !important;
  box-shadow: 0 0 0 100px var(--background-white) inset !important;
}

.search-input:focus {
  outline: none;
  border: none;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  //cursor: pointer;
  //padding: 8px 12px;
  //color: #000000;
  //font-family: inherit;
  //font-size: inherit;
  //user-select: none;
  //border-radius: 20px;
  //transition: background-color 0.2s;
}

.filter-button:hover {
  //background-color: rgba(0, 0, 0, 0.05);
}

.account-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 0;
  font-size: 16px;
  font-weight: 500;
}

.account-wrapper img {
  flex-shrink: 0;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.account-wrapper span {
  font-weight: 600;
}

.dropdown-wrapper {
  position: absolute;
  top: 100%;
  left: 0;
  width: 150px;
  height: 1.4rem;
  display: none;
  pointer-events: auto;
  z-index: 100;
}

.account-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #2d2d2d;
  /* border: 1px solid var(--background-color); */
  border-radius: 6px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.account-wrapper:hover .dropdown-wrapper {
  display: block;
}

.account-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.account-dropdown li {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--background);
}

.dropdown-button {
  font-size: 1rem;
  font-family: "Raleway";
  color: var(--text);
  font-weight: 500;
  border: none;
  background-color: transparent;
  text-decoration: none;
  cursor: pointer;
}

.account-dropdown li:last-child {
  border-bottom: none;
}

.dropdown-button:hover {
  text-decoration: underline;
  text-decoration-color: var(--text);
}

.main-content {
  flex: 1;
  display: flex;
  column-gap: 1rem;
  overflow: hidden;
  height: 100%;
}

.sidebar,
.extra {
  width: 320px; /* Or any fixed width */
  flex-shrink: 0;
  background: var(--background);
}

.sidebar {
  background-color: #2d2d2d;
  margin-top: 5rem;
  border-radius: 0 60px 0 0;
}

.extra {
  margin-top: 3rem;
}

.extra h2 {
  padding-left: 1rem;
}


.nav-button::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background);
  transform: translateX(100%);
  transition: transform 0.2s ease;
  z-index: -1;
}


.nav-button:hover,
.nav-button:focus,
.nav-button:active {
  color: var(--text-black);
  /* background-color: var(--background-color); */
  transition: color 0.2s ease;
  transition-delay: 0.1s;
}

.scroll-section {
  position: relative;
  flex: 1;
  border-radius: 60px 60px 0 0;
  overflow: hidden;
  background: var(--background);
  display: flex;
}

.scroll-section::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 60px 60px 0 0;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.25);
  z-index: 5;
  pointer-events: none;
}

.content-title {
  font-size: 1.2rem;
  text-align: center;
  margin: 2rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  row-gap: 3rem;
  overflow-y: scroll;
  padding: 2.5rem;
  scrollbar-width: none;
}

h1 {
  margin: 0 0 1rem;
}
</style>
