#!/bin/bash

cd /cairo
mkdir -p output
rm -rf output/*

echo "# Cairo program verifier"
echo ""
echo "The list of cairo programs below is auto-generated from the markdown sources.  "
echo "Any code block with the attribute \`file=filename.cairo\` will be extracted as"
echo "a standalone program and then compiled."

echo "| Cairo program | Result | Logs |"
echo "| :-----------: | :----: | :--- |"

for prog in *.cairo; do
  cairo-run "$prog" > output/"$prog".out 2>&1

  compile_code="$?"

  o="$(cat output/$prog.out)"
  # remove new lines and extra spaces.
  e="${o//$'\n'/' '}"
  e="$(echo $e | sed 's/  \+/ /g')"

  if [ $compile_code -eq 0 ]; then
      echo "| $prog | :heavy_check_mark: |  |"
  else
      echo "| $prog | :x: | <pre>$e</pre> |"
  fi

done

echo ""
