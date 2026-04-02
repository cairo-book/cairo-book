#!/bin/bash
set -e

VERSION=$1
COMMIT=$2

if [[ -z ${VERSION} ]] || [[ -z ${COMMIT} ]]; then
	echo "Usage: ./scripts/build-version.sh <version> <commit> [new-latest]"
	echo "Example: ./scripts/build-version.sh 2.13 99e952c8"
	echo "Example: ./scripts/build-version.sh 2.13 99e952c8 2.16  # also promote 2.16 to latest"
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

# Use the same mdbook version as CI (0.4.48) for theme compatibility
MDBOOK_VERSION="0.4.48"
MDBOOK_BIN="/tmp/mdbook-${MDBOOK_VERSION}"

if [[ ! -x ${MDBOOK_BIN} ]]; then
	echo ""
	echo "=== Downloading mdbook v${MDBOOK_VERSION} ==="
	ARCH=$(uname -m)
	OS=$(uname -s | tr '[:upper:]' '[:lower:]')
	if [[ ${OS} == "darwin" ]]; then
		PLATFORM="${ARCH}-apple-darwin"
	else
		PLATFORM="${ARCH}-unknown-linux-gnu"
	fi
	curl -sSL "https://github.com/rust-lang/mdBook/releases/download/v${MDBOOK_VERSION}/mdbook-v${MDBOOK_VERSION}-${PLATFORM}.tar.gz" | tar -xz -C /tmp/
	mv /tmp/mdbook "${MDBOOK_BIN}"
fi
echo "Using mdbook v${MDBOOK_VERSION}"

echo ""
echo "=== Removing custom preprocessors from book.toml ==="
if [[ -f "book.toml" ]]; then
	# Remove preprocessors that require external tools (cairo, quiz-cairo, gettext)
	sed -i.bak '/\[preprocessor\.quiz-cairo\]/,/^$/d' book.toml
	sed -i.bak '/\[preprocessor\.cairo\]/,/^$/d' book.toml
	sed -i.bak '/\[preprocessor\.gettext\]/,/^$/d' book.toml
	echo "Removed custom preprocessors"
else
	echo "WARNING: book.toml not found"
fi

echo ""
echo "=== Building book ==="
"${MDBOOK_BIN}" build -d book

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
NEW_LATEST=${3-}
node <<JSEOF
const fs = require('fs');
const versions = JSON.parse(fs.readFileSync('versions.json', 'utf8'));
const newVersion = "${VERSION}";
const newLatest = "${NEW_LATEST}";

// Check if version already exists
const exists = versions.versions.some(v => v.version === newVersion);
if (!exists) {
  versions.versions.push({
    version: newVersion,
    path: '/v' + newVersion + '/',
    label: newVersion
  });
  console.log('Added version ' + newVersion);
} else {
  console.log('Version ' + newVersion + ' already exists, skipping add');
}

// If a new latest version was specified, update labels and latest field
if (newLatest) {
  // Move old latest from root to its own /v<old>/ path
  const oldLatestEntry = versions.versions.find(v => v.path === '/');
  if (oldLatestEntry && oldLatestEntry.version !== newLatest) {
    oldLatestEntry.path = '/v' + oldLatestEntry.version + '/';
    oldLatestEntry.label = oldLatestEntry.version;
  }

  // Set root to new latest
  const newLatestEntry = versions.versions.find(v => v.version === newLatest);
  if (newLatestEntry) {
    newLatestEntry.path = '/';
    newLatestEntry.label = newLatest + ' (latest)';
  } else {
    versions.versions.unshift({
      version: newLatest,
      path: '/',
      label: newLatest + ' (latest)'
    });
  }

  versions.latest = newLatest;
  console.log('Updated latest to ' + newLatest);
}

// Sort versions descending (latest/root first, then by version number)
versions.versions.sort((a, b) => {
  if (a.path === '/') return -1;
  if (b.path === '/') return 1;
  return b.version.localeCompare(a.version, undefined, { numeric: true });
});

fs.writeFileSync('versions.json', JSON.stringify(versions, null, 2) + '\n');
JSEOF

git add versions.json
git commit --amend --no-edit
git push origin gh-pages

# Cleanup
git checkout "${CURRENT_BRANCH}"
git worktree remove "${WORKTREE_DIR}" --force 2>/dev/null || rm -rf "${WORKTREE_DIR}"

echo ""
echo "=== Done! Version ${VERSION} added to gh-pages ==="
