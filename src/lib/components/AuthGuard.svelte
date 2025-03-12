<script lang="ts">
  import { user } from '$lib/firebase';
</script>

{#if $user}
  <slot />
{:else}
  <div>
    <p class="text-error my-8">
      You must be signed in to view this page.
    </p>
    <a class="btn btn-primary sm:btn-wide" href="/login">Sign in</a>
  </div>
{/if}
