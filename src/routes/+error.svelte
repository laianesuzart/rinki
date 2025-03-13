<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import lottie from "lottie-web";
  import errorAnimation from "../assets/error-animation.json"

  let animationContainer: HTMLElement
  onMount(() => {
    lottie.loadAnimation({
      container: animationContainer,
      animationData: errorAnimation,
      loop: true,
      autoplay: true,
    })
  })
</script>

<main class="grow grid place-content-center px-4 pt-8 text-center">
  <h2 class="text-6xl sm:text-8xl text-error font-bold">{$page.status}</h2>
  <h3 class="text-2xl sm:text-4xl text-base-content">{$page.error?.message}</h3>
  <div bind:this={animationContainer} class="h-[40vh]"></div>
</main>
