import { readdir } from "fs/promises";
import { parse } from "yaml";

interface PageMeta {
	meta?: string;
}

async function updateMetaDescriptions() {
	// Get all HTML files in book/html directory
	const htmlFiles = await readdir("book/html", { recursive: true });
	const htmlPaths = htmlFiles.filter((f) => f.endsWith(".html"));

	for (const htmlPath of htmlPaths) {
		// Find corresponding markdown source file
		const mdPath = `src/${htmlPath.replace(".html", ".md")}`;

		try {
			// Read markdown file content
			const mdContent = await Bun.file(mdPath).text();

			// Extract YAML frontmatter if it exists
			const yamlMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);
			if (!yamlMatch) continue;

			// Parse YAML frontmatter
			const frontmatter = parse(yamlMatch[1]) as PageMeta;
			if (!frontmatter.meta) continue;

			// Read HTML file
			const htmlFilePath = `book/html/${htmlPath}`;
			const htmlContent = await Bun.file(htmlFilePath).text();

			// Remove YAML frontmatter section from HTML, its rendered heading, and the hr tag
			const updatedHtml = htmlContent.replace(
				/<hr \/>\n?<h2 id="meta[^>]*><a class="header"[^>]*>meta: "[^"]*"<\/a><\/h2>\n?/,
				"",
			);

			// Replace meta description
			const finalHtml = updatedHtml.replace(
				/<meta name="description" content="[^"]*">/,
				`<meta name="description" content="${frontmatter.meta}">`,
			);

			// Write updated HTML back to file
			await Bun.write(htmlFilePath, finalHtml);

			console.log(`Updated meta description for ${htmlPath}`);
		} catch (error: any) {
			// Skip if source file doesn't exist or other errors
			if (error.code !== "ENOENT") {
				console.error(`Error processing ${htmlPath}:`, error);
			}
		}
	}
}

// Run the script
updateMetaDescriptions()
	.then(() => {
		console.log("Meta description updates complete!");
	})
	.catch((error) => {
		console.error("Error updating meta descriptions:", error);
		process.exit(1);
	});
