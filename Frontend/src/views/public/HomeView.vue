<script setup lang="ts">

</script>

<template>
  <div class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-content-text">
          <h1 class="title left -hero">
            Elevate your knowledge with micro-learning
          </h1>
          <div class="hero-subtitle">
            <button class="button primary">
              Elevate your knowledge in a swing
            </button>
          </div>
        </div>

        <img
            src="https://images.pexels.com/photos/1036372/pexels-photo-1036372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            class="image -hero"
        />
      </div>
    </div>
  </div>
  <div class="page-extender"></div>
  <div class="page-container">
    <section>
      <div class="section-wrapper">
        <h2 class="title center -wrapped">
          Share your knowledge with others!
        </h2>
        <div class="section-content">
          <div class="article-container -decorated">
            <article class="article">
              <p>
                Everyone has something valuable to share, and your unique
                expertise could change someone’s life. Whether you’re a
                seasoned professional, a passionate hobbyist, or someone
                with a unique story, this is your chance to make an impact.
              </p>
              <br />
              <p>
                By sharing your knowledge, you’re not only helping others
                grow—you’re also building your own personal brand and
                joining a growing network of like-minded individuals. Create
                courses, host discussions, or simply share your tips and
                insights. Together, we can build a thriving community of
                learners and teachers.
              </p>
            </article>
          </div>

          <div class="article-slideshow intro">
            <img
                src="https://images.pexels.com/photos/3183127/pexels-photo-3183127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                class="image -section"
            />
            <div class="slideshow-navigation">
              <span class="arrow-left-bold"></span>
              <span class="oval" onclick="currentSlide(1)"></span>
              <span class="oval" onclick="currentSlide(2)"></span>
              <span class="oval" onclick="currentSlide(3)"></span>
              <span class="arrow-right-bold"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="communities-section">
      <div class="section-wrapper lBorder">
        <div class="section-content">
          <div class="article-container -flex">
            <h2 class="title left">Join our exclusive communities!</h2>
            <article class="article">
              <p>
                Learning doesn’t have to be a solo journey. When you join
                our exclusive communities, you’ll find a network of people
                who are just as curious, driven, and passionate as you are.
                Connect with others who share your interests, exchange
                ideas, and collaborate on exciting projects.
              </p>
              <br />
              <p>
                Our communities are built to inspire and empower you. From
                lively discussions to expert-led Q&A sessions, you’ll always
                find support and encouragement to keep going. Join today and
                experience what it’s like to learn and grow alongside a
                community that has your back.
              </p>
            </article>
            <a href="communities.html"
            ><button class="button primary">
              <span>Find out more!</span>
            </button></a
            >
          </div>
          <div class="article-slideshow communities">
            <img
                src="https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                class="image -section"
            />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-wrapper">
        <h2 class="title center">Free tutorials</h2>
        <div class="tutorials-content">
          <div class="article-container">
            <article class="article center">
              <p>
                Quality learning should be accessible to everyone, and we’re
                here to make that happen. Explore our collection of free
                tutorials, packed with valuable insights and actionable
                steps to help you get started.
              </p>
              <br />
              <p>
                From quick tips to in-depth guides, our free resources are
                designed to give you a taste of what’s possible. Learn new
                skills, test out topics you’re curious about, and start
                seeing results—all at no cost. There’s no better way to take
                the first step on your learning journey.
              </p>
            </article>
          </div>
          <div class="article-slideshow tutorials">
            <img
                src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                class="image -section"
            />
            <div class="slideshow-navigation">
              <span class="arrow-left-bold"></span>
              <span class="oval" onclick="currentSlide(1)"></span>
              <span class="oval" onclick="currentSlide(2)"></span>
              <span class="oval" onclick="currentSlide(3)"></span>
              <span class="arrow-right-bold"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="page-extender --footer"></div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  row-gap: 7rem;
  padding-top: 1rem;
  padding-bottom: 3rem;
  padding-left: 2rem;
  padding-right: 2rem;
  max-width: 1250px;
  margin: 0 auto;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  column-gap: 30px;
  padding: 11.25em 0;
}

.hero-content-text {
  color: var(--text);
  grid-area: text;
  font-weight: var(--font-weight);
  display: flex;
  max-width: 700px;
  padding: 30px 0px;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}

.hero-subtitle button {
  background-color: #3c8b51;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 18px 18px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  font-size: 1.25em;
}
</style>