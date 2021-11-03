import { getContext, setContext } from "svelte";

const appKey = {};

export function setAppContext(app) {
  setContext(appKey, {
    get app() { return app },
  });
}

export function getApp() {
  return getContext(appKey).app;
}
