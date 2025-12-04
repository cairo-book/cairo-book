(function () {
  fetch("/versions.json")
    .then((response) => response.json())
    .then((data) => createVersionSwitcher(data))
    .catch((err) => {
      console.warn("Could not load versions.json");
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
