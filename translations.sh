LANG=$1

# Rebuild english version, updating the `messages.pot` file where all chunks of texts
# to be translated are extracted.
MDBOOK_OUTPUT='{"xgettext": {"pot-file": "messages.pot"}}' \
mdbook build -d po

# Build available LANGUAGES. po file must exist for the languages listed
# in the LANGUAGE file. If it's not, you can add a language by running (xx replaced by the language code):
# msginit -i po/messages.pot -l xx -o po/xx.po
for po_lang in $(cat ./LANGUAGES)
do
    echo merging and building "$po_lang"
    msgmerge --update po/"$po_lang".po po/messages.pot
    MDBOOK_BOOK__LANGUAGE="$po_lang" mdbook build -d book/"$po_lang"
done

# Serving the language, if any.
if [ $# -eq 0 ]
then
    echo ""
    echo "No input language, stop after build."
    exit 0
fi

# Serve the input language, if available.
MDBOOK_BOOK__LANGUAGE="$LANG" mdbook serve -d book/"$LANG"

