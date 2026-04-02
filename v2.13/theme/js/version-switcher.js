(() => {
	// Detect base path specifically for cairo-book deployments
	// Handles cases like:
	// - https://book.cairo-lang.org/ -> basePath = ""
	// - https://www.starknet.io/cairo-book/ -> basePath = "/cairo-book"
	// - https://cairo-book.github.io/cairo-book/ -> basePath = "/cairo-book"

	const fullPath = window.location.pathname;

	// Check if path contains "/cairo-book/" or starts with "/cairo-book"
	let basePath = "";
	if (fullPath.includes("/cairo-book")) {
		const cairoBookIndex = fullPath.indexOf("/cairo-book");
		basePath = fullPath.substring(0, cairoBookIndex + "/cairo-book".length);
	}

	// Determine relative path (everything after basePath)
	const relativePath = basePath
		? fullPath.substring(basePath.length)
		: fullPath;

	fetch(basePath + "/versions.json")
		.then((response) => response.json())
		.then((data) => createVersionSwitcher(data, basePath))
		.catch((err) => console.warn("Could not load versions.json:", err));

	function createVersionSwitcher(data, basePath) {
		const fullPath = window.location.pathname;

		// Remove base path to get the relative path
		const relativePath = basePath
			? fullPath.substring(basePath.length)
			: fullPath;

		// Determine current version from path
		let currentVersion = data.latest;
		const versionMatch = relativePath.match(/^\/v([\d.]+)(\/|$)/);
		if (versionMatch) {
			currentVersion = versionMatch[1];
		}

		// Create dropdown
		const container = document.createElement("div");
		container.className = "version-switcher";
		container.innerHTML = `
      <label for="version-select">Version:</label>
      <select id="version-select">
        ${data.versions
					.map(
						(v) => `
          <option value="${v.path}" ${v.version === currentVersion ? "selected" : ""}>
            ${v.label}
          </option>
        `,
					)
					.join("")}
      </select>
    `;

		// Insert into menu bar
		const menuBar = document.querySelector(".right-buttons");
		if (menuBar) {
			menuBar.insertBefore(container, menuBar.firstChild);
		}

		// Handle version change
		document
			.getElementById("version-select")
			.addEventListener("change", (e) => {
				const newVersionPath = e.target.value; // e.g., "/" or "/v2.10/"

				// Get page path without version prefix
				let pagePath = relativePath;
				if (versionMatch) {
					pagePath = relativePath.replace(/^\/v[\d.]+/, "");
				}

				// Ensure pagePath starts with / if not empty
				if (pagePath && !pagePath.startsWith("/")) {
					pagePath = "/" + pagePath;
				}

				// Construct new path: basePath + versionPath + pagePath
				// Remove trailing slash from versionPath if pagePath exists
				let cleanVersionPath = newVersionPath;
				if (pagePath && pagePath !== "/") {
					cleanVersionPath = newVersionPath.replace(/\/$/, "");
				}

				const newPath =
					basePath + cleanVersionPath + (pagePath === "/" ? "" : pagePath);
				window.location.href = newPath;
			});
	}
})();
