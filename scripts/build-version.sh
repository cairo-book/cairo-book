#!/bin/bash
set -e

VERSION=$1
COMMIT=$2

if [[ -z ${VERSION} ]] || [[ -z ${COMMIT} ]]; then
	echo "Usage: ./scripts/build-version.sh <version> <commit>"
	echo "Example: ./scripts/build-version.sh 2.12 2a677472"
	exit 1
fi

echo "=== Building version ${VERSION} from commit ${COMMIT} ==="

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Create a temporary worktree for the historical version
WORKTREE_DIR="/tmp/cairo-book-${VERSION}"
rm -rf "${WORKTREE_DIR}"
git worktree add -f "${WORKTREE_DIR}" "${COMMIT}" --detach

cd "${WORKTREE_DIR}"

# Check .tool-versions and install dependencies
echo ""
echo "=== Tool versions at this commit ==="
if [[ -f .tool-versions ]]; then
	cat .tool-versions
	echo ""
	echo "=== Installing dependencies with asdf ==="
	while IFS= read -r line; do
		if [[ -n ${line} ]]; then
			echo "Installing: ${line}"
			asdf install "${line}"
			asdf global "${line}"
		fi
	done <.tool-versions
else
	echo "No .tool-versions file"
fi
echo ""

echo ""
echo "=== Removing quiz-cairo preprocessor from book.toml ==="
if [[ -f "book.toml" ]]; then
	# Remove the quiz-cairo preprocessor section
	sed -i.bak '/\[preprocessor\.quiz-cairo\]/,/^$/d' book.toml
	echo "Removed quiz-cairo preprocessor"
else
	echo "WARNING: book.toml not found"
fi

echo ""
echo "=== Building book ==="
mdbook build -d book

if [[ ! -d "book/html" ]]; then
	echo "ERROR: book/html not found. Build may have failed."
	exit 1
fi

echo ""
echo "=== Copying to gh-pages ==="
cd -
git checkout gh-pages

rm -rf "v${VERSION}"
cp -r "${WORKTREE_DIR}/book/html" "v${VERSION}"

git add "v${VERSION}"
git commit -m "Add documentation for Cairo ${VERSION}"

echo ""
echo "=== Updating versions.json ==="
node <<JSEOF
const fs = require('fs');
const versions = JSON.parse(fs.readFileSync('versions.json', 'utf8'));
const newVersion = "${VERSION}";

// Check if version already exists
const exists = versions.versions.some(v => v.version === newVersion);
if (!exists) {
  versions.versions.push({
    version: newVersion,
    path: '/v' + newVersion + '/',
    label: newVersion
  });

  // Sort versions descending (latest first, then by version number)
  versions.versions.sort((a, b) => {
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  fs.writeFileSync('versions.json', JSON.stringify(versions, null, 2));
  console.log('Added version ' + newVersion);
} else {
  console.log('Version ' + newVersion + ' already exists, skipping');
}
JSEOF

git add versions.json
git commit --amend --no-edit
git push origin gh-pages

# Cleanup
git checkout "${CURRENT_BRANCH}"
git worktree remove "${WORKTREE_DIR}" --force 2>/dev/null || rm -rf "${WORKTREE_DIR}"

echo ""
echo "=== Done! Version ${VERSION} added to gh-pages ==="
