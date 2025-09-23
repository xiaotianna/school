<template>
  <div class="flex-1 flex flex-col overflow-auto">
    <div
      dir="ltr"
      class="relative overflow-hidden flex-1"
      style="
        position: relative;
        --radix-scroll-area-corner-width: 0px;
        --radix-scroll-area-corner-height: 0px;
      "
    >
      <div
        data-radix-scroll-area-viewport=""
        class="h-full w-full rounded-[inherit]"
        style="overflow: hidden scroll"
      >
        <div style="min-width: 100%; display: table">
          <div class="space-y-4 px-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
