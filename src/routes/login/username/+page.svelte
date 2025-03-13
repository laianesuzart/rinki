<script lang="ts">
  import AuthGuard from '$lib/components/AuthGuard.svelte';
  import { db, user, userData } from '$lib/firebase';
  import { doc, getDoc, writeBatch } from 'firebase/firestore';

  let username = '';
  let loading = false;
  let isAvailable = false;
  let debounceTimer: NodeJS.Timeout;

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  $: isValid = username.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvailable && !loading;

  async function checkAvailability() {
    isAvailable = false;
    clearTimeout(debounceTimer);
    if (!isValid) {
      loading = false;
      return;
    }

    loading = true;

    debounceTimer = setTimeout(async () => {
      const ref = doc(db, 'usernames', username.toLowerCase());
      const exists = await getDoc(ref).then((doc) => doc.exists());

      isAvailable = !exists;
      loading = false;
    }, 500);
  }

  async function confirmUsername() {
    const batch = writeBatch(db);
    batch.set(doc(db, 'usernames', username.toLowerCase()), { uid: $user?.uid });
    batch.set(doc(db, 'users', $user!.uid), {
      username: username.toLowerCase(),
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: '',
      links: [],
    });
    
    await batch.commit();

    username = '';
    isAvailable = false;
  }
</script>

<AuthGuard>
  {#if $userData?.username}
    <p class="text-lg">
      Your username is <span class="text-success font-bold">@{$userData.username}</span>
    </p>
    <p class="text-sm">(Usernames cannot be changed)</p>
    <a class="btn btn-accent btn-wide" href="/login/photo">Upload profile image</a>
  {:else}
    <form on:submit|preventDefault={confirmUsername} class="w-[80%] max-w-96">
      <input
        type="text"
        placeholder="Username"
        class="input w-full lowercase"
        bind:value={username}
        on:input={checkAvailability}
        class:input-error={!isValid && isTouched}
        class:input-warning={isTaken}
        class:input-success={isAvailable && isValid && !loading}
        autocapitalize="none"
      />
      <div class="my-4 min-h-16 w-full">
        {#if loading}
          <p class="text-secondary text-sm">Checking availability of @{username.toLowerCase()}...</p>
        {/if}

        {#if !isValid && isTouched}
          <p class="text-error text-sm">must be 3-16 characters long, alphanumeric only</p>
        {/if}

        {#if isValid && !isAvailable && !loading}
          <p class="text-warning text-sm">
            @{username.toLowerCase()} is not available
          </p>
        {/if}

        {#if isAvailable}
          <button class="btn btn-success btn-wide">Confirm username @{username.toLowerCase()} </button>
        {/if}
      </div>
    </form>
  {/if}
</AuthGuard>
