<script lang="ts">
  export let icon = '';
  export let url = '';
  export let title = '';
  export let id = null;
</script>

<a
  href={url}
  target="_blank"
  rel="noreferrer"
  class="stack w-full max-w-md text-center bg-base-100 flex justify-center items-center p-4 rounded-lg not-prose no-underline border border-solid border-transparent transition-colors duration-300 hover:border-secondary"
>
  <img src={`/${icon}.png`} alt={icon} width="32" height="32" class="w-8" />
  <span class="text-lg text-base-content font-bold">{title}</span>
</a>
