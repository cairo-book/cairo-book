#!/bin/bash

IS_RUN_LOCALLY="$1"

GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

cd /cairo

if [ "$IS_RUN_LOCALLY" = true ]; then
    echo -e "\nStarting Cairo programs verifier...\n"
else
    echo "# Cairo program verifier"
    echo ""
    echo "The list of cairo programs below is auto-generated from the markdown sources."
    echo ""
fi

function run_cairo_checks() {
    local path="$1"
    local command="$2"
    local check_type="$3"
    error_count=0

    cd "./$path"
    mkdir -p output
    rm -rf output/*

    for prog in *.cairo; do
        if [ "$IS_RUN_LOCALLY" = true ]; then
            echo -ne "$check_type $prog ...\r"
        fi

        $command "$prog" > output/"$prog".out 2> output/"$prog".err
        exit_code="$?"

        if [ $exit_code -ne 0 ]; then
            err="$(cat output/$prog.err)"
            out="$(cat output/$prog.out)"
            error_count=$((error_count+1))

            if [ "$IS_RUN_LOCALLY" = true ]; then
                echo -ne "---- ${RED}./book/cairo/cairo-programs/$path/${prog}${NC} ----\r\n"
                echo -ne "${RED}Error: $err${NC}\n"
                echo "Output: $out"
            else
                echo ":x: **$prog**"
                echo "<pre>$err</pre>"
            fi
            echo ""
        fi
    done

    if [ "$IS_RUN_LOCALLY" = true ]; then # remove last line
        echo -ne "                  \r\n"
    fi
    cd ..
    return $error_count
}

run_cairo_checks "compilable" "cairo-compile" "(1/5) compilation"
compilable_error=$?
run_cairo_checks "runnable" "cairo-run --available-gas=20000000" "(2/5) execution"
runnable_error=$?
run_cairo_checks "testable" "cairo-test" "(3/5) tests"
testable_error=$?
run_cairo_checks "contracts" "starknet-compile" "(4/5) Starknet contracts"
contract_error=$?
run_cairo_checks "formats" "cairo-format --check --print-parsing-errors" "(5/5) Format"
format_error=$?

has_error=$((compilable_error + runnable_error + testable_error + contract_error + format_error))

function print_total() {
    local section="$1"
    local error_count="$2"
    printf "$([ $error_count -eq 0 ] && echo $GREEN || echo $RED)%-25s %s\n${NC}" "$section:" "$error_count"
}

echo "---"
echo ""
echo "Summary"
echo ""
print_total "Compilation" $compilable_error
print_total "Execution" $runnable_error
print_total "Tests" $testable_error
print_total "Starknet contracts" $contract_error
print_total "Format" $format_error
echo ""
print_total "Total" $has_error
echo ""


if [ "$has_error" -eq 0 ] ; then
    if [ "$IS_RUN_LOCALLY" = true ]; then
        echo -e "\n${GREEN}All checks passed and no problems found!${NC}.\n"
    else
        echo ":heavy_check_mark:"
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
