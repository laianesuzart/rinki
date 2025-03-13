<script>
import { userData } from "$lib/firebase";
</script>

<svelte:head>
  <meta name="description" content="share your links with rinki." />
</svelte:head>

<main class="flex w-full grow px-10">
  <div class="mockup-browser border-neutral-content border w-full">
    <div class="mockup-browser-toolbar">
      <div class="input border-neutral-content border">https://rinki.com/&ltyou&gt</div>
    </div>
    <div class="hero h-full border-neutral-content border-t">
      <div class="hero-content text-center">
        <div class="w-full">
          <h1 class="text-7xl font-bold text-secondary">rinki</h1>
          <p class="py-6 text-2xl">One simple link to share with the world</p>
          {#if $userData?.username}
            <a href="/{$userData.username}/edit" class="btn btn-outline btn-secondary">Edit Profile</a>
          {:else}
            <a href="/login" class="btn btn-primary mb-2">Get Started</a>
            <a href="/ihwa" target="_blank" class="btn btn-secondary mb-2">Example Profile</a>
          {/if}
          <p class="py-6">
            App build with SvelteKit based on the <a
              class="link"
              href="https://fireship.io/courses/sveltekit">Fireship SvelteKit Course</a>
          </p>
        </div>
      </div>
    </div>
  </div>
 
</main>
