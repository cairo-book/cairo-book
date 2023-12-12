const maxWorkers = 1;
let workerPath = '';

// supported languages
const supportedLanguages = ['zh-cn', 'fr', 'es'];

// path to mjs. This is the path to the current script, which is the last script in the document.
const scripts = document.getElementsByTagName('script');
const currentScript = scripts[scripts.length - 1];
const scriptUrl = currentScript.src;

if (supportedLanguages.some(lang => window.location.pathname.startsWith('/' + lang))) {
    workerPath = new URL('../js/worker.cjs', scriptUrl).toString();
} else {
    workerPath = new URL('./worker.cjs', scriptUrl).toString();
}


console.log(workerPath);
const worker = new Worker(workerPath);

window.runFunc = async (cairo_program) => {
    return new Promise((resolve, reject) => {
        worker.postMessage({
            data: cairo_program,
            availableGas: undefined,
            printFullMemory: false,
            useDBGPrintHint: true,
            functionToRun: "runCairoProgram"
        });

        worker.onmessage = function(e) {
            resolve(e.data.substring(e.data.indexOf('\n') + 1));
        };

        worker.onerror = function(error) {
            reject(error);
        };
    });
};
