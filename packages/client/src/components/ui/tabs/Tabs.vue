<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  modelValue?: string
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string): void
}>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot
    v-bind="forwarded"
    :class="cn('w-full', props.class)"
  >
    <slot />
  </TabsRoot>
</template>