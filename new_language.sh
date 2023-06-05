LANG=$1
FILE=po/$LANG.po
OS=$(uname)

# Stop if no laguage input.
if [ $# -eq 0 ]
then
    echo ""
    echo "No input language, exit."
    exit 0
fi

#Linux
if [ "$OS" == "Linux" ]; then
    ARCH=$(uname -m)
    if which gettext > /dev/null; then
        echo "gettext exists"
    else
        # Install gettext
        echo ""
        echo "Warning: gettext not exists. Will run `sudo apt install gettext` install gettext."
        sudo apt install gettext
    fi

    # Download mdBook and extract it out
    if [ "$ARCH" == "aarch64" ]; then
        curl -L https://github.com/rust-lang/mdBook/releases/download/v0.4.30/mdbook-v0.4.30-aarch64-unknown-linux-musl.tar.gz | tar -xz
    else
        curl -L https://github.com/rust-lang/mdBook/releases/download/v0.4.30/mdbook-v0.4.30-x86_64-unknown-linux-musl.tar.gz | tar -xz
    fi
# MACOS
elif [ "$OS" == "Darwin" ]; then
    if which gettext > /dev/null; then
        echo "gettext exists"
    else
        # Install gettext
        echo ""
        echo "Warning: gettext not exists. Will run `brew install gettext` install gettext."
        brew install gettext
    fi
    # Download mdBook and extract it out
    curl -L https://github.com/rust-lang/mdBook/releases/download/v0.4.30/mdbook-v0.4.30-x86_64-apple-darwin.tar.gz | tar -xz
else
    echo "The operating system is not Linux or macOS."
    exit 0
fi

# Build a new LANGUAGES. po file if not exist .
if test -f "$FILE"; then
    echo ""
    echo "File $FILE already exists. Ensure you're initiating a new translation. Alternatively, use 'translations.sh' to serve an existing one."
else
    msginit -i po/messages.pot -l $LANG -o po/$LANG.po
fi
