importScripts("../pkg/wasm-cairo.js");
const { greet, compileCairoProgram, runCairoProgram, runTests } = wasm_bindgen;

(async () => {
  await wasm_bindgen("../pkg/wasm-cairo_bg.wasm");

  console.log(greet("Wasm-cairo ready."));
})();

onmessage = function (e) {
  const { data, allow_warnings, run_profiler, functionToRun } = e.data;
  wasm_bindgen("../pkg/wasm-cairo_bg.wasm").then(() => {
    let result;
    switch (functionToRun) {
      case "runCairoProgram":
        const { availableGas, printFullMemory, useDBGPrintHint } = e.data;
        result = runCairoProgram(
          data,
          availableGas,
          allow_warnings,
          printFullMemory,
          run_profiler,
          useDBGPrintHint
        );
        break;
      case "runTests":
        const {
          filter,
          include_ignored,
          ignored,
          starknet,
          gas_disabled,
          print_resource_usage,
        } = e.data;
        result = runTests(
          data,
          allow_warnings,
          filter,
          include_ignored,
          ignored,
          starknet,
          run_profiler,
          gas_disabled,
          print_resource_usage
        );
        break;
      case "compileCairoProgram":
        const { replaceIds } = e.data;
        result = compileCairoProgram(data, replaceIds);
        break;
      default:
        console.error(`Unexpected function: ${functionToRun}`);
        return;
    }
    postMessage(result);
  });
};
