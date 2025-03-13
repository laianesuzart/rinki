<script lang="ts">
import { page } from "$app/stores";
import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
</script>

<div class="grow">
  <nav class="flex justify-center my-6">
    <ul class="steps">
      <span class="step step-info">Sign In</span>
      <a
        href="/signup/username"
        class="step"
        class:step-info={$page.route.id?.match(/username|photo/g)}
      >
        Choose Username
      </a>
      <a href="/signup/photo" class="step" class:step-info={$page.route.id?.includes("photo")}>
        Upload Photo
      </a>
    </ul>
  </nav>
  
  <AnimatedRoute>
    <main class="card sm:w-4/6 bg-base-300 text-base-content mx-auto sm:px-8">
      <div class="card-body items-center text-center">
        <slot />
      </div>
    </main>
  </AnimatedRoute>
</div>
