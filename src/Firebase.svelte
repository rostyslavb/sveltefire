<script>
  import { setContext } from "svelte";
  export let firebase = {};

  setContext("firebase", firebase);
</script>

<slot />
