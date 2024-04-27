<script>
  export let icon;

  $: size = $$restProps.size || 24;
  $: strokeWidth = $$restProps["stroke-width"] || 1.5;
  $: strokeLinecap = $$restProps["stroke-linecap"] || "round";
  $: strokeLinejoin = $$restProps["stroke-linejoin"] || "round";
  $: color = $$restProps.color || "currentColor";
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
  {#each icon as elements}
    <svelte:element this={elements[0]} {...elements[1]} />
  {/each}
</svg>
