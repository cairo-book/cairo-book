(function () {
  // Default fallback when versions.json is not available (e.g., PR previews)
  const defaultData = {
    latest: "2.13",
    versions: [{ version: "2.13", path: "/", label: "2.13 (latest)" }],
  };

  fetch("/versions.json")
    .then((response) => {
      if (!response.ok) throw new Error("versions.json not found");
      return response.json();
    })
    .then((data) => createVersionSwitcher(data))
    .catch((err) => {
      console.warn("Could not load versions.json, using defaults:", err);
      createVersionSwitcher(defaultData);
    });

  function createVersionSwitcher(data) {
    const currentPath = window.location.pathname;

    // Determine current version from path
    let currentVersion = data.latest;
    const versionMatch = currentPath.match(/^\/v([\d.]+)\//);
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
      .addEventListener("change", function (e) {
        const newBasePath = e.target.value;
        let pagePath = currentPath;

        if (versionMatch) {
          pagePath = currentPath.replace(/^\/v[\d.]+\//, "/");
        }

        const newPath =
          newBasePath === "/" ? pagePath : newBasePath + pagePath.substring(1);
        window.location.href = newPath;
      });
  }
})();
