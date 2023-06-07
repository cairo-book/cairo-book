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
            error_count=$((error_count+1))

            if [ "$IS_RUN_LOCALLY" = true ]; then
                echo -ne "---- ${RED}./book/cairo/cairo-programs/$path/${prog}${NC} ----\r\n"
                echo "$err"
            else
                echo ":x: **$prog**"
                echo "<pre>$err</pre>"
            fi
            echo ""
        fi
    done

    cd ..
    return $error_count
}

# compilable_error=$(run_cairo_checks "compilable" "cairo-compile" "compilation")
# runnable_error=$(run_cairo_checks "runnable" "cairo-run --available-gas=20000000" "run")
# testable_error=$(run_cairo_checks "testable" "cairo-test" "test")
run_cairo_checks "contracts" "starknet-compile" "contract"
contract_error=$?
# format_error=$(run_cairo_checks "format" "cairo-format --check --print-parsing-errors" "format")

#has_error=$((has_compilable_error + has_runnable_error + has_testable_error + has_contract_error + has_format_error))
has_error=$((contract_error))

function print_total() {
    local section="$1"
    local error_count="$2"
    echo -e "$([ $contract_error -eq 0 ] && echo $GREEN || echo $RED)$section: $error_count${NC}"
}

echo "---"
echo ""
echo "Summary:"
echo ""
# echo "Compilable: $compilable_error"
# echo "Runnable: $runnable_error"
# echo "Test: $testable_error"
print_total "Contract" $contract_error
# echo "Format: $format_error"
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
