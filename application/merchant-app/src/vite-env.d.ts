/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other env variables here if you have them, e.g.:
  // readonly VITE_SOME_OTHER_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 