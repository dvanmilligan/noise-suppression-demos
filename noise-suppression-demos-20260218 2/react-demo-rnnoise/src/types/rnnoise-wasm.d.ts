declare module 'rnnoise-wasm' {
  export function createRNNWasmModule(): Promise<any>;
  export function createRNNWasmModuleSync(): any;
}
