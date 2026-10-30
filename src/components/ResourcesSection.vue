<script setup>
const r = [
  { n: 'Code.org', u: 'https://code.org/', src: '/media/programacion.jpg', alt: 'Código fuente en una pantalla' },
  { n: 'Scratch', u: 'https://scratch.mit.edu/', src: '/media/computacion-colaborativa.jpg', alt: 'Persona usando una computadora' },
  { n: 'CS Unplugged', u: 'https://csunplugged.org/en/', src: '/media/equipo-pensando.jpg', alt: 'Equipo colaborando en un reto' }
]
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Sigue explorando</h2>
      <p class="lead">Pídele a tu profe que elija la actividad según tu edad y tu wifi.</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <a v-for="x in r" :key="x.n" :href="x.u" target="_blank" rel="noopener" class="glass enlace" v-ripple>
          <img :src="x.src" :alt="x.alt" loading="lazy" decoding="async" />
          <span>{{ x.n }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;align-items:stretch}
.enlace{display:flex;align-items:center;gap:.9rem;padding:.7rem;color:#fff;text-decoration:none;font-weight:600;overflow:hidden;transition:transform .3s var(--rebote)}
.enlace:hover{transform:translateY(-6px) scale(1.04)}
.enlace img{width:80px;height:64px;flex:none;border-radius:20px;object-fit:cover}
@media(max-width:560px){.fila{grid-template-columns:1fr}}
</style>
