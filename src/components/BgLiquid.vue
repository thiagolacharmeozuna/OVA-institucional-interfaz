<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)
const lines = [
  'const problema = "grande";',
  'function resolver( problema ) {',
  '  const partes = descomponer(problema);',
  '  for (const parte of partes) {',
  '    identificarPatrones(parte);',
  '    abstraer(datos);',
  '    ejecutar(algoritmo);',
  '  }',
  '  return solucion;',
  '}',
  'if (resultado === esperado) {',
  '  aprender();',
  '} else { revisarPasos(); }',
  'const ideas = pensar().crear().probar();',
  'while (hayProblemas) { buscarSolucion(); }'
]

let gl
let fallbackContext
let texture
let textureInitialized = false
let program
let positionBuffer
let pointerLocation
let resolutionLocation
let strengthLocation
let sourceCanvas
let sourceContext
let codeTile
let frame
let width = 0
let height = 0
let pixelRatio = 1
let offset = 0
let lastFrame = 0
let reduceMotion
let isVisible = true
const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, strength: 0, targetStrength: 0 }
const lineHeight = 27
const columnWidth = 460
const tileHeight = lineHeight * lines.length
const drawRate = 1000 / 60
const fallSpeed = 24

const createShader = (context, type, source) => {
  const shader = context.createShader(type)
  if (!shader) return null

  context.shaderSource(shader, source)
  context.compileShader(shader)
  if (context.getShaderParameter(shader, context.COMPILE_STATUS)) return shader

  console.error('No se pudo compilar el shader del fondo:', context.getShaderInfoLog(shader))
  context.deleteShader(shader)
  return null
}

const initializeWebGL = () => {
  if (!canvas.value) return false

  gl = canvas.value.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' })
  if (!gl) return false

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    varying vec2 v_uv;
    void main() {
      v_uv = a_uv;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_code;
    uniform vec2 u_pointer;
    uniform vec2 u_resolution;
    uniform float u_strength;
    void main() {
      vec2 delta = v_uv - u_pointer;
      vec2 distanceFromPointer = abs(delta * u_resolution) / (u_resolution * vec2(0.55, 0.65));
      float proximity = exp(-1.6 * (pow(distanceFromPointer.x, 4.0) + pow(distanceFromPointer.y, 4.0)));
      float zoom = 1.0 + 0.15 * proximity * u_strength;
      vec2 sourceUv = clamp(u_pointer + delta / zoom, 0.0, 1.0);
      gl_FragColor = texture2D(u_code, sourceUv);
    }
  `)

  if (!vertexShader || !fragmentShader) return false

  program = gl.createProgram()
  if (!program) return false
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('No se pudo enlazar el shader del fondo:', gl.getProgramInfoLog(program))
    return false
  }

  gl.useProgram(program)
  positionBuffer = gl.createBuffer()
  if (!positionBuffer) return false
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 0, 0,
    1, -1, 1, 0,
    -1, 1, 0, 1,
    1, 1, 1, 1
  ]), gl.STATIC_DRAW)

  const position = gl.getAttribLocation(program, 'a_position')
  const uv = gl.getAttribLocation(program, 'a_uv')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 16, 0)
  gl.enableVertexAttribArray(uv)
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 16, 8)

  texture = gl.createTexture()
  if (!texture) return false
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.uniform1i(gl.getUniformLocation(program, 'u_code'), 0)
  pointerLocation = gl.getUniformLocation(program, 'u_pointer')
  resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  strengthLocation = gl.getUniformLocation(program, 'u_strength')
  return true
}

const createCodeTile = () => {
  const columns = Math.ceil(width / columnWidth)
  codeTile = document.createElement('canvas')
  codeTile.width = Math.ceil(width * pixelRatio)
  codeTile.height = Math.ceil(tileHeight * pixelRatio)
  const context = codeTile.getContext('2d')
  if (!context) return

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.font = '15px Consolas, "Courier New", monospace'
  context.textBaseline = 'top'

  for (let column = 0; column < columns; column += 1) {
    const x = column * columnWidth + 18
    for (let row = 0; row < lines.length; row += 1) {
      const opacity = 0.24 + ((row * 7 + column * 13) % 5) * 0.045
      context.fillStyle = `rgba(72, 255, 133, ${opacity * 0.55})`
      context.fillText(String(row + 1).padStart(2, '0'), x, row * lineHeight)
      context.fillStyle = `rgba(72, 255, 133, ${opacity})`
      context.fillText(lines[(row + column * 4) % lines.length], x + 34, row * lineHeight, columnWidth - 54)
    }
  }
}

const renderSource = () => {
  if (!sourceContext || !sourceCanvas) return
  sourceContext.fillStyle = '#020604'
  sourceContext.fillRect(0, 0, width, height)
  const tileOffset = offset % tileHeight
  for (let y = tileOffset - tileHeight; y < height; y += tileHeight) {
    sourceContext.drawImage(codeTile, 0, y, width, tileHeight)
  }
}

const paint = () => {
  if (!canvas.value) return
  renderSource()

  if (gl && program && texture && sourceCanvas) {
    gl.viewport(0, 0, canvas.value.width, canvas.value.height)
    gl.useProgram(program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    if (textureInitialized) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
      textureInitialized = true
    }
    gl.uniform2f(pointerLocation, pointer.x, pointer.y)
    gl.uniform2f(resolutionLocation, width, height)
    gl.uniform1f(strengthLocation, pointer.strength)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    return
  }

  if (fallbackContext && sourceCanvas) {
    fallbackContext.clearRect(0, 0, width, height)
    fallbackContext.drawImage(sourceCanvas, 0, 0, width, height)
  }
}

const resize = () => {
  if (!canvas.value) return

  pixelRatio = Math.min(window.devicePixelRatio || 1, 0.75)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = Math.round(width * pixelRatio)
  canvas.value.height = Math.round(height * pixelRatio)
  sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = canvas.value.width
  sourceCanvas.height = canvas.value.height
  textureInitialized = false
  sourceContext = sourceCanvas.getContext('2d')
  if (!sourceContext) return
  sourceContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  createCodeTile()
  paint()
}

const animate = time => {
  if (!isVisible || reduceMotion?.matches) return
  frame = window.requestAnimationFrame(animate)
  if (time - lastFrame < drawRate) return

  const delta = lastFrame ? Math.min(time - lastFrame, 100) : drawRate
  lastFrame = time
  offset = (offset + fallSpeed * delta / 1000) % tileHeight
  pointer.x += (pointer.targetX - pointer.x) * 0.18
  pointer.y += (pointer.targetY - pointer.y) * 0.18
  pointer.strength += (pointer.targetStrength - pointer.strength) * 0.16
  paint()
}

const onMotionChange = event => {
  if (event.matches) {
    window.cancelAnimationFrame(frame)
    paint()
  } else if (isVisible) {
    lastFrame = 0
    frame = window.requestAnimationFrame(animate)
  }
}

const onVisibilityChange = () => {
  isVisible = !document.hidden
  if (!isVisible) {
    window.cancelAnimationFrame(frame)
    return
  }

  lastFrame = 0
  if (!reduceMotion?.matches) frame = window.requestAnimationFrame(animate)
}

const onPointerMove = event => {
  if (event.pointerType !== 'mouse') {
    pointer.targetStrength = 0
    return
  }

  pointer.targetX = event.clientX / width
  pointer.targetY = 1 - event.clientY / height
  pointer.targetStrength = 1

  if (reduceMotion?.matches) {
    pointer.x = pointer.targetX
    pointer.y = pointer.targetY
    pointer.strength = 1
    paint()
  }
}

const onPointerLeave = () => {
  pointer.targetStrength = 0
  if (reduceMotion?.matches) {
    pointer.strength = 0
    paint()
  }
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (initializeWebGL()) {
    resize()
  } else {
    gl = null
    fallbackContext = canvas.value?.getContext('2d')
    resize()
  }
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibilityChange)
  reduceMotion.addEventListener('change', onMotionChange)
  if (!reduceMotion.matches) frame = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerleave', onPointerLeave)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  reduceMotion?.removeEventListener('change', onMotionChange)
  window.cancelAnimationFrame(frame)
  if (gl) {
    gl.deleteTexture(texture)
    gl.deleteBuffer(positionBuffer)
    gl.deleteProgram(program)
  }
})
</script>

<template>
  <div class="code-background" aria-hidden="true">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.code-background{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;background:#020604}
canvas{display:block;width:100%;height:100%}
.code-background::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 15%,rgba(0,0,0,.72) 100%);pointer-events:none}
</style>
