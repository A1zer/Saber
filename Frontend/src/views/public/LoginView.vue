<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async (e: Event) => {
  e.preventDefault();
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Please enter both email and password";
    return;
  }

  loading.value = true;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await res.json();

    if (res.status === 200) {
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/dashboard");
    } else {
      error.value = data.message || "Login failed";
    }
  } catch (err) {
    console.error("Login error:", err);
    error.value = "Network error. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="bgContainer">
        <div class="form-container">
          <div class="content">
            <div class="form -signin">
              <h1 class="title">Welcome back!</h1>
              <form id="login-form" @submit.prevent="handleLogin">
                <div class="form-fields">
                  <div class="input-wrapper">
                    <label for="email">e-mail</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      v-model="email"
                      class="input"
                      required
                    />
                  </div>
                  <div class="input-wrapper">
                    <label for="password">password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      v-model="password"
                      class="input"
                      required
                    />
                  </div>
                  <div class="container">
                    <div class="checkbox-wrapper">
                      <input id="checkbox" type="checkbox" />
                      <label for="checkbox" class="checkmark"
                        >remember me</label
                      >
                    </div>
                    <div>
                      <span><a href="">Forgot password? </a></span>
                    </div>
                  </div>
                </div>
                <div v-if="error" class="error-message">{{ error }}</div>
                <input
                  class="button -auth"
                  type="submit"
                  :value="loading ? 'Logging in...' : 'Log in'"
                  :disabled="loading"
                />
              </form>
              <div class="switch-form">
                <span
                  >Don't have an account?
                  <router-link to="/signup">Sign up</router-link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  flex-grow: 1;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  letter-spacing: 0.05em;
  background-image: url('../../assets/background_logo_light.svg');
  background-repeat: no-repeat;
  background-position: center;
}

h2 {
  font-size: 1rem;
  padding: 4px 1.8rem;
}

h1 {
  color: var(--text-black);
  font-size: 1.5rem;
  margin: 0;
}

.login-wrapper {
  position: relative;
  width: 500px;
  margin: 0 auto;
}

.bgContainer {
}

@keyframes rise-up {
  0% {
    opacity: 1;
    transform: translateY(120%);
  }

  100% {
    opacity: 1;
    transform: translateY(0%);
  }
}

.form {
  color: var(--text-black);
  font-weight: var(--font-weight);
  display: flex;
  flex-direction: column;
  row-gap: 50px;
  width: 80%;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 400;
  gap: 1rem;
}

.container {
  font-size: 12px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-container {
  padding: 4rem 0rem;
  margin: 0 auto;
}

.content-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0px auto;
  &.header {
    max-width: 1400px;
    padding: 1rem 2rem;
  }

  &.footer {
    flex-direction: column;

    row-gap: 1.5rem;
    padding: 3rem 1.5rem;
  }
}

.logo-wrapper {
  flex: 1 1 auto;

  & img {
    height: 2rem;
    display: flex;
    align-items: center;
  }
}

.nav-items {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: var(--text);
  list-style-type: none;
  &.-header {
    column-gap: 30px;
  }
  &.-footer {
    max-width: 700px;
    margin: 0 auto;

    & li {
      padding: 0 1rem;
      border-left: 1px solid var(--text);
      border-right: 1px solid var(--text);
    }
  }

  & a {
    text-decoration: none;
    color: var(--text);
  }

  & a:hover {
    color: var(--accent-secondary);
  }
}

.button {
  font-size: 1rem;
  font-family: "Raleway";
  font-weight: bold;
  border: none;
  border-radius: 0.4em;
  padding: 0.75em 1em;
  text-decoration: none;
  text-wrap: nowrap;
  cursor: pointer;
  &.-primary {
    background-color: var(--accent);
    color: var(--text);
  }
  &.-secondary {
    background-color: var(--background);
    color: var(--background-black);
  }
  &.transparent {
    background-color: transparent;
  }
  &.-auth {
    padding: 6px 0.7em;
    font-size: 1.1em;
    background-color: var(--accent);
    color: var(--text);
  }
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.container:nth-last-of-type(1) a {
  color: var(--text-black);
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 1rem;
}

.input {
  border: 2px solid var(--background-dark);
  border-radius: 0.4em;
  height: 2rem;
  background-color: var(--background);
  text-decoration: none;
  font-size: 1.2em;
  font-weight: 400;
  padding: 0 5px;
}


input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-radius: 5px;
  filter: drop-shadow(0 4px 1px #ffffff35);
  transition: 0.25s;
}

input {
  font-family: inherit;
}

.input {
  //background-clip: text !important;
  //-webkit-text-fill-color: #d9d9d9;
  //caret-color: #d9d9d9;
}

form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 1.5rem;
}

.switch-form {
  font-weight: 400;
  margin: 0 auto;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.switch-form a {
  color: #3b8851;
  font-weight: bold;
  text-decoration: underline;
}

.authentication-button {
  background-color: #3c8b51;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  color: var(--text);
  padding: 6px 0.7em;
  text-decoration: none;
  font-size: 1.1em;
  align-self: flex-start;
  width: 100%;
}

.form-background {
  height: 100%;
  width: 100%;
  object-fit: cover;
  max-width: 300px;
  border-radius: 50px;
  backdrop-filter: blur(8px);

  box-shadow: inset 0 0 0 200px rgba(250, 197, 255, 0.09);
}

.hero-subtitle {
  margin: 2rem auto;
}

@media only screen and (max-width: 1074px) {
  :root {
    font-size: 12px;
  }

  .title {
    font-size: 1.8rem;
  }
}

@media only screen and (max-width: 820px) {
  .content-wrapper.header nav:first-of-type {
    display: none;
  }

  .burger-menu {
    display: block;
  }

  .form-navigation {
    display: none;
  }

  form {
    width: 100%;
  }

  .mask-container {
    display: none;
  }

  .login-wrapper {
    width: min(380px, 80%);
  }

  .authentication-button {
    width: 100%;
  }

  .content-wrapper {
    padding: 3rem 0;
  }

  .content {
    display: block;
  }

  .form {
    justify-content: center;
  }

  .-signin {
    display: none;
  }
}
</style>
