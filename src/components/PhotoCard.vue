<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, default: '' }
})
</script>

<template>
  <figure class="photo-card glass">
    <img :src="src" :alt="alt" loading="lazy" decoding="async" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.photo-card{position:relative;width:100%;height:100%;min-width:0;min-height:220px;overflow:hidden;margin:0}
img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.photo-card:hover img{transform:scale(1.04)}
figcaption{position:absolute;inset:auto 0 0;padding:2.5rem 1rem .85rem;color:#fff;font-size:.95rem;font-weight:600;background:linear-gradient(transparent,rgba(0,0,0,.78))}
@media(prefers-reduced-motion:reduce){img{transition:none}}
</style>
