<script setup>
import PhotoCard from './PhotoCard.vue'

const pilares = [
  { t: 'Descomposición', src: '/media/descomposicion.jpg', alt: 'Varias computadoras organizadas alrededor de una mesa de trabajo' },
  { t: 'Patrones', src: '/media/patrones.jpg', alt: 'Placa electrónica con circuitos y componentes' },
  { t: 'Abstracción', src: '/media/abstraccion.jpg', alt: 'Personas planificando ideas junto a una computadora' },
  { t: 'Algoritmos', src: '/media/algoritmos.jpg', alt: 'Espacio de trabajo luminoso para organizar ideas' }
]
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Los 4 superpoderes</h2>
      <p class="lead">Cuatro herramientas para pensar y resolver problemas.</p>
    </div>
    <div class="visual-seccion">
      <div class="rejilla">
        <div v-for="p in pilares" :key="p.t" class="carta" aria-disabled="true">
          <PhotoCard :src="p.src" :alt="p.alt" :caption="p.t" />
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.rejilla{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;max-width:760px;margin:0 auto}
.carta{display:block;height:220px;position:relative}
@media(max-width:560px){.rejilla{grid-template-columns:1fr}}
</style>
