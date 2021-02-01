<template>
  <h1>Vite Playground</h1>
  <div class="d-row">This div should be green</div>
  <Doc></Doc>
</template>

<script lang="ts">
import Doc from './components/button.docs.md'

const App = {
  components: {
    Doc
  }
}
export default App
</script>
<style scoped>
.d-row,
:slotted(.d-row) {
  background: green;
  color: white;
}
</style>
