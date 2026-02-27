<template>
  <div class="playground">
    <h1>Inline Connect</h1>

    <EvmConnectionStatus v-slot="{ status, address }">
      <p v-if="status === 'reconnecting'">Loading...</p>
      <Card v-else-if="status === 'disconnected' || status === 'connecting'">
        <EvmConnect />
      </Card>
      <p v-else-if="status === 'connected'">
        Connected: <EvmAccount :address="address" />
      </p>
    </EvmConnectionStatus>

    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.playground {
  max-width: 50rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}
</style>
