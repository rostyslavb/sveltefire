<script>
  import { setContext } from "svelte";
  export let firebase;

  setContext("firebase", {
    get firebase() {
      return firebase;
    }
  });
</script>

<slot />
