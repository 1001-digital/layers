<template>
  <div class="playground">
    <h1>EvmArtifact</h1>

    <Card>
      <h2>Animation toggle</h2>
      <FormSwitch
        v-model="showAnimation"
        label="Play animation"
      />
    </Card>

    <div class="grid">
      <Card>
        <h3>Static image</h3>
        <p class="hint">Image only, no <code>animation_url</code>.</p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="staticOnly"
        />
      </Card>

      <Card>
        <h3>Video animation</h3>
        <p class="hint">
          <code>animation_url</code> ending in <code>.mp4</code>.
        </p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="videoToken"
        />
      </Card>

      <Card>
        <h3>Video with poster</h3>
        <p class="hint">
          Lightweight <code>image</code> shows immediately as the
          <code>&lt;video&gt;</code> poster while the heavy <code>.mp4</code>
          loads.
        </p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="videoWithPosterToken"
        />
      </Card>

      <Card>
        <h3>Video with controls</h3>
        <p class="hint">
          <code>controls</code> shows the native player so viewers can unmute
          audio. Autoplay stays muted.
        </p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="videoToken"
          controls
        />
      </Card>

      <Card>
        <h3>HTML / iframe animation</h3>
        <p class="hint">
          Generative HTML, falls through to <code>Embed</code>.
        </p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="iframeToken"
        />
      </Card>

      <Card>
        <h3>3D (.glb)</h3>
        <p class="hint">Lazy-loads <code>@google/model-viewer</code>.</p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :metadata="glbToken"
        />
      </Card>

      <Card>
        <h3>Individual props (decoupled)</h3>
        <p class="hint">
          No <code>metadata</code>; <code>image</code>/<code>animationUrl</code>
          passed directly.
        </p>
        <EvmArtifact
          v-model:show-animation="showAnimation"
          :image="staticOnly.image"
          :animation-url="videoToken.animation_url"
          :name="staticOnly.name"
          background-color="0a0a0a"
        />
      </Card>

      <Card>
        <h3>Empty / fallback</h3>
        <p class="hint">
          No <code>image</code> or <code>animation_url</code> — renders fallback
          slot.
        </p>
        <EvmArtifact :metadata="{ name: 'Untitled artifact' }">
          <template #fallback="{ artifactName }">
            <div class="custom-fallback">No media — {{ artifactName }}</div>
          </template>
        </EvmArtifact>
      </Card>
    </div>

    <NuxtLink to="/">Back</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const showAnimation = ref(true)

const staticOnly = {
  name: 'Static PNG',
  image:
    'https://ipfs.vv.xyz/ipfs/QmaRVTjYCNwjMXJW4kh3ix8BvpH27PPCCCLkiPEeZXbAGK/nft.png',
  animation_url: null,
  background_color: '1a2b3c',
} as const

const videoToken = {
  name: 'Video animation',
  image:
    'https://ipfs.vv.xyz/ipfs/QmaRVTjYCNwjMXJW4kh3ix8BvpH27PPCCCLkiPEeZXbAGK/nft.png',
  animation_url:
    'https://ipfs.vv.xyz/ipfs/Qma2J3HeaTw8G33uXotELP8N32wkR2cj6iM4EKMdw2zCLr/nft.mp4',
  background_color: null,
} as const

const videoWithPosterToken = {
  name: 'Video with poster',
  image:
    'https://cdn.evm.now/tokens/4e143918b8806972295212948b5e05c51407752c4b4a424edcfcc423e6f5d2da_sm.webp',
  animation_url:
    'https://ipfs.networked.art/ipfs/QmWMvcCNVPCWR7CeWW4h8x8FptsQnRcrK2swxZQRRGqvWg/nft.mp4',
  background_color: null,
} as const

const iframeToken = {
  name: 'HTML / iframe',
  image:
    'https://ipfs.evm.now/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuFunLgtBBAj7ZF6T1zE',
  animation_url: 'https://example.com/',
  background_color: null,
} as const

const glbToken = {
  name: '3D model',
  image:
    'https://ipfs.evm.now/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuFunLgtBBAj7ZF6T1zE',
  animation_url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  background_color: null,
} as const
</script>

<style scoped>
.playground {
  max-width: 60rem;
  margin: 0 auto;
  padding: var(--spacer);
  display: grid;
  gap: var(--spacer);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: var(--spacer);
}

.hint {
  color: var(--gray-z-7);
  font-size: 0.875em;
}

.custom-fallback {
  padding: var(--spacer);
  text-align: center;
  color: var(--gray-z-7);
}
</style>
