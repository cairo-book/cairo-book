#!/bin/bash

IS_RUN_LOCALLY="$1"

GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

cd /cairo
mkdir -p output
rm -rf output/*

if [ "$IS_RUN_LOCALLY" = true ]; then
    echo -e "\nStarting Cairo programs verifier...\n"
else
    echo "# Cairo program verifier"
    echo ""
    echo "The list of cairo programs below is auto-generated from the markdown sources.  "
    echo "Any code block with a main function will be compiled (except if the attribute does_not_compile is manually added)."
    echo ""
fi

has_error=false

for prog in *.cairo; do
  cairo-run --available-gas=20000000 "$prog" > output/"$prog".out 2> output/"$prog".err

  compile_code="$?"

  err="$(cat output/$prog.err)"

  if [ $compile_code -ne 0 ]; then
      has_error=true

      if [ "$IS_RUN_LOCALLY" = true ]; then
          echo -e "\n---- ${RED}${prog}${NC} ----\n"
          echo "$err"
      else
          echo ":x: **$prog**"
          echo "<pre>$err</pre>"
      fi

      echo ""
      echo "---  "
      echo ""
  fi

done

if [ "$has_error" = false ] ; then
    if [ "$IS_RUN_LOCALLY" = true ]; then
        echo -e "\n${GREEN}All Cairo programs were compiled successfully${NC}.\n"
    else
        echo ":heavy_check_mark: All Cairo programs were compiled successfully."
        echo ""
    fi

    exit 0
else

    if [ "$IS_RUN_LOCALLY" = true ]; then
        echo -e "\n${RED}Some Cairo programs have errors, please check the list above.${NC}\n"
    else
        echo ":x: Some Cairo programs have errors, please check the list above."
        echo ""
    fi

    exit 1
fi
