import { WebContainer } from "@webcontainer/api";

const globalAny = globalThis as any;

export const getWebContainer = async () => {
  if (!globalAny.webContainerInstancePromise) {
    globalAny.webContainerInstancePromise = WebContainer.boot();
  }
  return globalAny.webContainerInstancePromise;
};