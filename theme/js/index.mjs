const maxWorkers = 1;
const worker = new Worker("js/worker.cjs");

window.runFunc = async (cairo_program) => {
  return new Promise((resolve, reject) => {
    worker.postMessage({
      data: cairo_program,
      availableGas: undefined,
      printFullMemory: false,
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
