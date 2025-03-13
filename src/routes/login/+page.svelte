<script lang="ts">
  import { auth, user, userData } from '$lib/firebase';
  import { goto } from "$app/navigation";
  import { tick } from 'svelte';

  import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const idToken = await credential.user.getIdToken();

    const res = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    await tick();

    const unsubscribe = userData.subscribe(async (data) => {
      if (data) {
        unsubscribe();
        await goto(`/${data.username}/edit`);
      }
    });
  }
</script>

{#if $user}
  <h2 class="card-title">Welcome, {$user.displayName}</h2>
  <p class="text-center text-success">You are logged in</p>
  <a class="btn btn-accent btn-wide" href="/login/username">Next step</a>
{:else}
  <h2 class="text-xl font-medium mb-4">Choose login option:</h2>
  <button  on:click={signInWithGoogle} class="btn bg-white text-black border-[#e5e5e5] hover:bg-white">
    <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
    Login with Google
  </button>
{/if}
