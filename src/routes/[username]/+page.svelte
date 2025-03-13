<script lang="ts">
  import UserLink from '$lib/components/UserLink.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>@{data.username} | rinki</title>
  <meta name="description" content={data.bio} />
</svelte:head>

<div class="absolute inset-0 z-[3000] bg-base-200">
  <main class="prose text-center mx-auto mt-12">
    <img src={data.photoURL ?? '/avatar.jpg'} alt="User avatar" class="mx-auto rounded-full w-48 h-48 object-cover" />
    <h1 class="text-4xl text-secondary my-4">
      @{data.username}
    </h1>

    <p class="text-xl my-8 mx-auto text-pretty max-w-[60ch]">{data.bio || 'no bio yet...'}</p>
    <ul class="list-none flex flex-col items-center">
      {#each data.links as item}
        <li class="my-2 max-w-md w-full">
          <UserLink {...item} />
        </li>
      {:else}
      <p class="text-info">No links.</p>
      {/each}
    </ul>
  </main>
</div>
