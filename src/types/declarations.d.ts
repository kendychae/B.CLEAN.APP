// Patch: firebase/storage subpath exports don't resolve with moduleResolution:node
// Re-export types from @firebase/storage which has proper typings
declare module 'firebase/storage' {
  export * from '@firebase/storage';
}
