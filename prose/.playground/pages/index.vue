<template>
  <main class="library">
    <header class="library-header">
      <h1>Prose Layer Component Library</h1>
      <nav class="library-nav">
        <a href="#prose">Prose</a>
        <a href="#headings">Headings</a>
        <a href="#text">Text</a>
        <a href="#lists">Lists</a>
        <a href="#quotes">Quotes</a>
        <a href="#code">Code</a>
        <a href="#tables">Tables</a>
        <a href="#images">Images</a>
      </nav>
    </header>

    <section id="components">
      <h2>Components</h2>

      <!-- Prose Component -->
      <article id="prose">
        <h3>Prose</h3>

        <div class="component-demo">
          <h4>Default</h4>
          <Prose>
            <h1>This is a prose container</h1>
            <p>The Prose component wraps content and applies consistent typography styles for long-form text content like articles, blog posts, and documentation.</p>
            <p>It handles spacing, headings, links, lists, and other elements automatically.</p>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Centered</h4>
          <Prose centered>
            <h2>Centered Content</h2>
            <p>Use the <code>centered</code> prop to center-align text content.</p>
          </Prose>
        </div>
      </article>

      <!-- Headings -->
      <article id="headings">
        <h3>Headings</h3>

        <div class="component-demo">
          <Prose>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>With Links</h4>
          <Prose>
            <h2><a href="#">Linked Heading</a></h2>
            <p>Headings can contain links that inherit the heading style.</p>
          </Prose>
        </div>
      </article>

      <!-- Text Content -->
      <article id="text">
        <h3>Text Content</h3>

        <div class="component-demo">
          <h4>Paragraphs</h4>
          <Prose>
            <p>This is a paragraph with regular text. It demonstrates the default styling applied to prose content including line height and spacing.</p>
            <p>Multiple paragraphs are spaced evenly. Links in paragraphs are <a href="#">styled with underlines</a> to make them visible.</p>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Lead Text</h4>
          <Prose>
            <p class="lead">This is lead text, styled slightly larger for introductory content.</p>
            <p>Regular paragraph text follows after the lead.</p>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Horizontal Rule</h4>
          <Prose>
            <p>Content above the rule.</p>
            <hr>
            <p>Content below the rule.</p>
          </Prose>
        </div>
      </article>

      <!-- Lists -->
      <article id="lists">
        <h3>Lists</h3>

        <div class="component-demo">
          <h4>Unordered List</h4>
          <Prose>
            <ul>
              <li>First item</li>
              <li>Second item</li>
              <li>Third item with a longer description that wraps to multiple lines</li>
              <li>
                Nested list
                <ul>
                  <li>Nested item one</li>
                  <li>Nested item two</li>
                </ul>
              </li>
            </ul>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Ordered List</h4>
          <Prose>
            <ol>
              <li>First step</li>
              <li>Second step</li>
              <li>Third step</li>
              <li>
                Nested steps
                <ol>
                  <li>Sub-step one</li>
                  <li>Sub-step two</li>
                </ol>
              </li>
            </ol>
          </Prose>
        </div>
      </article>

      <!-- Blockquotes -->
      <article id="quotes">
        <h3>Blockquotes</h3>

        <div class="component-demo">
          <h4>Basic Quote</h4>
          <Prose>
            <blockquote>
              <p>This is a blockquote. It's styled with a left border and italic text to distinguish it from regular content.</p>
            </blockquote>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>With Citation</h4>
          <Prose>
            <blockquote>
              <p>Design is not just what it looks like and feels like. Design is how it works.</p>
              <cite>Steve Jobs</cite>
            </blockquote>
          </Prose>
        </div>
      </article>

      <!-- Code -->
      <article id="code">
        <h3>Code</h3>

        <div class="component-demo">
          <h4>Inline Code</h4>
          <Prose>
            <p>Use the <code>Prose</code> component to wrap your content. Set <code>centered</code> for centered text.</p>
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Code Block</h4>
          <Prose>
            <pre><code>&lt;Prose&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;
  &lt;p&gt;Your content here.&lt;/p&gt;
&lt;/Prose&gt;</code></pre>
          </Prose>
        </div>
      </article>

      <!-- Tables -->
      <article id="tables">
        <h3>Tables</h3>

        <div class="component-demo">
          <Prose>
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>centered</td>
                  <td>boolean</td>
                  <td>false</td>
                </tr>
              </tbody>
            </table>
          </Prose>
        </div>
      </article>

      <!-- Images -->
      <article id="images">
        <h3>Images</h3>

        <div class="component-demo">
          <h4>Basic Image</h4>
          <Prose>
            <p>Images in prose get consistent styling with borders and rounded corners.</p>
            <img src="https://picsum.photos/600/300" alt="Sample image">
          </Prose>
        </div>

        <div class="component-demo">
          <h4>Figure with Caption</h4>
          <Prose>
            <figure>
              <img src="https://picsum.photos/600/300?random=2" alt="Sample figure">
              <figcaption>Figure caption styled in muted text below the image.</figcaption>
            </figure>
          </Prose>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
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

section > h2 {
  font-size: var(--font-xl);
  border-bottom: var(--border);
  padding-bottom: var(--spacer-sm);
}

article {
  display: grid;
  gap: var(--spacer);
}

article > h3 {
  font-family: var(--ui-font-family);
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
}

.component-demo h4 {
  font-size: var(--font-sm);
  color: var(--muted);
}
</style>
