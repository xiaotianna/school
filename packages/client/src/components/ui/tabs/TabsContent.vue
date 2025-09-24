<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsContent, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<{
  value: string
  forceMount?: boolean
  class?: HTMLAttributes['class']
}>()

const forwarded = useForwardProps(props)
</script>

<template>
  <TabsContent
    v-bind="forwarded"
    :class="
      cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class,
      )
    "
  >
    <slot />
  </TabsContent>
</template>