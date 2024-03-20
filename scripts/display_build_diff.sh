#!/bin/bash

dir1="/cairo-book/book"
dir2="/tmp/book"

# ANSI color codes
RED="\033[0;31m"
GREEN="\033[0;32m"
NO_COLOR="\033[0m" # To reset the color

# Find all .html files in the first directory
find "$dir1" -type f -name "*.html" | while read -r file1; do
	# Replace the path of dir1 with dir2 in the file path
	file2=$(echo "$file1" | sed "s|^$dir1|$dir2|")

	# Check if the corresponding file exists in the second directory
	if [ -f "$file2" ]; then
		# Use diff to compare the files and output any differences, ignoring lines that start with '<footer id="last-change">'
		diff --ignore-matching-lines='^<footer id="last-change"' "$file1" "$file2" | awk -v RED="$RED" -v GREEN="$GREEN" -v NC="$NO_COLOR" '
            /^</ {print RED $0 NC; next}
            /^>/ {print GREEN $0 NC; next}
            {print}
        '
	else
		echo -e "${RED}File $file1 does not exist in $dir2${NO_COLOR}"
	fi
done
