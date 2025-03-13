<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  export let data: PageData;
  let loading = false;
</script>

<main class="grow card-body items-center">
  <h2 class="card-title mx-auto">Update your bio</h2>
  
  <form
    method="POST"
    class="max-w-[800px] mx-auto"
    use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
      }
    }}
  >
    <div class="form-control">
      <label for="bio" class="label">
        <span class="label-text hidden">Your bio</span>
      </label>
      <textarea
        name="bio"
        class="textarea textarea-bordered textarea-accent textarea-lg"
        class:textarea-error={$page.form?.error}
        value={data.bio}
        placeholder={data.bio || 'no bio yet...'}
      />
    </div>
    
    <p class="text-error py-4">{$page.form?.error ?? ""}</p>

    <div class="mt-8 text-center flex flex-wrap gap-2 justify-center">
      <a href={`/${data.username}/edit`} class="btn btn-primary btn-wide">Go back</a>
      <button class="btn btn-secondary btn-wide" disabled={loading}>
          <span class="loading loading-spinner" class:hidden={!loading}></span>
        Save
      </button>
    </div>
  </form>
</main>
