#!/bin/bash

cd /cairo
mkdir -p output
rm -rf output/*

echo "# Cairo program verifier"
echo ""
echo "The list of cairo programs below is auto-generated from the markdown sources.  "
echo "Any code block with a main function will be compiled (except if the attribute `does_not_compile` is manually added)."
echo ""

has_error=false

for prog in *.cairo; do
  cairo-run "$prog" > output/"$prog".out 2> output/"$prog".err

  compile_code="$?"

  # Output is not displayed at the moment. Keep it commented for now.
  # o="$(cat output/$prog.out)"
  # # remove new lines and extra spaces.
  # o="${o//$'\n'/' '}"
  # o="$(echo $e | sed 's/  \+/ /g')"

  err="$(cat output/$prog.err)"

  if [ $compile_code -ne 0 ]; then
      has_error=true

      echo ":x: **$prog**"
      echo "<pre>$err</pre>"

      echo ""
      echo "---  "
      echo ""
  fi

done

if [ "$has_error" = false ] ; then
    echo ":heavy_check_mark: All Cairo programs were compiled successfully."
else
    echo ":x: Some Cairo programs have errors, please check the list above."    
fi

echo ""
