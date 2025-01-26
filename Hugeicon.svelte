<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  type IconsProps = Omit<
    SVGAttributes<SVGElement>,
    'width' | 'height' | 'viewbox' | 'fill' | 'xmlns'
  > & {
      size?: number | string;
  };

  let { size, strokeWidth, strokeLinecap, strokeLinejoin, color, ...$$restProps }: IconsProps = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  width={size}
  height={size}
  stroke-width={strokeWidth}
  stroke-linecap={strokeLinecap}
  stroke-linejoin={strokeLinejoin}
  {color}
  {...$$restProps}
>
<!-- ICONS -->
</svg>
