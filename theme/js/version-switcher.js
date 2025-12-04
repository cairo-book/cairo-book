(function () {
  // Detect base path (e.g., "/cairo-book" when hosted at github.io/cairo-book/)
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const firstPart = pathParts[0] || "";
  // If first part is not a version dir or html file, it's a base path
  const isBasePath =
    firstPart && !firstPart.match(/^v[\d.]+$/) && !firstPart.endsWith(".html");
  const basePath = isBasePath ? "/" + firstPart : "";

  fetch(basePath + "/versions.json")
    .then((response) => response.json())
    .then((data) => createVersionSwitcher(data, basePath))
    .catch((err) => console.warn("Could not load versions.json:", err));

  function createVersionSwitcher(data, basePath) {
    const currentPath = window.location.pathname;

    // Remove base path to get the relative path
    const relativePath = basePath
      ? currentPath.replace(new RegExp("^" + basePath), "")
      : currentPath;

    // Determine current version from path
    let currentVersion = data.latest;
    const versionMatch = relativePath.match(/^\/(v[\d.]+)\//);
    if (versionMatch) {
      currentVersion = versionMatch[1].substring(1); // Remove 'v' prefix
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
      .addEventListener("change", function (e) {
        const newVersionPath = e.target.value; // e.g., "/" or "/v2.10/"

        // Get page path without version prefix
        let pagePath = relativePath;
        if (versionMatch) {
          pagePath = relativePath.replace(/^\/v[\d.]+/, "");
        }

        // Construct new path: basePath + versionPath + pagePath
        const newPath = basePath + newVersionPath.replace(/\/$/, "") + pagePath;
        window.location.href = newPath;
      });
  }
})();
