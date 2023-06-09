#!/bin/bash

# the directory to scan
dir_path="listings/ch02-common-programming-concepts"

# iterate over each file in the directory
for old_file in "$dir_path"/*; do
    # get only the filename, not the whole path
    filename=$(basename -- "$old_file")
    
    # replace '-' with '_' in the filename
    new_filename="${filename//-/_}"
    
    # get the directory name from the full path
    directory=$(dirname -- "$old_file")
    
    # create new file path with changed filename
    new_file="$directory/$new_filename"
    
    # rename the file if the name has changed
    if [[ "$old_file" != "$new_file" ]]; then
        mv "$old_file" "$new_file"
    fi
done
