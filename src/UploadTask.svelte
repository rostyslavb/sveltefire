<script>
  export let ref;
  export let file;
  export let log = false;
  export let trace = null;

  import { onDestroy, onMount, createEventDispatcher } from "svelte";
  import { uploadTaskStore } from "./storage";

  const dispatch = createEventDispatcher();

  const opts = {
    trace,
    log,
    oncomplete: () => dispatch("complete"),
  }

  let store = uploadTaskStore(ref, file, opts);

  let unsub;

  // Props changed
  $: {
    if (unsub) {
      // Unsub and create new store
      unsub();
      store = uploadTaskStore(path, file, opts);
      dispatch("ref", { ref: store.ref });
    }

    unsub = store.subscribe(snapshot => {
      dispatch("snapshot", {
        snapshot
      });
    });
  }

  onMount(() => dispatch("ref", { ref: store.ref }))
  onDestroy(() => unsub());
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
