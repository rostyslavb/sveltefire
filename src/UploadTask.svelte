<script>
  export let ref;
  export let data;
  export let log = false;
  export let traceId = null;

  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import { uploadTaskStore } from "./storage";

  const dispatch = createEventDispatcher();

  const opts = {
    traceId,
    log,
  }

  let store = uploadTaskStore(ref, data, opts);

  let unsub;

  function onsnapshot(snapshot) {
    dispatch("snapshot", { snapshot });
  }

  // Props changed
  $: {
    if (unsub) {
      // Unsub and create new store
      unsub = void unsub();
      store = uploadTaskStore(ref, data, opts);
      dispatch("ref", { ref: store.ref });
    }

    if (!unsub)
      unsub = store.subscribe(onsnapshot);
  }

  onMount(() => dispatch("ref", { ref: store.ref }));
  onDestroy(() => (unsub = void unsub()));
</script>

<slot name="before" />

{#if $store}
  <slot
    snapshot={$store}
    ref={store.ref}
    task={store.task}
    error={store.error} />
{:else}
  <slot name="fallback" />
{/if}

<slot name="after" />
