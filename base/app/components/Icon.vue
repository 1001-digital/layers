<script setup lang="ts">
const props = defineProps<{ type: string }>()
const appConfig = useAppConfig()

const DEFAULT_ICON_MAP: Record<string, string> = {
  add: 'lucide:plus',
  check: 'lucide:check',
  'chevron-down': 'lucide:chevron-down',
  'chevron-left': 'lucide:chevron-left',
  'chevron-right': 'lucide:chevron-right',
  'chevron-up': 'lucide:chevron-up',
  close: 'lucide:x',
  copy: 'lucide:copy',
  code: 'lucide:code',
  discord: 'simple-icons:discord',
  edit: 'lucide:pencil',
  email: 'lucide:mail',
  folder: 'lucide:folder',
  github: 'simple-icons:github',
  home: 'lucide:home',
  help: 'lucide:circle-question-mark',
  image: 'lucide:image',
  link: 'lucide:link',
  loader: 'lucide:loader-2',
  maximize: 'lucide:maximize',
  times: 'lucide:x',
  trash: 'lucide:trash-2',
  twitter: 'simple-icons:x',
  user: 'lucide:user',
  website: 'lucide:globe',
  withdraw: 'lucide:undo',
}

const iconMap = computed<Record<string, string>>(() => ({
  ...DEFAULT_ICON_MAP,
  ...((appConfig.base?.icons?.map as Record<string, string> | undefined) || {})
}))

const iconName = computed(() => iconMap.value[props.type] || props.type)
</script>

<template>
  <NuxtIcon v-if="iconName" :name="iconName" class="icon" />
</template>

<style scoped>
.icon {
  display: inline-flex;
  width: 1em;
  height: 1em;
  align-items: center;
  justify-content: center;
}
</style>
