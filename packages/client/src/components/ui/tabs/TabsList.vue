<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsList, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  loop?: boolean
  class?: HTMLAttributes['class']
}>()

const forwarded = useForwardProps(props)
</script>

<template>
  <TabsList
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>