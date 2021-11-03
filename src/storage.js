import { writable } from 'svelte/store';
import { getStorage, ref as getRef, getMetadata, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getApp } from './context';
import { startTrace, stopTrace } from './perf';

// Svelte Store for Storage file
export function fileDownloadStore(path, opts) {
  const { log, traceId, startWith, url, meta, } = { url: true, ...opts };

  const ref = typeof path === 'string' ? getRef(getStorage(getApp()), path) : path;

  // Performance trace
  const trace = traceId && startTrace(traceId);

  // Internal state
  let _loading = typeof startWith !== undefined;
  let _error = null;

  // State should never change without emitting a new value
  // Clears loading state on first call
  const next = (val, err) => {
    _loading = false;
    _error = err || null;
    set(val);
    trace && stopTrace(trace);
  };

  // Timout
  // Runs of first subscription
  const start = () => {
    const requests = [url && getDownloadURL(ref), meta && getMetadata(ref)];

    Promise
      .all(requests)
      .then(([ url, metadata ]) => next({ url, metadata }))
      .catch(e => next(null, e));
    return () => {};
  };


  // Svelte store
  const store = writable(startWith, start);
  const { subscribe, set } = store;

  return {
    subscribe,
    ref,
    get loading() {
      return _loading;
    },
    get error() {
      return _error;
    }
  };
}

export function uploadTaskStore(path, data, opts) {
  const { log, traceId } = { ...opts };

  const ref = typeof path === 'string' ? getRef(getStorage(getApp()), path) : path;

  // Performance trace
  const trace = traceId && startTrace(traceId);

  // Internal state
  let _error = null;
  let _task; // upload task

  // Emits UploadTaskSnapshot
  const next = (val, err) => {
    _error = err || null;
    set(val);
  };

  const start = () => {
    _task = uploadBytesResumable(ref, data);

    const _teardown = _task.on('state_changed', {
      next: (snap) => next(snap),
      error: (e) => next(_task.snapshot, e),
      complete: () => {
        if (log) console.log(`Upload Complete: ${ref.fullPath}`);
        next(_task.snapshot);
        trace && stopTrace(trace);
      }
    });

    return () => {
      _task.cancel();
      _teardown();
    };
  };

  const store = writable(null, start);
  const { subscribe, set } = store;

  return {
    subscribe,
    ref,
    data,
    get task() {
      return _task;
    },
    get error() {
      return _error;
    },
  };
}
