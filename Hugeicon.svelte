<script>
  let {
    size,
    "stroke-width": strokeWidth = 1.5,
    "stroke-linecap": strokeLinecap = 'round',
    "stroke-linejoin": strokeLinejoin = 'round',
    color = "currentColor",
    ...restProps
  }: IconProps = $props();
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
  {...restProps}
>
<!-- ICONS -->
</svg>
