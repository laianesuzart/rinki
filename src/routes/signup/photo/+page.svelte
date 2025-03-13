<script lang="ts">
  import AuthGuard from "$lib/components/AuthGuard.svelte";
  import { user, userData, storage, db } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

  let previewURL: string;
  let uploading = false;
  let error = "";
  $: href = `/${$userData?.username}/edit`;

  async function upload(e: any) {
    error = "";
    const file = e.target.files[0];
    if (file.size > 1000000) { // 1MB
      error = "File is too large.";
      return;
    }
    uploading = true;
    previewURL = URL.createObjectURL(file);
    const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
    const result = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(result.ref);

    await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
    uploading = false;
  }
</script>

<AuthGuard>
  {#if $userData}
    <h2 class="card-title">Upload a Profile Photo</h2>

    <form class="max-w-screen-md w-full">
      <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
        <img
          src={previewURL ?? $userData?.photoURL ?? "/avatar.jpg"}
          alt="User avatar"
          class="rounded-full w-48 h-48 object-cover mx-auto"
        />
        <label for="photoURL" class="label">
          <span class="label-text">Pick a file</span>
        </label>
        <input
          on:change={upload}
          name="photoURL"
          type="file"
          class="file-input file-input-bordered file-input-primary w-full max-w-xs"
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
        <div class="label">
          <span class="label-text-alt">Max size 1MB</span>
        </div>
        {#if uploading}
          <p>Uploading...</p>
          <progress class="progress progress-info w-56 mt-6 self-center" />
        {/if}
        {#if error}
          <p class="text-error">{error}</p>
        {/if}
      </div>
    </form>

    <a {href} class="btn btn-accent btn-wide">Finish</a>
    {:else}
    <p class="text-error">Choose your username first.</p>
    <a href="/signup/username" class="btn btn-warning btn-wide">Go back</a>
    {/if}
</AuthGuard>
