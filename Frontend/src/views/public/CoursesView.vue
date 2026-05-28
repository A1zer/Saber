<script setup lang="ts">

</script>

<template>
  <div class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="title -hero">Courses</h1>
        <div class="hero-subtitle">
          <p>
            Delve into our library of thoroughly created tutorials tailored
            to all your needs.
          </p>
        </div>
      </div>
    </div>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        class="wave"
    >
      <path
          fill="#0099ff"
          fill-opacity="1"
          d="M0,160L24,144C48,128,96,96,144,122.7C192,149,240,235,288,224C336,213,384,107,432,80C480,53,528,107,576,149.3C624,192,672,224,720,208C768,192,816,128,864,128C912,128,960,192,1008,234.7C1056,277,1104,299,1152,277.3C1200,256,1248,192,1296,186.7C1344,181,1392,235,1416,261.3L1440,288L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
      ></path>
    </svg>
    <!-- <div class="page-extender"></div> -->
  </div>
  <div class="page-container">
    <section class="section-light">
      <div class="content-wrapper section">
        <h2 class="title center">What do we have to offer?</h2>

        <article class="article -dark -decorated">
          <p>
            Our courses are designed to empower you with knowledge, skills,
            and confidence. We offer expert-led lessons that bring
            real-world experience right to your screen. Whether you’re
            exploring a new hobby, upskilling for your career, or diving
            deep into a passion, we’ve got something for everyone.
          </p>
          <br />
          <p>
            You’ll find a variety of topics ranging from coding and design
            to photography and personal development. But it’s not just about
            watching videos—we believe in learning by doing. That’s why
            every course includes hands-on projects, so you can put your
            skills to the test and see your progress.
          </p>
        </article>
      </div>
    </section>
    <section class="section-courses">
      <div class="page-cutout-wrapper">
        <div class="page-line"></div>
        <div class="page-cutout"></div>
        <div class="page-line"></div>
      </div>
      <div class="course-showcase-wrapper">
        <h2 class="title center alt" style="font-weight: bold">
          Choose the course you like
        </h2>

        <div class="course-showcase">
          <div class="showcase-item">
            <div class="item-cover"></div>
            <div class="item-content">
              <h1>Video editing mastery</h1>
              <p>lorem ipsum lorem impsum pobil jsem prdel mym psum</p>
              <div class="item-footer">
                <h2>Created by: Saber</h2>
                <span>Completed</span>
              </div>
            </div>
          </div>
          <div class="showcase-item">
            <div class="item-cover"></div>
            <div class="item-content">
              <h1>Music production basics</h1>
              <p>lorem ipsum lorem impsum pobil jsem prdel mym psum</p>
              <div class="item-footer">
                <h2>Created by: Saber</h2>
                <span>Completed</span>
              </div>
            </div>
          </div>
          <div class="showcase-item">
            <div class="item-cover"></div>
            <div class="item-content">
              <h1>Web development for beginners</h1>
              <p>lorem ipsum lorem impsum polibil jsem prdel mym psum</p>
              <div class="item-footer">
                <h2>Created by: Saber</h2>
                <span>Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section-light">
      <div class="content-wrapper section">
        <h2 class="title center">Why our courses?</h2>

        <article class="article -dark -decorated">
          <p>
            Choosing the right course can be overwhelming, but here’s why
            learners love us. First, our courses are results-driven.
            Thousands of learners have achieved their goals faster, thanks
            to our structured approach and practical lessons.
          </p>
          <br />
          <p>
            You won’t be alone on your journey either. Our community of
            learners and mentors is here to support and inspire you along
            the way. Share your progress, ask questions, and connect with
            others who share your goals.
          </p>
          <br />
          <p>
            Plus, we make learning enjoyable! With beautifully designed
            courses, interactive lessons, and a user-friendly experience,
            you’ll stay motivated from start to finish. And because we
            believe high-quality education should be accessible to everyone,
            our courses deliver incredible value at an affordable price.
          </p>
        </article>
      </div>
    </section>
    <section class="section-light">
      <div
          class="content-wrapper section"
          style="border: none; row-gap: 2rem"

      >
        <div class="section-title-wrapper">
          <h2 class="title center">
            Ready to take the first step?
          </h2>
          <h3 class="center h3">
            Dive in and see why our learners keep coming back for more!
          </h3>
        </div>
        <div class="showcase-button">
          <button class="button primary details">
            <router-link to="/signup">I'm Ready!</router-link>
          </button>
        </div>
      </div>
    </section>
    <!-- <section class="light-section">
      <div class="section-content-wrapper">
        <div class="section-title-wrapper">
          <h2 class="section-title">Want to know more?</h2>
          <h3>Check out a detailed description of all the courses here</h3>
          <div class="hero-buttons">
            <a href=""
              ><button>
                <span>Course overview</span>
              </button></a
            >
          </div>
        </div>
      </div>
    </section> -->
  </div>
</template>

<style scoped>
.h3 {
  font-size: 1.5rem;
  font-weight: 500;
}

.hero-container {
  height: 100%;
  max-width: 1700px;
  display: flex;
  justify-content: center;
  align-items: center;
  row-gap: 2rem;
  padding: 0 4rem;
  margin: 0 auto;
}

.hero-container {
  height: 100%;
  max-width: 1700px;
  display: flex;
  justify-content: center;
  align-items: center;
  row-gap: 2rem;
  padding: 0 4rem;
  margin: 0 auto;
}

.content-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  &.section {
    padding: 0 3rem;
    margin: 0 4rem;
    flex-direction: column;
    row-gap: 1rem;
    border-left: 1px solid #111111;
    border-right: 1px solid #111111;
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
  &.primary {
    background-color: var(--accent);
    color: var(--text);
  }

  &.details {
    font-size: 1.1rem;
  }
}

.hero {
  height: 600px;
  position: relative;
  background-image: url("https://images.pexels.com/photos/1452701/pexels-photo-1452701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  box-shadow: inset 0 0 250px rgb(0, 0, 0);
  background-size: cover;
  background-position: top;
  padding-bottom: 5rem;
}

.wave {
  position: absolute;
  bottom: 0;
  height: 300px;
  width: max(100vw, 1900px);
}

.hero-content {
  position: relative;
  color: var(--text);
  grid-area: text;
  font-weight: var(--font-weight);
  text-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  max-width: 800px;
  bottom: 50px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  row-gap: 1rem;
}


.title {
  font-size: 2.2rem;
  font-weight: 500;

  &.alt {
    color: var(--text);
  }

  &.center {
    text-align: center;
  }

  &.-hero {
    font-size: 3rem;
    font-weight: bold;
  }

  &.h3 {
    font-size: 1.5rem;
    font-weight: 500;
  }
}

.article {
  &.center {
    text-align: center;
  }

  &.left {
    text-align: left;
  }
}

.hero-subtitle {
  text-align: center;
  font-weight: 500;
  font-size: 2rem;
}

.hero-subtitle button {
  background-color: #3c8b51;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 18px 18px;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  font-size: 1.25em;
}

.section-title-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.section-title-decoration span {
  content: "";
  width: 100%;
  background-color: green;
}

.article {
  position: relative;
  text-align: center;
  max-width: 900px;
  padding: 0 2rem;

  &.-light {
    font-weight: bold;
    color: var(--text);

    &.-decorated {
      &.article::before,
      &.article::after {
        background-color: var(--text);
      }
    }
  }
  &.-dark {
    color: var(--text-black);

    &.-decorated {
      padding: 2.5em 2rem;

      &.article::before,
      &.article::after {
        background-color: var(--text-black);
      }
    }
  }

  &.-decorated {
    &.article::before,
    &.article::after {
      position: absolute;
      width: 360px;
      height: 1px;
      content: "";
    }

    &.article::before {
      left: 0;
      top: 1px;
      height: 0.5px;
    }

    &.article::after {
      right: 0;
      top: 1px;
      height: 0.5px;
    }
  }
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

.page-cutout-wrapper {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  top: -1.3em;
}

.page-cutout {
  position: relative;
  height: 2.6em;
  width: 31rem;

  background-color: var(--background);
  margin: 0 -1rem;
  border-radius: 90px;
  z-index: 10;
}

.page-line {
  content: "";
  position: relative;
  display: block;
  top: 8px;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: var(--text);
  z-index: 20;
}

.section-courses {
  background-image: url("https://images.unsplash.com/photo-1571033246308-18179ec20ac0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 250px rgb(0, 0, 0);
}

.course-showcase-wrapper {
  padding: 3rem 4rem;
}

.course-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, 330px);
  gap: 3rem;
  justify-content: center;
  margin: 4rem 0;
}

.showcase-title-wrapper h1 {
  color: var(--text);
  text-align: center;
  font-size: 2rem;
  width: 60%;
  margin: 0 auto;
  text-shadow: 0 4px 20px #000000;
}

.course-showcase > :nth-child(n) .item-cover {
  height: 220px;
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 60px 5px #00000080;
}

.course-showcase > :nth-child(1) .item-cover {
  background-image: url("https://images.unsplash.com/photo-1511903979581-3f1d3afb4372?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
}

.course-showcase > :nth-child(2) .item-cover {
  background-image: url("https://images.unsplash.com/photo-1703060802528-2e85ccf57e66?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
}

.course-showcase > :nth-child(3) .item-cover {
  background-image: url("https://images.unsplash.com/photo-1669023414166-a4cc7c0fe1f5?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
}

.showcase-item {
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 20px #ffffff50;
}

.item-content {
  padding: 10px 5%;
  margin: 0 auto;
  background-color: var(--background);
  font-size: 1rem;
}

.item-content h1 {
  font-size: 1em;
}

.item-content p {
  height: 100px;
  width: 80%;
  margin-top: 10px;
  font-size: 0.8em;
}

.showcase-button {
  text-align: center;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-footer h2 {
  font-weight: bold;
  font-size: 0.8em;
}

.item-footer span {
  font-size: 0.8em;
  font-weight: 500;
  padding: 3px 6px;
  color: #747474;
  border: solid 1.4px #747474;
  border-radius: 7px;
}

.page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 5rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
  z-index: 200;
}

.section-light {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-background img {
  display: none;
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 4rem 4rem;
}

.footer-background2 img {
  height: 150px;
}

path {
  fill: var(--background);
}

svg {
  cursor: pointer;
  height: 2rem;
  width: 2rem;
}

.social-media-content img {
  color: white;
}
@media screen and (max-width: 1234px) {
  .course-showcase {
    grid-template-columns: 330px;
  }
}

@media screen and (max-width: 981px) {
  :root {
    font-size: 12px;
  }

  .page-container {
    padding-top: 0;
  }

  .content-wrapper.section {
    padding: 0 2rem;
    margin: 0;
    border: none;
  }

  .-decorated::before {
    display: none;
  }
  .-decorated::after {
    display: none;
  }
}

@media screen and (max-width: 820px) {
  .-decorated {
    padding: 2.5rem 0 !important;
  }

  .content-wrapper.header nav:first-of-type {
    display: none;
  }
}

/*
  Here everything goes to portrait view
*/

@media screen and (max-width: 767px) {
  .hero-content {
    align-items: center;
    row-gap: 2rem;
  }

  footer {
    text-align: center;
  }

  .footer-bgWrapper img {
    height: 100px;
  }

  .nav-items.-footer li {
    font-size: 0.8rem;
    padding: 0;
    border: none;
  }
}

@media only screen and (max-width: 481px) {
  .showcase-item {
    width: 250px;
    margin: 0 auto;
  }

  .course-showcase > :nth-child(n) .item-cover {
    height: 150px;
  }

  .content-wrapper.hero {
    padding: 0 40px;
  }
}
</style>