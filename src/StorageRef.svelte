<script>
  export let ref;
  export let log = false;
  export let trace = null;
  export let startWith = undefined;
  export let url = true;
  export let meta = false;

  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import { fileDownloadStore } from "./storage";

  const opts = {
    startWith,
    trace,
    log,
    meta,
    url,
  };

  let store = fileDownloadStore(ref, opts);

  const dispatch = createEventDispatcher();

  let unsub;

  // Props changed
  $: {
    if (unsub) {
      // Unsub and create new store
      unsub();
      store = fileDownloadStore(ref, opts);
      dispatch("ref", { ref: store.ref });
    }

    unsub = store.subscribe(result => {
     if (result) dispatch("result", result);
    });
  }

  onMount(() => dispatch("ref", { ref: store.ref }));
  onDestroy(() => unsub());
</script>

<slot name="before" />

{#if $store}
  <slot
    downloadURL={$store && $store.url}
    metadata={$store && $store.metadata}
    ref={store.ref}
    error={store.error} />
{:else if store.loading}
  <slot name="loading" />
{:else}
  <slot name="fallback" />
{/if}

<slot name="after" />
