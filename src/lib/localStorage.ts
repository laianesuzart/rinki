import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const darkTheme = writable(
  (browser &&
    (localStorage.getItem("darkTheme")
      ? JSON.parse(localStorage.getItem("darkTheme")!)
      : window.matchMedia("(prefers-color-scheme: dark)").matches)) ||
    false
);
darkTheme.subscribe((val) => {
  if (browser) return (localStorage.darkTheme = val);
});
