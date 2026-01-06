<template>
  <div>
    <h2>Setlist</h2>
    <p>Event: {{ eventId }}</p>
    <p>(Soon: drag-and-drop songs + PDF viewer.)</p>
  </div>
</template>

<script>
export default {
  name: 'SetlistPage',
  props: {
    eventId: { type: String, required: true }
  }
}
</script>
