#!/bin/bash

# Combine the built markdown book into a single llms-full.txt file, with the
# appendix files at the end.
#
# Usage: scripts/combine-markdown.sh [output_file]
#   Run after `mdbook build`. Writes book/html/llms-full.txt by default.

output_file="${1:-book/html/llms-full.txt}"
markdown_dir="book/markdown"

# Remove the output file if it already exists
rm -f "${output_file}"

echo "Combining markdown files into ${output_file}..."

# First, process all non-appendix files
find "${markdown_dir}" -type f -name "*.md" ! -name "appendix-*.md" -print0 | sort -z | xargs -0 cat >>"${output_file}" 2>/dev/null || true

# Then, append all appendix files
echo "Appending appendix files..."
find "${markdown_dir}" -type f -name "appendix-*.md" -exec cat {} \; >>"${output_file}" 2>/dev/null

echo "Combination complete. Output saved to ${output_file}"
