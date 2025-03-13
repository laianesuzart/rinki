<script lang="ts">
  import { page } from '$app/stores';
  import { db, userData, user } from '$lib/firebase';
  import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
  import { writable } from 'svelte/store';

  import SortableList from '$lib/components/SortableList.svelte';
  import UserLink from '$lib/components/UserLink.svelte';

  const icons = ['Twitter', 'YouTube', 'TikTok', 'LinkedIn', 'GitHub', 'Custom'];
  let tooltipCopy = 'Copy to clipboard';

  const formDefaults = {
    icon: 'custom',
    title: '',
    url: 'https://',
  };

  const formData = writable({...formDefaults});

  let showForm = false;

  $: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
  $: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
  $: formIsValid = urlIsValid && titleIsValid;

  function sortList(e: CustomEvent) {
    const newList = e.detail;
    const userRef = doc(db, 'users', $user!.uid);
    setDoc(userRef, { links: newList }, { merge: true });
  }

  async function addLink(e: SubmitEvent) {
    const userRef = doc(db, 'users', $user!.uid);

    await updateDoc(userRef, {
      links: arrayUnion({
        ...$formData,
        id: Date.now().toString(),
      }),
    });

    formData.set({...formDefaults});

    showForm = false;
  }

  async function deleteLink(item: any) {
    const userRef = doc(db, 'users', $user!.uid);
    await updateDoc(userRef, {
      links: arrayRemove(item),
    });
  }

  function cancelLink() {
    formData.set({...formDefaults});
    showForm = false;
  }

  async function toggleProfileStatus() {
    const userRef = doc(db, 'users', $user!.uid);
    await updateDoc(userRef, {
      published: !$userData?.published,
    });
  }

  function copyProfileLink() {
    if (window) {
      const link = `${window.location.protocol}//${window.location.host}/${$userData?.username}`;
      navigator.clipboard.writeText(link);
      tooltipCopy = `Copied: ${link}`;
    }
  }

  function outCopyLink() {
    setTimeout(() => {
      tooltipCopy = 'Copy to clipboard';
    }, 300)
  }
</script>

<main class="grow max-w-xl mx-auto">
  {#if $userData?.username == $page.params.username}
    <h2 class="mx-2 text-2xl font-bold mt-8 mb-4 text-center">Edit your Profile</h2>

    <div class="text-center my-4">
      <a class="btn btn-outline btn-xs" href={`/${$userData.username}/photo`}>Change photo</a>
      <a class="btn btn-outline btn-xs" href={`/${$userData.username}/bio`}>Edit Bio</a>
    </div>

    <form class="form-control">
      <label class="label flex flex-col items-center justify-center gap-4">
        <span class="label-text flex items-center gap-2">
          Profile privacy
          <div
            class="tooltip group-hover:tooltip-open"
            data-tip="If public, the world can see your profile"
          >
            <svg class="cursor-pointer" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 416.979 416.979" xml:space="preserve"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <g> <path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85 c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M237.6,340.786 c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885c0-3.217,2.607-5.822,5.822-5.822h46.576 c3.215,0,5.822,2.604,5.822,5.822V340.786z M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765 c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766C242.256,122.755,227.107,137.901,208.49,137.901z"></path> </g> </g></svg>
          </div>
        </span>
        <div class="flex items-center gap-2">
          <span class="badge badge-info">{$userData?.published ? 'Public' : 'Private'}</span>
          <input
          type="checkbox"
          class="toggle toggle-secondary toggle-sm"
          checked={$userData?.published}
          on:change={toggleProfileStatus}
        />
        </div>
      </label>
    </form>

    {#if $userData?.published}
      <div class="text-center mb-8">
        <h3 class="font-bold mt-4 mb-2">
          Profile link:
        </h3>
        <div  
          class="tooltip group-hover:tooltip-open mx-2"
          data-tip="Open"
        >
          <a href={`/${$userData?.username}`} class="link link-primary" target="_blank">
            <svg fill="currentColor" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, -1, 0, 0)rotate(180)"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g><path d="M20,21H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8A1,1,0,0,1,8,6H4V19H20V13a1,1,0,0,1,2,0v6A2,2,0,0,1,20,21Z"></path><path d="M21.62,6.22l-5-4a1,1,0,0,0-1.05-.12A1,1,0,0,0,15,3V4.19a9.79,9.79,0,0,0-7,7.65,1,1,0,0,0,.62,1.09A1,1,0,0,0,9,13a1,1,0,0,0,.83-.45C11,10.78,13.58,10.24,15,10.07V11a1,1,0,0,0,.57.9,1,1,0,0,0,1.05-.12l5-4a1,1,0,0,0,0-1.56Z"></path></g></svg>
          </a>
        </div>
        
        <div
          class="tooltip group-hover:tooltip-open mx-2 cursor-pointer text-primary"
          data-tip={tooltipCopy}
        >
          <button on:click={copyProfileLink} on:mouseout={outCopyLink} on:blur={outCopyLink}>
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="currentColor" stroke-width="1.5"></path> </g></svg>
          </button>
        </div>
      </div>
    {/if}

    <SortableList list={$userData?.links} emptyMessage="No links added yet." on:sort={sortList} let:item>
      <div class="group relative">
        <UserLink {...item} />
        <button
          on:click={() => deleteLink(item)}
          class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 bottom-10"
          >
          Delete
        </button>
      </div>
    </SortableList>
    {#if !showForm}
      <button
        on:click={() => (showForm = true)}
        class="btn btn-outline btn-info block mx-auto my-4"
      >
        Add a Link
      </button>
    {/if}
    <form on:submit|preventDefault={addLink} class="bg-base-200 p-6 w-full mx-auto rounded-xl" class:invisible={!showForm}>
      <div class="flex flex-col gap-2 sm:flex-row">
        <select name="icon" class="select select-sm" bind:value={$formData.icon}>
          {#each icons as icon}
            <option value={icon.toLowerCase()}>{icon}</option>
          {/each}
        </select>
        <div>
          <input
          name="title"
          type="text"
          placeholder="Title"
          class="input input-sm"
          class:input-success={titleIsValid}
          class:input-error={!titleIsValid}
          bind:value={$formData.title}
          />
          {#if !titleIsValid}
            <p class="text-error text-xs py-1">Must have valid title</p>
          {/if}
        </div>
        <div>
          <input
          name="url"
          type="text"
          placeholder="URL"
          class="input input-sm w-64"
          class:input-success={urlIsValid}
          class:input-error={!urlIsValid}
          bind:value={$formData.url}
          />
          {#if !urlIsValid}
            <p class="text-error text-xs py-1">Must have a valid URL</p>
          {/if}
        </div>
      </div>

      <div class="flex gap-2 items-center justify-end my-4">
        <button type="button" class="btn btn-outline" on:click={cancelLink}>Cancel</button>
        <button disabled={!formIsValid} type="submit" class="btn btn-success block">Add Link</button>
      </div>
    </form>
  {/if}
</main>
