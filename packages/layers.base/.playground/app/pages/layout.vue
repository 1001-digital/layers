<template>
  <main class="layout-page">
    <header>
      <h1>Layout Components</h1>
      <p>App shell, sidebar, and bottom navigation components for building responsive application layouts.</p>
    </header>

    <!-- AppShell -->
    <section>
      <h2>AppShell</h2>

      <Card>
        <h3>Overview</h3>
        <p>
          The <code>&lt;AppShell&gt;</code> component provides the outer layout structure.
          It uses flexbox to position the sidebar alongside the main content,
          and provides a slot for a mobile bottom navigation.
        </p>

        <div class="component-demo">
          <h4>Slots</h4>
          <dl>
            <dt><code>#sidebar</code></dt>
            <dd>Sidebar content. Renders a <code>&lt;Sidebar&gt;</code> internally.</dd>
            <dt><code>#default</code></dt>
            <dd>Main page content.</dd>
            <dt><code>#bottom-nav</code></dt>
            <dd>Bottom navigation items. Renders a <code>&lt;BottomNav&gt;</code> internally.</dd>
          </dl>
        </div>

        <div class="component-demo">
          <h4>Props</h4>
          <dl>
            <dt><code>v-model:sidebar-open</code></dt>
            <dd>Controls sidebar open state.</dd>
            <dt><code>sidebar-side</code></dt>
            <dd><code>'left'</code> (default) or <code>'right'</code></dd>
            <dt><code>sidebar-swipeable</code></dt>
            <dd>Enable swipe gestures (default <code>true</code>)</dd>
          </dl>
        </div>

        <div class="component-demo">
          <h4>Usage</h4>
          <pre><code>&lt;AppShell v-model:sidebar-open="open"&gt;
  &lt;template #sidebar&gt;
    &lt;nav&gt;...&lt;/nav&gt;
  &lt;/template&gt;

  &lt;NuxtPage /&gt;

  &lt;template #bottom-nav&gt;
    &lt;NuxtLink to="/"&gt;&lt;Icon type="home" /&gt;&lt;/NuxtLink&gt;
    &lt;NuxtLink to="/search"&gt;&lt;Icon type="lucide:search" /&gt;&lt;/NuxtLink&gt;
  &lt;/template&gt;
&lt;/AppShell&gt;</code></pre>
        </div>
      </Card>
    </section>

    <!-- Sidebar -->
    <section>
      <h2>Sidebar</h2>

      <Card>
        <h3>Behavior</h3>
        <div class="behavior-grid">
          <div class="behavior-item">
            <h4>Mobile (&lt; 1024px)</h4>
            <ul>
              <li>Slides out from the side</li>
              <li>Overlay dims the content behind</li>
              <li>Swipe from edge to open</li>
              <li>Swipe or tap overlay to close</li>
              <li>Body scroll is locked when open</li>
            </ul>
          </div>
          <div class="behavior-item">
            <h4>Desktop (&ge; 1024px)</h4>
            <ul>
              <li>Always visible, in-flow</li>
              <li>Sticky positioning (stays in view on scroll)</li>
              <li>No overlay</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Standalone Usage</h3>
        <p>
          The sidebar can be used independently without AppShell.
          It exposes <code>open()</code>, <code>close()</code>, and <code>toggle()</code> methods via template ref.
        </p>

        <div class="component-demo">
          <h4>Props</h4>
          <dl>
            <dt><code>v-model:open</code></dt>
            <dd>Controls open state</dd>
            <dt><code>side</code></dt>
            <dd><code>'left'</code> (default) or <code>'right'</code></dd>
            <dt><code>swipeable</code></dt>
            <dd>Enable swipe gestures (default <code>true</code>)</dd>
          </dl>
        </div>

        <div class="component-demo">
          <h4>Usage</h4>
          <pre><code>&lt;Sidebar v-model:open="sidebarOpen"&gt;
  &lt;nav&gt;...&lt;/nav&gt;
&lt;/Sidebar&gt;
&lt;main&gt;...&lt;/main&gt;</code></pre>
        </div>
      </Card>

      <Card>
        <h3>CSS Custom Properties</h3>
        <div class="token-list">
          <div v-for="token in sidebarTokens" :key="token.name" class="token-item">
            <code>{{ token.name }}</code>
            <span>{{ token.default }}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3>Interactive Demo</h3>
        <p>
          This playground is wrapped in an <code>&lt;AppShell&gt;</code>.
          Try resizing your browser or use the hamburger menu on mobile to see the sidebar in action.
        </p>
        <div class="demo-row">
          <Button @click="toggleSidebar">Toggle Sidebar</Button>
        </div>
      </Card>
    </section>

    <!-- BottomNav -->
    <section>
      <h2>BottomNav</h2>

      <Card>
        <h3>Overview</h3>
        <p>
          Fixed bottom navigation bar for mobile. Hidden on desktop (&ge; 1024px).
          Includes safe area inset padding for notched devices and a backdrop blur effect.
        </p>

        <div class="component-demo">
          <h4>Usage</h4>
          <pre><code>&lt;BottomNav&gt;
  &lt;NuxtLink to="/"&gt;
    &lt;Icon type="home" /&gt;
  &lt;/NuxtLink&gt;
  &lt;NuxtLink to="/search"&gt;
    &lt;Icon type="lucide:search" /&gt;
  &lt;/NuxtLink&gt;
  &lt;NuxtLink to="/profile"&gt;
    &lt;Icon type="lucide:user" /&gt;
  &lt;/NuxtLink&gt;
&lt;/BottomNav&gt;</code></pre>
        </div>

        <p class="hint">
          Resize to mobile to see the bottom navigation below.
          Links and buttons inside get automatic active-state styling via <code>.router-link-active</code>.
        </p>
      </Card>

      <Card>
        <h3>CSS Custom Properties</h3>
        <div class="token-list">
          <div v-for="token in bottomNavTokens" :key="token.name" class="token-item">
            <code>{{ token.name }}</code>
            <span>{{ token.default }}</span>
          </div>
        </div>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
const sidebarTokens = [
  { name: '--sidebar-width', default: 'min(20rem, 100vw)' },
  { name: '--sidebar-background', default: 'var(--gray-z-0)' },
  { name: '--sidebar-border', default: 'var(--border)' },
  { name: '--sidebar-z-index', default: 'var(--z-index-overlay)' },
  { name: '--sidebar-overlay-background', default: 'var(--background)' },
]

const bottomNavTokens = [
  { name: '--bottom-nav-height', default: 'calc(3.5rem + env(safe-area-inset-bottom))' },
  { name: '--bottom-nav-background', default: 'var(--background-semi)' },
  { name: '--bottom-nav-z-index', default: 'var(--z-index-overlay)' },
]

const sidebarOpen = useState('sidebar-open')

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<style scoped>
.layout-page {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--spacer-lg);
  display: grid;
  gap: var(--spacer-xl);

  > header {
    border-bottom: var(--border);
    padding-bottom: var(--spacer-lg);

    h1 {
      font-size: var(--font-2xl);
      margin-bottom: var(--spacer-sm);
    }

    p {
      color: var(--muted);
    }
  }
}

section {
  display: grid;
  gap: var(--spacer-lg);

  > h2 {
    font-size: var(--font-xl);
    border-bottom: var(--border);
    padding-bottom: var(--spacer-sm);
  }
}

:deep(.card) > h3 {
  font-family: var(--font-family);
  font-size: var(--ui-font-size);
  text-transform: var(--ui-text-transform);
  color: var(--muted);
}

.component-demo {
  display: grid;
  gap: var(--spacer-sm);
  padding: var(--spacer);
  background: var(--gray-z-0);
  border: var(--border);

  h4 {
    font-size: var(--font-sm);
    color: var(--muted);
  }

  pre {
    overflow-x: auto;
    font-size: var(--font-sm);
    line-height: var(--line-height-lg);
  }
}

dl {
  display: grid;
  gap: var(--spacer-sm);

  dt {
    font-weight: var(--font-weight-bold);
  }

  dd {
    color: var(--muted);
    font-size: var(--font-sm);
    margin-inline-start: 0;
  }
}

.behavior-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--spacer);
}

.behavior-item {
  h4 {
    font-size: var(--font-sm);
    color: var(--muted);
    margin-bottom: var(--spacer-sm);
  }

  ul {
    display: grid;
    gap: var(--spacer-xs);
    padding-inline-start: var(--spacer);
    font-size: var(--font-sm);
  }
}

.token-list {
  display: grid;
  gap: var(--spacer-xs);
}

.token-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacer);
  padding: var(--spacer-sm) 0;
  border-bottom: var(--border);

  code {
    font-size: var(--font-sm);
    white-space: nowrap;
  }

  span {
    font-size: var(--font-sm);
    color: var(--muted);
    text-align: end;
  }
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
  align-items: center;
}

.hint {
  font-size: var(--font-sm);
  color: var(--muted);
  font-style: italic;
}
</style>
