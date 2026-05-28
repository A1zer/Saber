<script setup lang="ts">

</script>

<template>
  <div class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="title -hero">Communities</h1>

        <div class="image-wrapper">
          <img
              src="https://images.pexels.com/photos/267961/pexels-photo-267961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              class="blurred-image"
          />
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
          fill-opacity="1"
          d="M0,192L21.8,176C43.6,160,87,128,131,144C174.5,160,218,224,262,256C305.5,288,349,288,393,256C436.4,224,480,160,524,128C567.3,96,611,96,655,117.3C698.2,139,742,181,785,165.3C829.1,149,873,75,916,69.3C960,64,1004,128,1047,170.7C1090.9,213,1135,235,1178,245.3C1221.8,256,1265,256,1309,229.3C1352.7,203,1396,149,1418,122.7L1440,96L1440,320L1418.2,320C1396.4,320,1353,320,1309,320C1265.5,320,1222,320,1178,320C1134.5,320,1091,320,1047,320C1003.6,320,960,320,916,320C872.7,320,829,320,785,320C741.8,320,698,320,655,320C610.9,320,567,320,524,320C480,320,436,320,393,320C349.1,320,305,320,262,320C218.2,320,175,320,131,320C87.3,320,44,320,22,320L0,320Z"
      ></path>
    </svg>
  </div>
  <div class="page-container">
    <!-- SEKCE 1: FIND (Tmavé pozadí) -->
    <section class="landing-section -light">
      <div class="section-grid-wrapper">
        <!-- Levá strana: Texty -->
        <div class="section-text-block">
          <span class="section-number-hint">01</span>
          <h2 class="section-heading">Find courses tailored to your needs</h2>
          <div class="section-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada.
              Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat.
              Pellentesque ipsum. Fusce aliquam vestibulum ipsum.
            </p>
            <p>
              Pellentesque sapien. Suspendisse nisl. Pellentesque ipsum. Proin pede metus,
              vulputate nec, fermentum fringilla, vehicula vitae, justo.
            </p>
          </div>
        </div>
        <!-- Pravá strana: Karta kurzu -->
        <div class="section-visual-block">
          <!-- Zde můžete rovnou zavolat vaši hotovou komponentu! -->
<!--          <CourseSection title="" :courses="[publicCourses[0]]" :is-loading="false" />-->
          <span class="watermark-bg">Find</span>
        </div>
      </div>
    </section>

    <!-- SEKCE 2: JOIN (Světlé pozadí) -->
    <section class="landing-section -dark">
      <div class="section-grid-wrapper -reversed">
        <!-- Pravá strana z Figmy (v HTML dáváme nejdřív text kvůli mobilům) -->
        <div class="section-text-block">
          <span class="section-number-hint">02</span>
          <h2 class="section-heading">Join various communities across all your niches</h2>
          <div class="section-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada.
              Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat.
              Pellentesque ipsum. Fusce aliquam vestibulum ipsum.
            </p>
            <p>
              Pellentesque sapien. Suspendisse nisl. Pellentesque ipsum. Proin pede metus,
              vulputate nec, fermentum fringilla, vehicula vitae, justo.
            </p>
          </div>
        </div>
        <!-- Levá strana z Figmy: Karta kurzu -->
        <div class="section-visual-block">
<!--          <CourseSection title="" :courses="[publicCourses[1]]" :is-loading="false" />-->
          <span class="watermark-bg">Join</span>
        </div>
      </div>
    </section>

    <!-- SEKCE 3: SHARE (Tmavé pozadí) -->
    <section class="landing-section -light">
      <div class="section-grid-wrapper">
        <!-- Levá strana: Texty -->
        <div class="section-text-block">
          <span class="section-number-hint">03</span>
          <h2 class="section-heading">Share your knowledge with others</h2>
          <div class="section-description">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada.
              Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat.
              Pellentesque ipsum. Fusce aliquam vestibulum ipsum.
            </p>
            <p>
              Pellentesque sapien. Suspendisse nisl. Pellentesque ipsum. Proin pede metus,
              vulputate nec, fermentum fringilla, vehicula vitae, justo.
            </p>
          </div>
        </div>
        <!-- Pravá strana: Karta kurzu -->
        <div class="section-visual-block">
<!--          <CourseSection title="" :courses="[publicCourses[2]]" :is-loading="false" />-->
          <span class="watermark-bg">Share</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  height: 600px;
  position: relative;
  background-color: #111111;
  background-size: cover;
  background-position: center;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    clip-path: polygon(100% 20%, 60% 100%, 100% 100%);
    background-color: var(--background);
  }
}

.wave {
  position: absolute;
  bottom: -30px;
  height: 300px;
  width: max(100%, 1900px);
  z-index: 20;
}

.page-container {
  background-color: var(--background);
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.hero-container {
  height: 100%;
  max-width: 1600px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
  padding: 0 4rem;
  margin: 0 auto;
}

.hero-content {
  color: var(--text);
  grid-area: text;
  font-weight: var(--font-weight);
  text-shadow: 0px -4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 4rem;
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
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration: none;
  font-size: 1.25em;
}

.blurred-image {
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
  box-shadow: inset 0 0 0 200px rgba(250, 197, 255, 0.09);
  animation: 0.8s cubic-bezier(0.26, 0.54, 0.32, 1) 0.3s forwards;
  animation-name: rise-up;
}

.image-wrapper {
  height: 400px;
  width: 750px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #181818;
  border-top: 2px solid rgba(225, 225, 225, 0.3);
  border-left: 1px solid rgba(225, 225, 225, 0.2);
  border-right: 1px solid rgba(225, 225, 225, 0.2);
  box-shadow: 0rem 0.3rem 1rem var(--text-black);
}

.landing-section {
  padding: 100px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Přepínání barev pozadí podle tříd */
.landing-section.-dark {
  background-color: var(--background-black); /* Temně černá z Figmy */
  color: var(--text);
}

.landing-section.-light {
  background-color: var(--background); /* Čistě bílá */
  color: var(--text-black);
}

/* Hlavní mřížka dvousloupcového splitu */
.section-grid-wrapper {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr; /* Text dostane o něco víc místa než karta */
  gap: 80px;
  align-items: center;
}

/* Třída pro obrácení sloupců (Z-pattern u prostřední sekce) */
.section-grid-wrapper.-reversed {
  grid-template-columns: 1fr 1.2fr;
}
.section-grid-wrapper.-reversed .section-text-block {
  grid-column: 2; /* Přesune text doprava */
}
.section-grid-wrapper.-reversed .section-visual-block {
  grid-column: 1; /* Přesune kartu doleva */
  grid-row: 1;    /* Zajistí, že na mobilu bude text nad kartou */
}

/* Levý textový blok */
.section-text-block {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

/* Malé číselné nápovědy nad nadpisy (01, 02...) */
.section-number-hint {
  font-size: 0.9rem;
  font-weight: 800;
  opacity: 0.5;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.-dark .section-number-hint {
  color: #ffffff;
}
.-light .section-number-hint {
  color: #64748b;
}

/* Hlavní velké nadpisy z Figmy */
.section-heading {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 30px 0;
  max-width: 500px;
}

/* Bloky s odstavci textu */
.section-description p {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.-dark .section-description p {
  color: #cbd5e1; /* Příjemná světle šedá na tmavém pozadí */
}
.-light .section-description p {
  color: #475569; /* Tmavě šedá na bílém pozadí */
}

.section-description p:last-child {
  margin-bottom: 0;
}

/* Pravý vizuální blok s kartou */
.section-visual-block {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Velký šedý text na pozadí jako vodoznak (Find, Join, Share) */
.watermark-bg {
  //position: absolute;
  font-size: 8rem;
  font-weight: 900;
  pointer-events: none;
  z-index: 1;
  opacity: 0.1; /* Velmi decentní, aby nerušil kartu */
  right: -20px;
  top: -40px;
}

.-dark .watermark-bg {
  color: var(--background);
}
.-light .watermark-bg {
  color: var(--background-dark);
}


</style>