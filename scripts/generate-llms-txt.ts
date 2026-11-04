// Regenerate llms.txt from src/SUMMARY.md so it lists every page of the book.
//
// Usage: bun run scripts/generate-llms-txt.ts [output_file]
//   Without an argument, rewrites the tracked llms.txt at the repo root.
//   CI passes book/html/llms.txt so the deploy never touches tracked files.
//
// Page descriptions and the "## Optional" section are kept from the tracked
// llms.txt; a page without a description is listed by title only.

const BASE_URL = "https://book.cairo-lang.org";
const outputFile = process.argv[2] ?? "llms.txt";

const summary = await Bun.file("src/SUMMARY.md").text();
const current = await Bun.file("llms.txt").text();

const descriptions = new Map<string, string>();
for (const [, slug, description] of current.matchAll(
  /^- \[[^\]]*\]\(https:\/\/book\.cairo-lang\.org\/([^)]+)\): (.+)$/gm,
)) {
  descriptions.set(slug, description);
}

const optionalStart = current.indexOf("## Optional");
const optional =
  optionalStart === -1 ? "" : current.slice(optionalStart).trim();

const pages = summary
  .replace(/<!--[\s\S]*?-->/g, "")
  .matchAll(/\[([^\]]+)\]\((?:\.\/)?([^)]+)\.md\)/g);

const entries = [...pages].map(([, title, slug]) => {
  const description = descriptions.get(slug);
  const link = `- [${title}](${BASE_URL}/${slug})`;
  return description ? `${link}: ${description}` : link;
});

const output = ["# Cairo book", "## Docs", entries.join("\n"), optional]
  .filter(Boolean)
  .join("\n\n");

await Bun.write(outputFile, `${output}\n`);
console.log(`Wrote ${entries.length} pages to ${outputFile}`);
