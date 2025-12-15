<template>
  <main class="library">
    <header class="library-header">
      <h1>Base Layer Component Library</h1>
      <nav class="library-nav">
        <a href="#colors">Colors</a>
        <a href="#typography">Typography</a>
        <a href="#spacing">Spacing</a>
        <a href="#icons">Icons</a>
        <a href="#buttons">Buttons</a>
        <a href="#alerts">Alerts</a>
        <a href="#cards">Cards</a>
        <a href="#tags">Tags</a>
        <a href="#forms">Forms</a>
        <a href="#actions">Actions</a>
        <a href="#dialogs">Dialogs</a>
      </nav>
    </header>

    <!-- Design Tokens -->
    <section id="design-tokens">
      <h2>Design Tokens</h2>

      <!-- Colors -->
      <article id="colors">
        <h3>Colors</h3>

        <div class="token-group">
          <h4>Gray Scale</h4>
          <div class="color-grid">
            <div v-for="shade in grayShades" :key="shade" class="color-swatch">
              <div :style="{ background: `var(--gray-${shade})` }" />
              <code>--gray-{{ shade }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Z-Colors (Theme Aware)</h4>
          <div class="color-grid">
            <div v-for="z in zColors" :key="z" class="color-swatch">
              <div :style="{ background: `var(--gray-z-${z})` }" />
              <code>--gray-z-{{ z }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Semantic Colors</h4>
          <div class="color-grid">
            <div v-for="color in semanticColors" :key="color" class="color-swatch">
              <div :style="{ background: `var(--${color})` }" />
              <code>--{{ color }}</code>
            </div>
          </div>
        </div>
      </article>

      <!-- Typography -->
      <article id="typography">
        <h3>Typography</h3>

        <div class="token-group">
          <h4>Font Sizes</h4>
          <div class="type-samples">
            <div v-for="size in fontSizes" :key="size" class="type-sample">
              <span :style="{ fontSize: `var(--font-${size})` }">The quick brown fox</span>
              <code>--font-{{ size }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>UI Typography</h4>
          <div class="type-sample">
            <span class="ui-text">UI Font Style (Monospace, Uppercase)</span>
            <code>--ui-font-family</code>
          </div>
        </div>
      </article>

      <!-- Spacing -->
      <article id="spacing">
        <h3>Spacing</h3>

        <div class="token-group">
          <h4>Size Scale</h4>
          <div class="spacing-samples">
            <div v-for="n in sizes" :key="n" class="spacing-sample">
              <div class="spacing-box" :style="{ width: `var(--size-${n})`, height: `var(--size-${n})` }" />
              <code>--size-{{ n }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Semantic Spacers</h4>
          <div class="spacing-samples">
            <div v-for="spacer in spacers" :key="spacer" class="spacing-sample">
              <div class="spacing-box"
                :style="{ width: `var(--spacer${spacer === 'default' ? '' : `-${spacer}`})`, height: `var(--spacer${spacer === 'default' ? '' : `-${spacer}`})` }" />
              <code>--spacer{{ spacer === 'default' ? '' : `-${spacer}` }}</code>
            </div>
          </div>
        </div>
      </article>
    </section>

    <!-- Components -->
    <section id="components">
      <h2>Components</h2>

      <!-- Icon -->
      <article id="icons">
        <h3>Icon</h3>
        <div class="icon-grid">
          <div v-for="type in iconTypes" :key="type" class="icon-sample">
            <Icon :type="type" />
            <code>{{ type }}</code>
          </div>
        </div>
      </article>

      <!-- Button -->
      <article id="buttons">
        <h3>Button</h3>

        <div class="component-demo">
          <h4>Default</h4>
          <div class="demo-row">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        <div class="component-demo">
          <h4>Variants</h4>
          <div class="demo-row">
            <Button class="primary">Primary</Button>
            <Button class="small">Small</Button>
            <Button class="link">Link</Button>
            <Button class="inline">Inline</Button>
            <Button class="danger">Danger</Button>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Icons</h4>
          <div class="demo-row">
            <Button>
              <Icon type="add" />
              <span>Add Item</span>
            </Button>
            <Button class="primary">
              <Icon type="check" />
              <span>Confirm</span>
            </Button>
            <Button>
              <Icon type="edit" />
            </Button>
            <Button class="small">
              <Icon type="edit" />
            </Button>
            <Button class="link">
              <Icon type="link" />
              <span>Link</span>
            </Button>
          </div>
        </div>
      </article>

      <!-- Alert -->
      <article id="alerts">
        <h3>Alert</h3>

        <div class="component-demo">
          <h4>Info (Default)</h4>
          <Alert type="info">
            <h1>Information</h1>
            <p>This is an informational alert message.</p>
          </Alert>
        </div>

        <div class="component-demo">
          <h4>Error</h4>
          <Alert type="error">
            <h1>Error</h1>
            <p>Something went wrong. Please try again.</p>
          </Alert>
        </div>
      </article>

      <!-- Card -->
      <article id="cards">
        <h3>Card</h3>

        <div class="component-demo">
          <div class="card-grid">
            <Card>
              <h4>Default Card</h4>
              <p>Card content goes here.</p>
            </Card>

            <Card class="borderless">
              <h4>Borderless</h4>
              <p>Card without border.</p>
            </Card>

            <Card class="highlight">
              <h4>Highlight</h4>
              <p>Card with highlight background.</p>
            </Card>
          </div>
        </div>
      </article>

      <!-- Tags -->
      <article id="tags">
        <h3>Tag / Tags</h3>

        <div class="component-demo">
          <h4>Basic Tags</h4>
          <Tags>
            <Tag>Tag 1</Tag>
            <Tag>Tag 2</Tag>
            <Tag>Tag 3</Tag>
          </Tags>
        </div>

        <div class="component-demo">
          <h4>Dismissable Tags</h4>
          <Tags>
            <Tag v-for="tag in dismissableTags" :key="tag" dismissable @dismiss="dismissableTags = dismissableTags.filter(t => t !== tag)">
              {{ tag }}
            </Tag>
          </Tags>
          <Button v-if="dismissableTags.length === 0" class="small" @click="dismissableTags = ['Dismissable 1', 'Dismissable 2', 'Dismissable 3']">
            Reset Tags
          </Button>
        </div>
      </article>

      <!-- Forms -->
      <article id="forms">
        <h3>Form Components</h3>

        <div class="component-demo">
          <h4>Form with FormGroup and FormLabel</h4>
          <Form>
            <FormGroup>
              <FormLabel label="Email">
                <input type="email" placeholder="Enter your email" autocomplete="email" />
              </FormLabel>
            </FormGroup>

            <FormGroup>
              <FormLabel label="Password">
                <input type="password" placeholder="Enter your password" autocomplete="current-password" />
              </FormLabel>
            </FormGroup>

            <FormGroup radio>
              <span>Options:</span>
              <label><input type="radio" name="option" /> Option A</label>
              <label><input type="radio" name="option" /> Option B</label>
            </FormGroup>
          </Form>
        </div>

        <div class="component-demo">
          <h4>FormItem with Prefix/Suffix</h4>
          <FormItem>
            <template #prefix>$</template>
            <input type="text" placeholder="Amount" />
          </FormItem>

          <FormItem>
            <input type="text" placeholder="Search" />
            <template #suffix>
              <Icon type="loader" />
            </template>
          </FormItem>
        </div>

        <div class="component-demo">
          <h4>FormInputGroup</h4>
          <FormInputGroup>
            <input type="text" placeholder="Enter value" />
            <Button class="primary">Submit</Button>
          </FormInputGroup>
        </div>

        <div class="component-demo">
          <h4>Select</h4>
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>

          <select class="small">
            <option>Small Select</option>
            <option>Option 2</option>
          </select>
        </div>

        <div class="component-demo">
          <h4>Checkbox</h4>
          <label>
            <input type="checkbox" />
            Accept terms and conditions
          </label>
        </div>
      </article>

      <!-- Actions -->
      <article id="actions">
        <h3>Actions</h3>

        <div class="component-demo">
          <h4>Default (Right-aligned)</h4>
          <Actions>
            <Button>Cancel</Button>
            <Button class="primary">Submit</Button>
          </Actions>
        </div>

        <div class="component-demo">
          <h4>Left-aligned</h4>
          <Actions class="left">
            <Button>Action 1</Button>
            <Button>Action 2</Button>
          </Actions>
        </div>
      </article>

      <!-- Dialog/Modal -->
      <article id="dialogs">
        <h3>Dialog / Modal</h3>

        <div class="component-demo">
          <h4>Dialog</h4>
          <Button @click="showDialog = true">Open Dialog</Button>

          <Dialog v-model:open="showDialog" title="Dialog Title">
            <p>Dialog with title and close button.</p>
            <Actions>
              <Button @click="showDialog = false">Cancel</Button>
              <Button class="primary" @click="showDialog = false">Confirm</Button>
            </Actions>
          </Dialog>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
const grayShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const zColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const semanticColors = ['primary', 'muted', 'error', 'success']
const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const sizes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const spacers = ['xs', 'sm', 'default', 'md', 'lg', 'xl']
const iconTypes = [
  'add', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
  'chevron-up', 'close', 'code', 'discord', 'edit', 'email',
  'folder', 'github', 'home', 'image', 'link', 'loader',
  'maximize', 'times', 'trash', 'twitter', 'user', 'website', 'withdraw'
]

const showDialog = ref(false)

// Dismissable tags demo
const dismissableTags = ref(['Dismissable 1', 'Dismissable 2', 'Dismissable 3'])
</script>

<style scoped>
.library {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--spacer-lg);
  display: grid;
  gap: var(--spacer-xl);
}

.library-header {
  border-bottom: var(--border);
  padding-bottom: var(--spacer-lg);
}

.library-header h1 {
  font-size: var(--font-2xl);
  margin-bottom: var(--spacer);
}

.library-nav {
  display: flex;
  gap: var(--spacer);
  flex-wrap: wrap;
}

.library-nav a {
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  text-transform: var(--ui-text-transform);
  color: var(--muted);
  text-decoration: none;

  &:hover {
    color: var(--color);
  }
}

section {
  display: grid;
  gap: var(--spacer-lg);
}

section>h2 {
  font-size: var(--font-xl);
  border-bottom: var(--border);
  padding-bottom: var(--spacer-sm);
}

article {
  display: grid;
  gap: var(--spacer);
}

article>h3 {
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  text-transform: var(--ui-text-transform);
  color: var(--muted);
}

.token-group {
  display: grid;
  gap: var(--spacer-sm);
}

.token-group h4 {
  font-size: var(--font-sm);
  color: var(--muted);
}

/* Color swatches */
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
}

.color-swatch {
  display: grid;
  gap: var(--spacer-xs);
  text-align: center;
}

.color-swatch>div {
  width: var(--size-8);
  height: var(--size-8);
  border: var(--border);
}

.color-swatch code {
  font-size: var(--font-xs);
}

/* Typography samples */
.type-samples {
  display: grid;
  gap: var(--spacer-sm);
}

.type-sample {
  display: flex;
  align-items: baseline;
  gap: var(--spacer);
  padding: var(--spacer-xs) 0;
  border-bottom: var(--border);
}

.type-sample code {
  font-size: var(--font-xs);
  color: var(--muted);
  margin-left: auto;
}

.ui-text {
  font-family: var(--ui-font-family);
  font-size: var(--ui-font-size);
  text-transform: var(--ui-text-transform);
}

/* Spacing samples */
.spacing-samples {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer);
  align-items: flex-end;
}

.spacing-sample {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-xs);
}

.spacing-box {
  background: var(--primary);
  min-width: var(--size-1);
  min-height: var(--size-1);
}

.spacing-sample code {
  font-size: var(--font-xs);
  color: var(--muted);
}

/* Icon grid */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--spacer);
}

.icon-sample {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-xs);
  padding: var(--spacer-sm);
  border: var(--border);
}

.icon-sample .icon {
  font-size: var(--font-xl);
}

.icon-sample code {
  font-size: var(--font-xs);
  color: var(--muted);
}

/* Component demos */
.component-demo {
  display: grid;
  gap: var(--spacer-sm);
  padding: var(--spacer);
  background: var(--gray-z-0);
  border: var(--border);
}

.component-demo h4 {
  font-size: var(--font-sm);
  color: var(--muted);
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacer-sm);
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--spacer);
}

.card-grid h4 {
  font-size: var(--font-base);
  color: var(--color);
}
</style>
