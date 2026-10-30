<script setup>
const misiones = [
  { t: 'Une los conceptos', h: 'Relaciona las ideas clave', src: '/media/mision-conceptos.jpg', alt: 'Estudiantes colaborando alrededor de una mesa con computadoras' },
  { t: 'Ordena los pasos', h: 'Organiza las instrucciones', src: '/media/mision-pasos.jpg', alt: 'Computadora portátil iluminada en un entorno oscuro' },
  { t: 'Resuelve el reto', h: 'Analiza una situación en equipo', src: '/media/mision-reto.jpg', alt: 'Compañeros analizando código juntos en una computadora' },
  { t: 'Crea tu algoritmo', h: 'Diseña una secuencia de pasos', src: '/media/mision-algoritmo.jpg', alt: 'Computadora retro y dispositivos electrónicos' }
]
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Misiones</h2>
      <p class="lead">Practica los conceptos con estos retos.</p>
    </div>
    <div class="visual-seccion">
      <ul>
        <li v-for="(m, n) in misiones" :key="m.t">
          <button class="mision glass" type="button" disabled>
            <img class="mision-foto" :src="m.src" :alt="m.alt" loading="lazy" decoding="async" />
            <span><strong>{{ m.t }}</strong><small>{{ m.h }}</small></span>
            <em>☆</em>
          </button>
        </li>
      </ul>
      <p class="marca">Retos</p>
    </div>
  </section>
</template>
<style scoped>
ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;max-width:820px;margin:0 auto}
.mision{font:inherit;color:inherit;width:100%;display:flex;align-items:center;gap:1rem;text-align:left;padding:.8rem;overflow:hidden}
.mision:disabled{opacity:1;cursor:default}
.mision-foto{width:88px;height:88px;flex:none;border-radius:20px;object-fit:cover}
.mision span{display:grid}.mision small{opacity:.75}
.mision em{margin-left:auto;font-style:normal;font-size:1.8rem}
.marca{text-align:center;margin-top:1.5rem;font-size:1.3rem;font-weight:700}
@media(max-width:640px){ul{grid-template-columns:1fr}}
</style>
