#!/usr/bin/env bun
/**
 * Link checker script for the Cairo Book
 * Checks all markdown files for broken links and provides a clear summary
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import GithubSlugger from "github-slugger";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

interface BrokenLink {
	file: string;
	line: number;
	link: string;
	reason: string;
	rateLimited?: boolean;
}

interface LinkCheckResult {
	totalFiles: number;
	totalLinks: number;
	brokenLinks: BrokenLink[];
	skippedLinks: number;
}

// Browser-like headers to reduce bot blocking.
const BROWSER_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"Accept-Language": "en-US,en;q=0.9",
	"Cache-Control": "no-cache",
	Pragma: "no-cache",
	"Upgrade-Insecure-Requests": "1",
};

// Retry configuration
const RETRY_CONFIG = {
	maxRetries: 3,
	initialDelayMs: 2000,
	maxDelayMs: 10000,
};

const REQUEST_TIMEOUT_MS = 10000;
const RETRY_TIMEOUT_MS = 20000;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findMarkdownFiles(dir: string): Promise<string[]> {
	const files: string[] = [];

	async function scan(currentDir: string) {
		const entries = await readdir(currentDir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(currentDir, entry.name);

			if (entry.isDirectory()) {
				await scan(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				files.push(fullPath);
			}
		}
	}

	await scan(dir);
	return files.sort();
}

interface ExtractedLink {
	link: string;
	line: number;
	precheckError?: string;
}

const anchorCache = new Map<string, Set<string>>();

function addAnchor(anchors: Set<string>, raw: string) {
	if (!raw) {
		return;
	}

	anchors.add(raw);
	try {
		const decoded = decodeURIComponent(raw);
		if (decoded && decoded !== raw) {
			anchors.add(decoded);
		}
	} catch {
		// Ignore malformed escape sequences.
	}
}

function parseMarkdownContent(content: string): {
	links: ExtractedLink[];
	anchors: Set<string>;
} {
	const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
	const definitions = new Map<string, string>();
	const anchors = new Set<string>();
	const links: ExtractedLink[] = [];
	const slugger = new GithubSlugger();

	visit(tree, (node: any) => {
		if (node.type === "definition" && typeof node.identifier === "string") {
			const identifier = node.identifier.toLowerCase();
			if (!definitions.has(identifier) && typeof node.url === "string") {
				definitions.set(identifier, node.url.trim());
			}
		}
	});

	const addLink = (link: string, line: number, precheckError?: string) => {
		const trimmed = link.trim();
		if (!trimmed) {
			return;
		}
		links.push({ link: trimmed, line, precheckError });
	};

	const extractHtmlLinks = (value: string, line: number) => {
		const hrefPattern = /\bhref\s*=\s*["']([^"']+)["']/gi;
		const srcPattern = /\bsrc\s*=\s*["']([^"']+)["']/gi;
		let match: RegExpExecArray | null;
		match = hrefPattern.exec(value);
		while (match !== null) {
			addLink(match[1], line);
			match = hrefPattern.exec(value);
		}
		match = srcPattern.exec(value);
		while (match !== null) {
			addLink(match[1], line);
			match = srcPattern.exec(value);
		}
	};

	const extractHtmlAnchors = (value: string) => {
		const htmlIdPattern = /\bid\s*=\s*["']([^"']+)["']/gi;
		const htmlNamePattern = /\bname\s*=\s*["']([^"']+)["']/gi;
		let match: RegExpExecArray | null;
		match = htmlIdPattern.exec(value);
		while (match !== null) {
			addAnchor(anchors, match[1]);
			match = htmlIdPattern.exec(value);
		}
		match = htmlNamePattern.exec(value);
		while (match !== null) {
			addAnchor(anchors, match[1]);
			match = htmlNamePattern.exec(value);
		}
	};

	visit(tree, (node: any) => {
		const line = node.position?.start?.line ?? 1;

		switch (node.type) {
			case "heading": {
				const rawText = mdastToString(node);
				const explicitPattern = /\{#([A-Za-z0-9\-_:.]+)\}/g;
				let explicitMatch: RegExpExecArray | null;
				explicitMatch = explicitPattern.exec(rawText);
				while (explicitMatch !== null) {
					addAnchor(anchors, explicitMatch[1]);
					explicitMatch = explicitPattern.exec(rawText);
				}

				const cleanedText = rawText
					.replace(/\s*\{#([A-Za-z0-9\-_:.]+)\}\s*/g, " ")
					.trim();
				if (cleanedText) {
					addAnchor(anchors, slugger.slug(cleanedText));
				}
				break;
			}
			case "link":
			case "image": {
				if (typeof node.url === "string") {
					addLink(node.url, line);
				}
				break;
			}
			case "linkReference":
			case "imageReference": {
				const identifier =
					typeof node.identifier === "string"
						? node.identifier.toLowerCase()
						: "";
				const definition = identifier ? definitions.get(identifier) : undefined;
				if (definition) {
					addLink(definition, line);
				} else {
					const label =
						typeof node.label === "string"
							? node.label
							: (node.identifier ?? "unknown");
					addLink(`[${label}]`, line, "Missing link reference definition");
				}
				break;
			}
			case "html": {
				if (typeof node.value === "string") {
					extractHtmlLinks(node.value, line);
					extractHtmlAnchors(node.value);
				}
				break;
			}
			default:
				break;
		}
	});

	return { links, anchors };
}

async function getAnchorsForFile(filePath: string): Promise<Set<string>> {
	const cached = anchorCache.get(filePath);
	if (cached) {
		return cached;
	}

	const content = await readFile(filePath, "utf-8");
	const anchors = parseMarkdownContent(content).anchors;
	anchorCache.set(filePath, anchors);
	return anchors;
}

function primeAnchorCache(filePath: string, anchors: Set<string>) {
	anchorCache.set(filePath, anchors);
}

function checkAnchorInFile(
	filePath: string,
	anchor: string,
): Promise<{ ok: boolean; reason?: string }> {
	if (!anchor) {
		return Promise.resolve({ ok: true });
	}

	return getAnchorsForFile(filePath).then((anchors) => {
		let decodedAnchor = anchor;
		try {
			decodedAnchor = decodeURIComponent(anchor);
		} catch {
			// Ignore malformed escape sequences.
		}

		if (anchors.has(anchor) || anchors.has(decodedAnchor)) {
			return { ok: true };
		}

		return { ok: false, reason: `Anchor not found: #${anchor}` };
	});
}

function buildHeaders(includeRange: boolean): HeadersInit {
	if (!includeRange) {
		return BROWSER_HEADERS;
	}
	return {
		...BROWSER_HEADERS,
		Range: "bytes=0-0",
	};
}

async function fetchWithTimeout(
	url: string,
	method: "HEAD" | "GET",
	includeRange: boolean,
	timeoutMs: number,
): Promise<{
	ok: boolean;
	status?: number;
	error?: string;
	timeout?: boolean;
}> {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);

		const response = await fetch(url, {
			method,
			signal: controller.signal,
			headers: buildHeaders(includeRange),
			redirect: "follow",
		});

		clearTimeout(timeout);

		return { ok: response.ok, status: response.status };
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return {
				ok: false,
				error: `Timeout (${Math.round(timeoutMs / 1000)}s)`,
				timeout: true,
			};
		}

		if (error instanceof Error) {
			return { ok: false, error: error.message };
		}

		return { ok: false, error: "Unknown error" };
	}
}

function checkMailtoLink(link: string): { ok: boolean; reason?: string } {
	const target = link.slice("mailto:".length);
	if (!target) {
		return { ok: false, reason: "Invalid mailto link" };
	}

	const [addressPart] = target.split("?");
	const addresses = addressPart
		.split(",")
		.map((addr) => addr.trim())
		.filter(Boolean);
	if (addresses.length === 0) {
		return { ok: false, reason: "Invalid mailto link" };
	}

	const invalid = addresses.find(
		(addr) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr),
	);
	if (invalid) {
		return { ok: false, reason: `Invalid mailto address: ${invalid}` };
	}

	return { ok: true };
}

function checkTelLink(link: string): { ok: boolean; reason?: string } {
	const target = link.slice("tel:".length).replace(/\s+/g, "");
	if (!target) {
		return { ok: false, reason: "Invalid tel link" };
	}

	if (!/^[+()0-9.-]+$/.test(target)) {
		return { ok: false, reason: "Invalid tel link" };
	}

	return { ok: true };
}

async function checkHttpLink(
	url: string,
): Promise<{ ok: boolean; reason?: string; rateLimited?: boolean }> {
	const headResult = await fetchWithTimeout(
		url,
		"HEAD",
		false,
		REQUEST_TIMEOUT_MS,
	);

	if (headResult.status === 403) {
		return { ok: true };
	}

	if (headResult.ok) {
		return { ok: true };
	}

	const getTimeoutMs = headResult.timeout
		? RETRY_TIMEOUT_MS
		: REQUEST_TIMEOUT_MS;
	const getResult = await fetchWithTimeout(url, "GET", true, getTimeoutMs);

	if (getResult.status === 403) {
		return { ok: true };
	}

	if (getResult.ok || getResult.status === 206 || getResult.status === 416) {
		return { ok: true };
	}

	if (getResult.status === 429 || headResult.status === 429) {
		return {
			ok: false,
			reason: `HTTP ${getResult.status ?? headResult.status}`,
			rateLimited: true,
		};
	}

	if (getResult.error) {
		return { ok: false, reason: getResult.error };
	}

	if (getResult.status !== undefined) {
		return { ok: false, reason: `HTTP ${getResult.status}` };
	}

	if (headResult.error) {
		return { ok: false, reason: headResult.error };
	}

	if (headResult.status !== undefined) {
		return { ok: false, reason: `HTTP ${headResult.status}` };
	}

	return { ok: false, reason: "Unknown error" };
}

async function checkLocalLink(
	link: string,
	sourceFile: string,
): Promise<{ ok: boolean; reason?: string }> {
	try {
		const hashIndex = link.indexOf("#");
		const pathWithoutAnchor =
			hashIndex === -1 ? link : link.slice(0, hashIndex);
		const anchor = hashIndex === -1 ? "" : link.slice(hashIndex + 1);

		if (!pathWithoutAnchor) {
			return await checkAnchorInFile(sourceFile, anchor);
		}

		// Resolve relative to source file
		const sourceDir = dirname(sourceFile);
		let decodedPath = pathWithoutAnchor;
		try {
			decodedPath = decodeURIComponent(pathWithoutAnchor);
		} catch {
			// Ignore malformed escape sequences.
		}
		const targetPath = resolve(sourceDir, decodedPath);

		try {
			await stat(targetPath);
			return await checkAnchorInFile(targetPath, anchor);
		} catch {
			return { ok: false, reason: "File not found" };
		}
	} catch (error) {
		return { ok: false, reason: "Invalid path" };
	}
}

async function checkLink(
	link: string,
	sourceFile: string,
): Promise<{ ok: boolean; reason?: string; rateLimited?: boolean }> {
	if (link.startsWith("mailto:")) {
		return checkMailtoLink(link);
	}

	if (link.startsWith("tel:")) {
		return checkTelLink(link);
	}

	if (link.startsWith("javascript:")) {
		return { ok: false, reason: "Unsupported javascript: link" };
	}

	if (link.startsWith("http://") || link.startsWith("https://")) {
		return checkHttpLink(link);
	}

	if (link.includes("://")) {
		return { ok: false, reason: "Unsupported link scheme" };
	}

	return checkLocalLink(link, sourceFile);
}

async function retryRateLimitedLinks(
	links: BrokenLink[],
	srcDir: string,
): Promise<{ stillBroken: BrokenLink[]; recovered: BrokenLink[] }> {
	const rateLimited = links.filter((l) => l.rateLimited);

	if (rateLimited.length === 0) {
		return { stillBroken: links, recovered: [] };
	}

	console.log(`\n${"-".repeat(80)}`);
	console.log(
		`🔄 RETRYING ${rateLimited.length} RATE-LIMITED LINKS (with delays)`,
	);
	console.log("-".repeat(80) + "\n");

	const stillBroken: BrokenLink[] = links.filter((l) => !l.rateLimited);
	const recovered: BrokenLink[] = [];

	for (let i = 0; i < rateLimited.length; i++) {
		const broken = rateLimited[i];
		const relativePath = broken.file.replace(srcDir + "/", "");

		let success = false;
		let lastReason = broken.reason;

		for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
			// Exponential backoff with jitter
			const delay = Math.min(
				RETRY_CONFIG.initialDelayMs * 2 ** (attempt - 1) + Math.random() * 1000,
				RETRY_CONFIG.maxDelayMs,
			);

			process.stdout.write(
				`  [${i + 1}/${rateLimited.length}] ${relativePath}:${broken.line} (attempt ${attempt}/${RETRY_CONFIG.maxRetries})...`,
			);

			await sleep(delay);

			const result = await checkHttpLink(broken.link);

			if (result.ok) {
				console.log(" ✓ recovered");
				success = true;
				recovered.push(broken);
				break;
			} else {
				lastReason = result.reason || "Unknown";
				if (attempt < RETRY_CONFIG.maxRetries) {
					console.log(` ❌ ${lastReason}, retrying...`);
				} else {
					console.log(` ❌ ${lastReason}`);
				}
			}
		}

		if (!success) {
			stillBroken.push({
				...broken,
				reason: lastReason,
				rateLimited: false, // Mark as confirmed broken after retries
			});
		}
	}

	console.log(
		`\n✅ Recovered: ${recovered.length}  ❌ Still broken: ${stillBroken.length - links.filter((l) => !l.rateLimited).length}`,
	);

	return { stillBroken, recovered };
}

async function checkLinksInFile(
	filePath: string,
	concurrency: number = 20,
): Promise<{ links: number; broken: BrokenLink[]; skipped: number }> {
	const content = await readFile(filePath, "utf-8");
	const parsed = parseMarkdownContent(content);
	primeAnchorCache(filePath, parsed.anchors);
	const links = parsed.links;
	const broken: BrokenLink[] = [];
	const skipped = 0;

	// Process links in batches for concurrency control
	for (let i = 0; i < links.length; i += concurrency) {
		const batch = links.slice(i, i + concurrency);

		await Promise.all(
			batch.map(async ({ link, line, precheckError }) => {
				if (precheckError) {
					broken.push({
						file: filePath,
						line,
						link,
						reason: precheckError,
					});
					return;
				}

				const result = await checkLink(link, filePath);

				if (!result.ok) {
					broken.push({
						file: filePath,
						line,
						link,
						reason: result.reason || "Unknown",
						rateLimited: result.rateLimited,
					});
				}
			}),
		);
	}

	return { links: links.length, broken, skipped };
}

function printSummary(result: LinkCheckResult, srcDir: string): number {
	const brokenLinks = result.brokenLinks;

	console.log("\n" + "=".repeat(80));
	console.log("LINK CHECK SUMMARY");
	console.log("=".repeat(80) + "\n");

	console.log(`📁 Files checked:  ${result.totalFiles}`);
	console.log(`🔗 Links checked:  ${result.totalLinks - result.skippedLinks}`);
	console.log(`⏭️  Links skipped:  ${result.skippedLinks}`);
	console.log(`❌ Broken links:   ${brokenLinks.length}`);

	if (brokenLinks.length === 0) {
		console.log("\n✅ All links are valid!\n");
		return 0;
	}

	console.log(`\n${"-".repeat(80)}`);
	console.log("BROKEN LINKS");
	console.log("-".repeat(80) + "\n");

	// Group by file
	const byFile = new Map<string, BrokenLink[]>();
	for (const broken of brokenLinks) {
		const relativePath = broken.file.replace(srcDir + "/", "");
		const existing = byFile.get(relativePath) || [];
		existing.push(broken);
		byFile.set(relativePath, existing);
	}

	for (const [file, fileLinks] of byFile) {
		console.log(`📄 ${file}`);
		for (const { line, link, reason } of fileLinks) {
			console.log(`   Line ${line}: ${link}`);
			console.log(`   └─ Reason: ${reason}`);
		}
		console.log();
	}

	// Print quick reference for CI
	console.log("-".repeat(80));
	console.log("QUICK FIX LIST (copy-paste friendly)");
	console.log("-".repeat(80) + "\n");

	for (const { file, line, link } of brokenLinks) {
		const relativePath = file.replace(srcDir + "/", "");
		console.log(`${relativePath}:${line} → ${link}`);
	}
	console.log();

	return brokenLinks.length;
}

async function main() {
	const scriptDir = dirname(fileURLToPath(import.meta.url));
	const defaultRoot = resolve(scriptDir, "../..");
	const rootDir = process.env.LINK_CHECK_ROOT
		? resolve(process.env.LINK_CHECK_ROOT)
		: defaultRoot;
	const srcDir = resolve(rootDir, "src");

	console.log("🔍 Cairo Book Link Checker\n");
	console.log(`Scanning: ${srcDir}\n`);

	const files = await findMarkdownFiles(srcDir);
	console.log(`Found ${files.length} markdown files\n`);

	const result: LinkCheckResult = {
		totalFiles: files.length,
		totalLinks: 0,
		brokenLinks: [],
		skippedLinks: 0,
	};

	// Process files in parallel batches for speed
	const FILE_BATCH_SIZE = 10;
	for (let i = 0; i < files.length; i += FILE_BATCH_SIZE) {
		const batch = files.slice(i, i + FILE_BATCH_SIZE);
		const batchResults = await Promise.all(
			batch.map(async (file) => {
				const relativePath = file.replace(srcDir + "/", "");
				const { links, broken, skipped } = await checkLinksInFile(file);
				return { relativePath, links, broken, skipped };
			}),
		);

		for (const { relativePath, links, broken, skipped } of batchResults) {
			result.totalLinks += links;
			result.brokenLinks.push(...broken);
			result.skippedLinks += skipped;

			if (broken.length > 0) {
				console.log(`❌ ${relativePath} (${broken.length} broken)`);
			} else {
				console.log(`✓ ${relativePath}`);
			}
		}
	}

	// Retry rate-limited links with delays
	const hasRateLimited = result.brokenLinks.some((l) => l.rateLimited);
	if (hasRateLimited) {
		const { stillBroken } = await retryRateLimitedLinks(
			result.brokenLinks,
			srcDir,
		);
		result.brokenLinks = stillBroken;
	}

	const trulyBrokenCount = printSummary(result, srcDir);

	// Exit with error code only if truly broken links found (not rate-limited)
	if (trulyBrokenCount > 0) {
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
