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
        <a href="#popovers">Popovers</a>
        <a href="#dropdowns">Dropdowns</a>
        <a href="#tooltips">Tooltips</a>
        <a href="#toasts">Toasts</a>
      </nav>
    </header>

    <!-- Design Tokens -->
    <section id="design-tokens">
      <h2>Design Tokens</h2>

      <!-- Colors -->
      <Card id="colors">
        <h3>Colors</h3>

        <div class="token-group">
          <h4>Gray Scale</h4>
          <div class="color-grid">
            <div
              v-for="shade in grayShades"
              :key="shade"
              class="color-swatch"
            >
              <div :style="{ background: `var(--gray-${shade})` }" />
              <code>--gray-{{ shade }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Z-Colors (Theme Aware)</h4>
          <div class="color-grid">
            <div
              v-for="z in zColors"
              :key="z"
              class="color-swatch"
            >
              <div :style="{ background: `var(--gray-z-${z})` }" />
              <code>--gray-z-{{ z }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Semantic Colors</h4>
          <div class="color-grid">
            <div
              v-for="color in semanticColors"
              :key="color"
              class="color-swatch"
            >
              <div :style="{ background: `var(--${color})` }" />
              <code>--{{ color }}</code>
            </div>
          </div>
        </div>
      </Card>

      <!-- Typography -->
      <Card id="typography">
        <h3>Typography</h3>

        <div class="token-group">
          <h4>Font Sizes</h4>
          <div class="type-samples">
            <div
              v-for="size in fontSizes"
              :key="size"
              class="type-sample"
            >
              <span :style="{ fontSize: `var(--font-${size})` }"
                >The quick brown fox</span
              >
              <code>--font-{{ size }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>UI Typography</h4>
          <div class="type-sample">
            <span class="ui-text">UI Font Style (Monospace, Uppercase)</span>
            <code>--font-family</code>
          </div>
        </div>
      </Card>

      <!-- Spacing -->
      <Card id="spacing">
        <h3>Spacing</h3>

        <div class="token-group">
          <h4>Size Scale</h4>
          <div class="spacing-samples">
            <div
              v-for="n in sizes"
              :key="n"
              class="spacing-sample"
            >
              <div
                class="spacing-box"
                :style="{
                  width: `var(--size-${n})`,
                  height: `var(--size-${n})`,
                }"
              />
              <code>--size-{{ n }}</code>
            </div>
          </div>
        </div>

        <div class="token-group">
          <h4>Semantic Spacers</h4>
          <div class="spacing-samples">
            <div
              v-for="spacer in spacers"
              :key="spacer"
              class="spacing-sample"
            >
              <div
                class="spacing-box"
                :style="{
                  width: `var(--spacer${spacer === 'default' ? '' : `-${spacer}`})`,
                  height: `var(--spacer${spacer === 'default' ? '' : `-${spacer}`})`,
                }"
              />
              <code
                >--spacer{{ spacer === 'default' ? '' : `-${spacer}` }}</code
              >
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Components -->
    <section id="components">
      <h2>Components</h2>

      <!-- Icon -->
      <Card id="icons">
        <h3>Icon</h3>
        <div class="icon-grid">
          <div
            v-for="type in iconTypes"
            :key="type"
            class="icon-sample"
          >
            <Icon :type="type" />
            <code>{{ type }}</code>
          </div>
        </div>
      </Card>

      <!-- Button -->
      <Card id="buttons">
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
            <Button class="tertiary">Tertiary</Button>
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
            <Button class="tertiary">
              <Icon type="add" />
              <span>New</span>
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
      </Card>

      <!-- Alert -->
      <Card id="alerts">
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
      </Card>

      <!-- Card -->
      <Card id="cards">
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
      </Card>

      <!-- Tags -->
      <Card id="tags">
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
            <Tag
              v-for="tag in dismissableTags"
              :key="tag"
              dismissable
              @dismiss="
                dismissableTags = dismissableTags.filter((t) => t !== tag)
              "
            >
              {{ tag }}
            </Tag>
          </Tags>
          <Button
            v-if="dismissableTags.length === 0"
            class="small"
            @click="
              dismissableTags = [
                'Dismissable 1',
                'Dismissable 2',
                'Dismissable 3',
              ]
            "
          >
            Reset Tags
          </Button>
        </div>
      </Card>

      <!-- Forms -->
      <Card id="forms">
        <h3>Form Components</h3>

        <div class="component-demo">
          <h4>Form with FormGroup and FormLabel</h4>
          <Form>
            <FormGroup>
              <FormLabel label="Email">
                <input
                  type="email"
                  placeholder="Enter your email"
                  autocomplete="email"
                />
              </FormLabel>
            </FormGroup>

            <FormGroup>
              <FormLabel label="Password">
                <input
                  type="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
              </FormLabel>
            </FormGroup>

            <FormGroup>
              <FormLabel label="Options">
                <FormRadioGroup
                  v-model="selectedOption"
                  :options="radioOptions"
                  name="option"
                />
              </FormLabel>
            </FormGroup>
          </Form>
        </div>

        <div class="component-demo">
          <h4>FormItem with Prefix/Suffix</h4>
          <FormItem>
            <template #prefix>$</template>
            <input
              type="text"
              placeholder="Amount"
            />
          </FormItem>

          <FormItem>
            <input
              type="text"
              placeholder="Search"
            />
            <template #suffix>
              <Icon type="loader" />
            </template>
          </FormItem>
        </div>

        <div class="component-demo">
          <h4>FormInputGroup</h4>
          <FormInputGroup>
            <input
              type="text"
              placeholder="Enter value"
            />
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
          <h4>FormSelect (Reka UI)</h4>
          <FormLabel label="Single Select">
            <FormItem>
              <FormSelect
                v-model="selectedFruit"
                :options="fruitOptions"
                placeholder="Select a fruit..."
              />
            </FormItem>
          </FormLabel>
          <p>Selected: {{ selectedFruit || 'None' }}</p>

          <FormLabel label="Multi Select">
            <FormItem>
              <FormSelect
                v-model="selectedFruits"
                :options="fruitOptions"
                multiple
                placeholder="Select fruits..."
              />
            </FormItem>
          </FormLabel>
          <p>
            Selected:
            {{ selectedFruits?.length ? selectedFruits.join(', ') : 'None' }}
          </p>

          <FormLabel label="With Prefix Icon">
            <FormItem>
              <template #prefix>
                <Icon type="home" />
              </template>
              <FormSelect
                v-model="selectedFruit"
                :options="fruitOptions"
                placeholder="Select..."
              />
            </FormItem>
          </FormLabel>
        </div>

        <div class="component-demo">
          <h4>Checkbox</h4>
          <FormCheckbox v-model="acceptTerms">
            Accept terms and conditions
          </FormCheckbox>
          <p>Accepted: {{ acceptTerms }}</p>
        </div>

        <div class="component-demo">
          <h4>Textarea (Auto-expanding)</h4>
          <FormLabel label="Message">
            <FormTextarea
              v-model="textareaValue"
              placeholder="Type something... add new lines to see it grow"
            />
          </FormLabel>
        </div>
      </Card>

      <!-- Actions -->
      <Card id="actions">
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
      </Card>

      <!-- Dialog/Modal -->
      <Card id="dialogs">
        <h3>Dialog / Modal</h3>

        <div class="component-demo">
          <div class="demo-row">
            <Button @click="showDialog = true">Default</Button>
            <Button @click="showScrollDialog = true">Scrolling</Button>
            <Button @click="showNoFooterDialog = true">No Footer</Button>
            <Button @click="showCompatDialog = true">Compat</Button>
            <Button @click="showNoCloseDialog = true">No Close Button</Button>
            <Button @click="showPersistentDialog = true">Persistent</Button>
          </div>

          <Dialog
            v-model:open="showDialog"
            title="Dialog Title"
          >
            <p>Dialog with title and close button.</p>
            <template #footer>
              <Button @click="showDialog = false">Cancel</Button>
              <Button
                class="primary"
                @click="showDialog = false"
                >Confirm</Button
              >
            </template>
          </Dialog>

          <Dialog
            v-model:open="showScrollDialog"
            title="Terms & Conditions"
          >
            <p
              v-for="i in 20"
              :key="i"
            >
              {{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </p>
            <template #footer>
              <Button @click="showScrollDialog = false">Decline</Button>
              <Button
                class="primary"
                @click="showScrollDialog = false"
                >Accept</Button
              >
            </template>
          </Dialog>

          <Dialog
            v-model:open="showNoFooterDialog"
            title="Notification"
          >
            <p>
              This dialog has no footer actions. Close it with the X button.
            </p>
          </Dialog>

          <Dialog
            v-model:open="showCompatDialog"
            title="Compat Dialog"
            compat
          >
            <p>
              This dialog uses compat mode, rendering as an article element with
              an overlay instead of the native dialog element.
            </p>
            <template #footer>
              <Button @click="showCompatDialog = false">Close</Button>
            </template>
          </Dialog>

          <Dialog
            v-model:open="showNoCloseDialog"
            title="Required Action"
            :closable="false"
            :click-outside="false"
          >
            <p>
              This dialog has no X button and cannot be dismissed by clicking
              outside. You must use the action below.
            </p>
            <template #footer>
              <Button
                class="primary"
                @click="showNoCloseDialog = false"
                >Acknowledge</Button
              >
            </template>
          </Dialog>

          <Dialog
            v-model:open="showPersistentDialog"
            title="Persistent Dialog"
            :click-outside="false"
          >
            <p>
              Clicking outside this dialog will not close it. You must use the X
              button or the action below.
            </p>
            <template #footer>
              <Button
                class="primary"
                @click="showPersistentDialog = false"
                >Got it</Button
              >
            </template>
          </Dialog>
        </div>
      </Card>

      <!-- Popovers -->
      <Card id="popovers">
        <h3>Popover</h3>

        <div class="component-demo">
          <h4>Default</h4>
          <div class="demo-row">
            <Popover v-model:open="showPopover">
              <template #trigger>
                <Button>Open Popover</Button>
              </template>
              <p>This is a basic popover.</p>
            </Popover>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Title</h4>
          <div class="demo-row">
            <Popover
              v-model:open="showPopoverTitle"
              title="Popover Title"
              closable
            >
              <template #trigger>
                <Button>With Title</Button>
              </template>
              <p>This popover has a title and close button.</p>
            </Popover>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Close Button</h4>
          <div class="demo-row">
            <Popover
              v-model:open="showPopoverClosable"
              closable
            >
              <template #trigger>
                <Button>Closable</Button>
              </template>
              <p>This popover has a close button.</p>
            </Popover>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Arrow</h4>
          <div class="demo-row">
            <Popover
              v-model:open="showPopoverArrow"
              arrow
            >
              <template #trigger>
                <Button>With Arrow</Button>
              </template>
              <p>This popover has an arrow pointing to its trigger.</p>
            </Popover>
          </div>
        </div>

        <div class="component-demo">
          <h4>Long Content (Scrolling)</h4>
          <div class="demo-row">
            <Popover
              v-model:open="showPopoverScroll"
              title="Terms & Conditions"
              closable
              arrow
            >
              <template #trigger>
                <Button>Scrolling</Button>
              </template>
              <p
                v-for="i in 20"
                :key="i"
              >
                {{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>
            </Popover>
          </div>
        </div>

        <div class="component-demo">
          <h4>Positioning</h4>
          <div class="demo-row">
            <Popover
              v-model:open="showPopoverTop"
              side="top"
            >
              <template #trigger>
                <Button>Top</Button>
              </template>
              <p>Opens above the trigger.</p>
            </Popover>

            <Popover
              v-model:open="showPopoverRight"
              side="right"
            >
              <template #trigger>
                <Button>Right</Button>
              </template>
              <p>Opens to the right.</p>
            </Popover>

            <Popover
              v-model:open="showPopoverLeft"
              side="left"
            >
              <template #trigger>
                <Button>Left</Button>
              </template>
              <p>Opens to the left.</p>
            </Popover>

            <Popover
              v-model:open="showPopoverBottom"
              side="bottom"
              align="start"
              arrow
            >
              <template #trigger>
                <Button>Bottom Start</Button>
              </template>
              <p>Opens below, aligned to start.</p>
            </Popover>
          </div>
        </div>
      </Card>

      <!-- Dropdowns -->
      <Card id="dropdowns">
        <h3>Dropdown</h3>

        <div class="component-demo">
          <h4>Basic</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdown">
              <template #trigger>
                <Button>
                  <span>Actions</span>
                  <Icon type="chevron-down" />
                </Button>
              </template>
              <DropdownItem>Cut</DropdownItem>
              <DropdownItem>Copy</DropdownItem>
              <DropdownItem>Paste</DropdownItem>
              <DropdownSeparator />
              <DropdownItem disabled>Delete</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div class="component-demo">
          <h4>Icon Button Trigger</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdownIcon">
              <template #trigger>
                <Button>
                  <Icon type="lucide:ellipsis-vertical" />
                </Button>
              </template>
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem>Duplicate</DropdownItem>
              <DropdownSeparator />
              <DropdownItem>Delete</DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Groups &amp; Labels</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdownGroups">
              <template #trigger>
                <Button>
                  <span>Edit</span>
                  <Icon type="chevron-down" />
                </Button>
              </template>
              <DropdownGroup>
                <DropdownLabel>Text</DropdownLabel>
                <DropdownItem>Cut</DropdownItem>
                <DropdownItem>Copy</DropdownItem>
                <DropdownItem>Paste</DropdownItem>
              </DropdownGroup>
              <DropdownSeparator />
              <DropdownGroup>
                <DropdownLabel>View</DropdownLabel>
                <DropdownItem>Zoom In</DropdownItem>
                <DropdownItem>Zoom Out</DropdownItem>
              </DropdownGroup>
            </Dropdown>
          </div>
        </div>

        <div class="component-demo">
          <h4>Checkbox Items</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdownCheckbox">
              <template #trigger>
                <Button>
                  <span>Format</span>
                  <Icon type="chevron-down" />
                </Button>
              </template>
              <DropdownCheckboxItem v-model="dropdownBold"
                >Bold</DropdownCheckboxItem
              >
              <DropdownCheckboxItem v-model="dropdownItalic"
                >Italic</DropdownCheckboxItem
              >
              <DropdownCheckboxItem v-model="dropdownUnderline"
                >Underline</DropdownCheckboxItem
              >
            </Dropdown>
            <code
              >Bold: {{ dropdownBold }}, Italic: {{ dropdownItalic }},
              Underline: {{ dropdownUnderline }}</code
            >
          </div>
        </div>

        <div class="component-demo">
          <h4>Radio Items</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdownRadio">
              <template #trigger>
                <Button>
                  <span>Size: {{ dropdownSize }}</span>
                  <Icon type="chevron-down" />
                </Button>
              </template>
              <DropdownRadioGroup v-model="dropdownSize">
                <DropdownLabel>Font Size</DropdownLabel>
                <DropdownRadioItem value="Small">Small</DropdownRadioItem>
                <DropdownRadioItem value="Medium">Medium</DropdownRadioItem>
                <DropdownRadioItem value="Large">Large</DropdownRadioItem>
              </DropdownRadioGroup>
            </Dropdown>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Submenu</h4>
          <div class="demo-row">
            <Dropdown v-model:open="showDropdownSub">
              <template #trigger>
                <Button>
                  <span>Options</span>
                  <Icon type="chevron-down" />
                </Button>
              </template>
              <DropdownItem>New File</DropdownItem>
              <DropdownItem>Open</DropdownItem>
              <DropdownSeparator />
              <DropdownSub>
                <template #trigger>Share</template>
                <DropdownItem>Email</DropdownItem>
                <DropdownItem>Link</DropdownItem>
                <DropdownItem>Slack</DropdownItem>
              </DropdownSub>
              <DropdownSub>
                <template #trigger>Export</template>
                <DropdownItem>PDF</DropdownItem>
                <DropdownItem>CSV</DropdownItem>
                <DropdownItem>JSON</DropdownItem>
              </DropdownSub>
            </Dropdown>
          </div>
        </div>

        <div class="component-demo">
          <h4>Positioning</h4>
          <div class="demo-row">
            <Dropdown
              v-model:open="showDropdownTop"
              side="top"
            >
              <template #trigger>
                <Button>Top</Button>
              </template>
              <DropdownItem>Item 1</DropdownItem>
              <DropdownItem>Item 2</DropdownItem>
            </Dropdown>

            <Dropdown
              v-model:open="showDropdownRight"
              side="right"
            >
              <template #trigger>
                <Button>Right</Button>
              </template>
              <DropdownItem>Item 1</DropdownItem>
              <DropdownItem>Item 2</DropdownItem>
            </Dropdown>

            <Dropdown
              v-model:open="showDropdownEnd"
              side="bottom"
              align="end"
              arrow
            >
              <template #trigger>
                <Button>Bottom End + Arrow</Button>
              </template>
              <DropdownItem>Item 1</DropdownItem>
              <DropdownItem>Item 2</DropdownItem>
            </Dropdown>
          </div>
        </div>
      </Card>

      <!-- Tooltips -->
      <Card id="tooltips">
        <h3>Tooltip</h3>

        <div class="component-demo">
          <h4>Default (Top)</h4>
          <div class="demo-row">
            <Tooltip>
              <template #trigger>
                <Button>Hover me</Button>
              </template>
              Default tooltip on top
            </Tooltip>
          </div>
        </div>

        <div class="component-demo">
          <h4>Positioning</h4>
          <div class="demo-row">
            <Tooltip side="top">
              <template #trigger>
                <Button>Top</Button>
              </template>
              Tooltip on top
            </Tooltip>

            <Tooltip side="right">
              <template #trigger>
                <Button>Right</Button>
              </template>
              Tooltip on right
            </Tooltip>

            <Tooltip side="bottom">
              <template #trigger>
                <Button>Bottom</Button>
              </template>
              Tooltip on bottom
            </Tooltip>

            <Tooltip side="left">
              <template #trigger>
                <Button>Left</Button>
              </template>
              Tooltip on left
            </Tooltip>
          </div>
        </div>

        <div class="component-demo">
          <h4>Without Arrow</h4>
          <div class="demo-row">
            <Tooltip :arrow="false">
              <template #trigger>
                <Button>No Arrow</Button>
              </template>
              Tooltip without arrow
            </Tooltip>
          </div>
        </div>

        <div class="component-demo">
          <h4>On Icon Button</h4>
          <div class="demo-row">
            <Tooltip>
              <template #trigger>
                <Button>
                  <Icon type="lucide:plus" />
                </Button>
              </template>
              Add item
            </Tooltip>

            <Tooltip>
              <template #trigger>
                <Button>
                  <Icon type="edit" />
                </Button>
              </template>
              Edit
            </Tooltip>

            <Tooltip>
              <template #trigger>
                <Button>
                  <Icon type="close" />
                </Button>
              </template>
              Delete
            </Tooltip>
          </div>
        </div>

        <div class="component-demo">
          <h4>Instant (No Delay)</h4>
          <div class="demo-row">
            <Tooltip :delay-duration="0">
              <template #trigger>
                <Button>Instant</Button>
              </template>
              Shows immediately
            </Tooltip>
          </div>
        </div>
      </Card>

      <!-- Toasts -->
      <Card id="toasts">
        <h3>Toast</h3>

        <div class="component-demo">
          <h4>Variants</h4>
          <div class="demo-row">
            <Button
              @click="
                toast.add({
                  variant: 'info',
                  title: 'Info',
                  description: 'This is an informational toast.',
                })
              "
            >
              Info
            </Button>
            <Button
              @click="
                toast.add({
                  variant: 'success',
                  title: 'Success',
                  description: 'Operation completed successfully.',
                })
              "
            >
              Success
            </Button>
            <Button
              @click="
                toast.add({
                  variant: 'error',
                  title: 'Error',
                  description: 'Something went wrong.',
                })
              "
            >
              Error
            </Button>
          </div>
        </div>

        <div class="component-demo">
          <h4>With Action</h4>
          <div class="demo-row">
            <Button
              @click="
                toast.add({
                  variant: 'info',
                  title: 'Item deleted',
                  description: 'The item has been removed.',
                  action: {
                    label: 'Undo',
                    onClick: () =>
                      toast.add({
                        variant: 'success',
                        title: 'Restored',
                        description: 'The item has been restored.',
                      }),
                  },
                })
              "
            >
              Delete with Undo
            </Button>
          </div>
        </div>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
const toast = useToast()
const grayShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const zColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const semanticColors = ['primary', 'muted', 'error', 'success']
const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const sizes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const spacers = ['xs', 'sm', 'default', 'md', 'lg', 'xl']
const iconTypes = [
  'lucide:plus',
  'check',
  'chevron-down',
  'lucide:chevron-left',
  'lucide:chevron-right',
  'close',
]

// Popover demo data
const showPopover = ref(false)
const showPopoverTitle = ref(false)
const showPopoverClosable = ref(false)
const showPopoverArrow = ref(false)
const showPopoverTop = ref(false)
const showPopoverRight = ref(false)
const showPopoverLeft = ref(false)
const showPopoverBottom = ref(false)
const showPopoverScroll = ref(false)

// Dropdown demo data
const showDropdown = ref(false)
const showDropdownIcon = ref(false)
const showDropdownGroups = ref(false)
const showDropdownCheckbox = ref(false)
const dropdownBold = ref(true)
const dropdownItalic = ref(false)
const dropdownUnderline = ref(false)
const showDropdownRadio = ref(false)
const dropdownSize = ref('Medium')
const showDropdownSub = ref(false)
const showDropdownTop = ref(false)
const showDropdownRight = ref(false)
const showDropdownEnd = ref(false)

const showDialog = ref(false)
const showScrollDialog = ref(false)
const showNoFooterDialog = ref(false)
const showCompatDialog = ref(false)
const showNoCloseDialog = ref(false)
const showPersistentDialog = ref(false)

// Dismissable tags demo
const dismissableTags = ref(['Dismissable 1', 'Dismissable 2', 'Dismissable 3'])

// FormCheckbox demo data
const acceptTerms = ref(false)

// FormTextarea demo data
const textareaValue = ref('')

// FormRadioGroup demo data
const selectedOption = ref('a')
const radioOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

// FormSelect demo data
const selectedFruit = ref<string>()
const selectedFruits = ref<string[]>([])
const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
]
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
  font-family: var(--font-family);
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

:deep(.card) > h3 {
  font-family: var(--font-family);
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

.color-swatch > div {
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
  font-family: var(--font-family);
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
