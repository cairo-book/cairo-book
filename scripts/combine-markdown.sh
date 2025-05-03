#!/bin/bash

# Script to combine all markdown files into a single llms-full.txt file
# Ensures appendix files are placed at the end

output_file="llms-full.txt"
markdown_dir="book/markdown"

# Remove the output file if it already exists
rm -f "${output_file}"

# Function to process files and append to output
echo "Combining markdown files into ${output_file}..."

# First, process all non-appendix files
find "${markdown_dir}" -type f -name "*.md" ! -name "appendix-*.md" -print0 | sort -z | xargs -0 cat >>"${output_file}" 2>/dev/null || true

# Then, append all appendix files
echo "Appending appendix files..."
find "${markdown_dir}" -type f -name "appendix-*.md" -exec cat {} \; >>"${output_file}" 2>/dev/null

echo "Combination complete. Output saved to ${output_file}"

# Copy the result to book/html for online serving
cp "${output_file}" "book/html/"
echo "Copied ${output_file} to book/html for online serving"
