const maxWorkers = 1;
const worker = new Worker("js/worker.cjs");

window.runFunc = async (cairo_program) => {
  return new Promise((resolve, reject) => {
    worker.postMessage({
      data: cairo_program,
      availableGas: undefined,
      allow_warnings: true,
      printFullMemory: false,
      run_profiler: false,
      useDBGPrintHint: true,
      functionToRun: "runCairoProgram",
    });

    worker.onmessage = function (e) {
      resolve(e.data.substring(e.data.indexOf("\n") + 1));
    };

    worker.onerror = function (error) {
      reject(error);
    };
  });
};

window.runTests = async (cairo_program) => {
  return new Promise((resolve, reject) => {
    worker.postMessage({
      data: cairo_program,
      allow_warnings: true,
      filter: "",
      include_ignored: false,
      ignored: [],
      starknet: false,
      run_profiler: false,
      gas_disabled: false,
      print_resource_usage: false,
      functionToRun: "runTests",
    });

    worker.onmessage = function (e) {
      resolve(e.data);
    };

    worker.onerror = function (error) {
      reject(error);
    };
  });
}
