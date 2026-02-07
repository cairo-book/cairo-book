import init, { compile_and_run } from "./cairo_lang_runner_wasm.js";

let initialized = false;

init()
	.then(() => {
		initialized = true;
		postMessage({ type: "ready" });
	})
	.catch((err) => {
		postMessage({ type: "error", error: "WASM init failed: " + err.message });
	});

onmessage = (e) => {
	if (e.data.type !== "run") return;

	if (!initialized) {
		postMessage({
			id: e.data.id,
			type: "result",
			error: "WASM not initialized yet",
		});
		return;
	}

	try {
		const responseJson = compile_and_run(JSON.stringify(e.data.request));
		postMessage({
			id: e.data.id,
			type: "result",
			response: JSON.parse(responseJson),
		});
	} catch (err) {
		postMessage({ id: e.data.id, type: "result", error: err.message });
	}
};
