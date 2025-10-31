#!/usr/bin/env python3
"""
Cairo Listings Migration Tool to Executable Model

This script migrates Cairo crates to follow the proper executable model by:
1. Scanning all .cairo files in src/ directories for main functions
2. Adding #[executable] attributes where needed
3. Configuring Scarb.toml with appropriate targets and dependencies

MIGRATION RULES AND CASES:

1. STARKNET CONTRACTS (Priority 1 - Processed First)
   - Detection: Contains [[target.starknet-contract]] in Scarb.toml
   - Action: Ensure [cairo] section has enable-gas = true
   - Skip: All other executable processing (contracts don't need executable config)

2. EXECUTABLE PROGRAMS (Priority 2)
   - Detection: Contains fn main() functions in any .cairo file in src/
   - Actions for each main function:
     a) Add #[executable] attribute if missing
     b) Generate module path from file location:
        - lib.cairo -> uses parent directory as module
        - other files -> full path as module (e.g., utils/helper.cairo -> utils::helper)
   - Scarb.toml configuration:
     a) Add cairo_execute = "2.13.1" to [dependencies]
     b) Add [cairo] section with enable-gas = false
     c) Create [[target.executable]] sections for each main function:
        - name: Generated from module path (e.g., "utils_helper_main")
        - function: Full path including package name (e.g., "package_name::utils::helper::main")
   - Multiple main functions: Each gets its own [[target.executable]] with unique names

3. REGULAR LIBRARIES (Priority 3)
   - Detection: No fn main() functions and no Starknet contract target
   - Actions: Clean up any leftover executable configuration:
     a) Remove all [[target.executable]] sections
     b) Remove [executable] section (legacy)
     c) Remove cairo_execute dependency
     d) Remove enable-gas = false from [cairo] section (preserve other cairo settings)
     e) Remove empty [cairo] sections

TARGET GENERATION EXAMPLES:
- Single main in lib.cairo:
  [[target.executable]]
  name = "main"
  function = "package_name::main"

- Multiple mains in different modules:
  [[target.executable]]
  name = "safe_default_main"
  function = "package_name::safe_default::main"

  [[target.executable]]
  name = "state_machine_main"
  function = "package_name::state_machine::main"

PROCESSING ORDER:
1. Scan for Starknet contracts -> configure and exit if found
2. Scan all .cairo files for main functions
3. Add #[executable] attributes to all main functions
4. Configure Scarb.toml with multiple executable targets
5. If no main functions, clean up executable configuration

Usage: uv run migrate_to_executable.py
"""

import os
import re
import sys
from pathlib import Path
from typing import Optional, Tuple


def find_cairo_crates(listings_dir: Path) -> list[Path]:
    """Find all directories containing Scarb.toml files."""
    crates = []

    def scan_directory(directory: Path):
        try:
            for item in directory.iterdir():
                if item.is_file() and item.name == "Scarb.toml":
                    crates.append(directory)
                elif item.is_dir():
                    scan_directory(item)
        except PermissionError:
            print(f"Permission denied accessing {directory}")

    scan_directory(listings_dir)
    return crates


def find_all_cairo_files(src_dir: Path) -> list[Path]:
    """Find all .cairo files in the src directory."""
    cairo_files = []
    if not src_dir.exists():
        return cairo_files

    try:
        for item in src_dir.rglob("*.cairo"):
            if item.is_file():
                cairo_files.append(item)
    except Exception as e:
        print(f"Error scanning {src_dir}: {e}")

    return cairo_files


def find_main_functions_in_file(cairo_file: Path, src_dir: Path) -> list[dict]:
    """
    Find all main functions in a Cairo file and check if they have #[executable] attribute.

    Returns:
        List of dicts with keys: 'file_path', 'module_path', 'has_executable_attr', 'line_number'
    """
    if not cairo_file.exists():
        return []

    try:
        content = cairo_file.read_text(encoding='utf-8')
        lines = content.splitlines()

        main_functions = []

        # Create module path from file path
        relative_path = cairo_file.relative_to(src_dir)
        if relative_path.name == "lib.cairo":
            # For lib.cairo, use the parent directory name or empty if it's the root
            if relative_path.parent == Path('.'):
                module_path = ""
            else:
                module_path = str(relative_path.parent).replace('/', '::')
        else:
            # For other files, use the full path without .cairo extension
            module_path = str(relative_path.with_suffix('')).replace('/', '::')

        for i, line in enumerate(lines):
            # Look for fn main( pattern
            if re.search(r'fn\s+main\s*\(', line):
                # Check if previous lines have #[executable] attribute
                has_executable_attr = False
                for j in range(max(0, i-5), i):  # Check up to 5 lines before
                    if '#[executable]' in lines[j]:
                        has_executable_attr = True
                        break

                main_functions.append({
                    'file_path': cairo_file,
                    'module_path': module_path,
                    'has_executable_attr': has_executable_attr,
                    'line_number': i + 1
                })

        return main_functions

    except Exception as e:
        print(f"Error reading {cairo_file}: {e}")
        return []


def find_all_main_functions(src_dir: Path) -> list[dict]:
    """Find all main functions in all Cairo files in src directory."""
    all_main_functions = []

    cairo_files = find_all_cairo_files(src_dir)
    for cairo_file in cairo_files:
        main_functions = find_main_functions_in_file(cairo_file, src_dir)
        all_main_functions.extend(main_functions)

    return all_main_functions


def add_executable_attribute_to_main(main_func_info: dict) -> bool:
    """Add #[executable] attribute to a specific main function if missing."""
    cairo_file = main_func_info['file_path']
    line_number = main_func_info['line_number']

    try:
        content = cairo_file.read_text(encoding='utf-8')
        lines = content.splitlines()

        # Find the specific main function at the given line number
        main_line_idx = line_number - 1  # Convert to 0-based index

        if main_line_idx >= len(lines):
            return False

        main_line = lines[main_line_idx]

        # Check if there's already an #[executable] attribute before this main function
        for i in range(max(0, main_line_idx-5), main_line_idx):
            if '#[executable]' in lines[i]:
                return False  # Already has attribute

        # Get the indentation of the main function
        indentation = ''
        for char in main_line:
            if char in [' ', '\t']:
                indentation += char
            else:
                break

        # Insert #[executable] attribute before the main function
        lines.insert(main_line_idx, f"{indentation}#[executable]")

        # Write back the modified content
        new_content = '\n'.join(lines)
        cairo_file.write_text(new_content, encoding='utf-8')
        return True

    except Exception as e:
        print(f"Error modifying {cairo_file}: {e}")
        return False


def parse_scarb_toml(scarb_path: Path) -> dict:
    """Parse Scarb.toml file into a simple dictionary structure."""
    if not scarb_path.exists():
        return {}

    try:
        content = scarb_path.read_text(encoding='utf-8')
        result = {}
        current_section = None

        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue

            # Section headers
            if line.startswith('[') and line.endswith(']'):
                current_section = line[1:-1]
                if current_section not in result:
                    result[current_section] = {}
                continue

            # Key-value pairs
            if '=' in line and current_section:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip().strip('"')
                result[current_section][key] = value

        return result

    except Exception as e:
        print(f"Error parsing {scarb_path}: {e}")
        return {}


def has_starknet_contract_target(scarb_path: Path) -> bool:
    """Check if Scarb.toml has [[target.starknet-contract]] section."""
    if not scarb_path.exists():
        return False

    try:
        content = scarb_path.read_text(encoding='utf-8')
        return '[[target.starknet-contract]]' in content
    except Exception as e:
        print(f"Error reading {scarb_path}: {e}")
        return False


def add_starknet_contract_config(scarb_path: Path) -> bool:
    """Add [cairo] enable-gas=true for Starknet contracts."""
    try:
        content = scarb_path.read_text(encoding='utf-8')

        # Check if already has cairo section with enable-gas = true
        has_cairo_section = '[cairo]' in content
        has_enable_gas_true = 'enable-gas = true' in content

        if has_cairo_section and has_enable_gas_true:
            return False  # Already configured

        lines = content.splitlines()
        new_lines = []
        cairo_section_found = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Handle cairo section
            if stripped == '[cairo]':
                cairo_section_found = True
                new_lines.append(line)

                # Check if enable-gas setting exists in this section
                j = i + 1
                enable_gas_exists = False
                while j < len(lines) and not lines[j].strip().startswith('['):
                    if 'enable-gas' in lines[j]:
                        enable_gas_exists = True
                        # Replace with enable-gas = true
                        lines[j] = 'enable-gas = true'
                        break
                    j += 1

                if not enable_gas_exists:
                    new_lines.append('enable-gas = true')
                continue

            new_lines.append(line)

        # Add cairo section if it doesn't exist
        if not cairo_section_found:
            new_lines.append('')
            new_lines.append('[cairo]')
            new_lines.append('enable-gas = true')

        new_content = '\n'.join(new_lines)
        if new_content != content:
            scarb_path.write_text(new_content, encoding='utf-8')
            return True

        return False

    except Exception as e:
        print(f"Error modifying {scarb_path}: {e}")
        return False


def add_multiple_executable_config(scarb_path: Path, main_functions: list[dict]) -> bool:
    """Add multiple [[target.executable]] sections, cairo_execute dependency, and cairo enable-gas=false to Scarb.toml."""
    try:
        content = scarb_path.read_text(encoding='utf-8')

        # Check if already has all required configuration
        # Extract package name from [package] section
        package_name = ""
        lines = content.splitlines()
        for line in lines:
            stripped = line.strip()
            if stripped.startswith('name = '):
                package_name = stripped.split('=')[1].strip().strip('"')
                break
        has_cairo_execute_dep = 'cairo_execute' in content
        has_cairo_section = '[cairo]' in content
        has_enable_gas_false = 'enable-gas = false' in content

        lines = content.splitlines()
        new_lines = []
        dependencies_found = False
        cairo_section_found = False

        # Remove any existing [[target.executable]] sections first
        skip_target_executable = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Skip existing [[target.executable]] sections
            if stripped.startswith('[[target.executable]]'):
                skip_target_executable = True
                continue

            # Check for new section that's not target.executable
            if stripped.startswith('[[') or stripped.startswith('['):
                if not stripped.startswith('[[target.executable]]'):
                    skip_target_executable = False

            if skip_target_executable:
                continue

            # Handle dependencies section
            if stripped == '[dependencies]':
                dependencies_found = True
                new_lines.append(line)

                # Check if cairo_execute is already in this section
                j = i + 1
                cairo_execute_exists = False
                while j < len(lines) and not lines[j].strip().startswith('['):
                    if 'cairo_execute' in lines[j]:
                        cairo_execute_exists = True
                        break
                    j += 1

                if not cairo_execute_exists:
                    new_lines.append('cairo_execute = "2.13.1"')
                continue

            # Handle cairo section
            if stripped == '[cairo]':
                cairo_section_found = True
                new_lines.append(line)

                # Check if enable-gas = false is already in this section
                j = i + 1
                enable_gas_exists = False
                while j < len(lines) and not lines[j].strip().startswith('['):
                    if 'enable-gas' in lines[j]:
                        enable_gas_exists = True
                        break
                    j += 1

                if not enable_gas_exists:
                    new_lines.append('enable-gas = false')
                continue

            new_lines.append(line)

        # Add dependencies section if it doesn't exist
        if not dependencies_found:
            new_lines.append('')
            new_lines.append('[dependencies]')
            new_lines.append('cairo_execute = "2.13.1"')

        # Add cairo section if it doesn't exist
        if not cairo_section_found:
            new_lines.append('')
            new_lines.append('[cairo]')
            new_lines.append('enable-gas = false')

        # Add executable targets for each main function
        for i, main_func in enumerate(main_functions):
            new_lines.append('')
            new_lines.append('[[target.executable]]')

            # Generate target name
            if main_func['module_path']:
                target_name = f"{main_func['module_path'].replace('::', '_')}_main"
                function_path = f"{package_name}::{main_func['module_path']}::main"
            else:
                target_name = "main"
                function_path = f"{package_name}::main"

            # If multiple main functions, add index to make names unique
            if len(main_functions) > 1:
                if target_name == "main":
                    target_name = f"main_{i+1}"
                else:
                    target_name = f"{target_name}_{i+1}" if i > 0 else target_name

            new_lines.append(f'name = "{target_name}"')
            new_lines.append(f'function = "{function_path}"')

        new_content = '\n'.join(new_lines)
        if new_content != content:
            scarb_path.write_text(new_content, encoding='utf-8')
            return True

        return False

    except Exception as e:
        print(f"Error modifying {scarb_path}: {e}")
        return False


def add_executable_config(scarb_path: Path) -> bool:
    """Add [executable] section, cairo_execute dependency, and cairo enable-gas=false to Scarb.toml."""
    try:
        content = scarb_path.read_text(encoding='utf-8')

        # Check if already has all required configuration
        has_executable_section = '[executable]' in content
        has_cairo_execute_dep = 'cairo_execute' in content
        has_cairo_section = '[cairo]' in content
        has_enable_gas_false = 'enable-gas = false' in content

        if has_executable_section and has_cairo_execute_dep and has_cairo_section and has_enable_gas_false:
            return False  # Already fully configured

        lines = content.splitlines()
        new_lines = []
        dependencies_found = False
        cairo_section_found = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Handle dependencies section
            if stripped == '[dependencies]':
                dependencies_found = True
                new_lines.append(line)

                # Check if cairo_execute is already in this section
                j = i + 1
                cairo_execute_exists = False
                while j < len(lines) and not lines[j].strip().startswith('['):
                    if 'cairo_execute' in lines[j]:
                        cairo_execute_exists = True
                        break
                    j += 1

                if not cairo_execute_exists:
                    new_lines.append('cairo_execute = "2.13.1"')
                continue

            # Handle cairo section
            if stripped == '[cairo]':
                cairo_section_found = True
                new_lines.append(line)

                # Check if enable-gas = false is already in this section
                j = i + 1
                enable_gas_exists = False
                while j < len(lines) and not lines[j].strip().startswith('['):
                    if 'enable-gas' in lines[j]:
                        enable_gas_exists = True
                        break
                    j += 1

                if not enable_gas_exists:
                    new_lines.append('enable-gas = false')
                continue

            new_lines.append(line)

        # Add dependencies section if it doesn't exist
        if not dependencies_found:
            new_lines.append('')
            new_lines.append('[dependencies]')
            new_lines.append('cairo_execute = "2.13.1"')

        # Add cairo section if it doesn't exist
        if not cairo_section_found:
            new_lines.append('')
            new_lines.append('[cairo]')
            new_lines.append('enable-gas = false')

        # Add executable section if missing
        if not has_executable_section:
            new_lines.append('')
            new_lines.append('[executable]')

        new_content = '\n'.join(new_lines)
        if new_content != content:
            scarb_path.write_text(new_content, encoding='utf-8')
            return True

        return False

    except Exception as e:
        print(f"Error modifying {scarb_path}: {e}")
        return False


def check_and_remove_legacy_executable(scarb_path: Path) -> bool:
    """Check if Scarb.toml has both [executable] and [[target.executable]] sections, and remove [executable] if so."""
    try:
        content = scarb_path.read_text(encoding='utf-8')

        has_executable_section = '[executable]' in content
        has_target_executable_section = '[[target.executable]]' in content

        if has_executable_section and has_target_executable_section:
            print("    ⚠ Found both [executable] and [[target.executable]] sections")
            print("    + Removing legacy [executable] section")

            lines = content.splitlines()
            new_lines = []
            skip_executable_section = False

            for line in lines:
                stripped = line.strip()

                # Check for [executable] section
                if stripped == '[executable]':
                    skip_executable_section = True
                    continue

                # Check for new section (not executable)
                if stripped.startswith('[') and stripped != '[executable]':
                    skip_executable_section = False

                # Skip lines in [executable] section
                if skip_executable_section:
                    continue

                new_lines.append(line)

            new_content = '\n'.join(new_lines)
            if new_content != content:
                scarb_path.write_text(new_content, encoding='utf-8')
                return True

        return False

    except Exception as e:
        print(f"Error checking/removing legacy executable config in {scarb_path}: {e}")
        return False


def remove_executable_config(scarb_path: Path) -> bool:
    """Remove [[target.executable]] sections, [executable] section, cairo_execute dependency, and cairo enable-gas=false setting from Scarb.toml."""
    try:
        content = scarb_path.read_text(encoding='utf-8')
        lines = content.splitlines()
        new_lines = []
        skip_section = False
        current_section = None
        cairo_section_lines = []
        in_cairo_section = False
        skip_target_executable = False

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Track current section
            if stripped.startswith('[') and stripped.endswith(']'):
                # If we were in a cairo section, process it
                if in_cairo_section:
                    # Filter out enable-gas = false, keep other settings
                    filtered_cairo_lines = []
                    for cairo_line in cairo_section_lines:
                        if 'enable-gas' in cairo_line and 'false' in cairo_line:
                            continue  # Remove enable-gas = false
                        filtered_cairo_lines.append(cairo_line)

                    # Only add cairo section if it has content after filtering
                    if filtered_cairo_lines:
                        new_lines.append('[cairo]')
                        new_lines.extend(filtered_cairo_lines)

                    cairo_section_lines = []
                    in_cairo_section = False

                current_section = stripped[1:-1] if not stripped.startswith('[[') else stripped[2:-2]

            # Check for [[target.executable]] section
            if stripped.startswith('[[target.executable]]'):
                skip_target_executable = True
                continue

            # Check for [executable] section
            if stripped == '[executable]':
                skip_section = True
                continue

            # Check for [cairo] section
            if stripped == '[cairo]':
                in_cairo_section = True
                continue

            # Check for new section (not executable or target.executable)
            if stripped.startswith('[') and not stripped.startswith('[[target.executable]]') and stripped != '[executable]':
                skip_section = False
                skip_target_executable = False

            # Skip lines in [executable] section
            if skip_section and current_section == 'executable':
                continue

            # Skip lines in [[target.executable]] section
            if skip_target_executable:
                continue

            # Handle cairo section content
            if in_cairo_section:
                cairo_section_lines.append(line)
                continue

            # Remove cairo_execute dependency
            if 'cairo_execute' in line and '=' in line:
                continue

            new_lines.append(line)

        # Handle cairo section if it was at the end of file
        if in_cairo_section:
            filtered_cairo_lines = []
            for cairo_line in cairo_section_lines:
                if 'enable-gas' in cairo_line and 'false' in cairo_line:
                    continue  # Remove enable-gas = false
                filtered_cairo_lines.append(cairo_line)

            # Only add cairo section if it has content after filtering
            if filtered_cairo_lines:
                new_lines.append('[cairo]')
                new_lines.extend(filtered_cairo_lines)

        # Write back only if changes were made
        new_content = '\n'.join(new_lines)
        if new_content != content:
            scarb_path.write_text(new_content, encoding='utf-8')
            return True

        return False

    except Exception as e:
        print(f"Error modifying {scarb_path}: {e}")
        return False


def process_crate(crate_path: Path) -> None:
    """Process a single Cairo crate."""
    print(f"\nProcessing crate: {crate_path}")

    src_dir = crate_path / "src"
    scarb_toml_path = crate_path / "Scarb.toml"

    # First, check and remove legacy [executable] section if [[target.executable]] exists
    print("  + Checking for conflicting executable configurations")
    if check_and_remove_legacy_executable(scarb_toml_path):
        print("    ✓ Removed legacy [executable] section")
    else:
        print("    ✓ No conflicting executable configurations found")

    # Check for Starknet contracts first
    is_starknet_contract = has_starknet_contract_target(scarb_toml_path)
    if is_starknet_contract:
        print("  ✓ Found Starknet contract target")
        print("  + Ensuring Scarb.toml has Starknet contract configuration")
        if add_starknet_contract_config(scarb_toml_path):
            print("    ✓ Added [cairo] enable-gas = true for Starknet contract")
        else:
            print("    ✓ Scarb.toml already has correct Starknet contract configuration")
        return  # Don't process as executable if it's a Starknet contract

    # Find all main functions in all Cairo files
    main_functions = find_all_main_functions(src_dir)

    if main_functions:
        print(f"  ✓ Found {len(main_functions)} main function(s) in src directory")

        # Add #[executable] attribute to each main function that doesn't have it
        functions_modified = 0
        for main_func in main_functions:
            if not main_func['has_executable_attr']:
                print(f"    + Adding #[executable] attribute to main in {main_func['file_path'].name}")
                if add_executable_attribute_to_main(main_func):
                    print(f"      ✓ Added #[executable] attribute at line {main_func['line_number']}")
                    main_func['has_executable_attr'] = True  # Update the flag
                    functions_modified += 1
                else:
                    print(f"      ⚠ Failed to add #[executable] attribute")
            else:
                print(f"    ✓ #[executable] attribute already present in {main_func['file_path'].name}")

        # Configure Scarb.toml with multiple executable targets
        print("  + Configuring Scarb.toml with executable targets")
        if add_multiple_executable_config(scarb_toml_path, main_functions):
            print("    ✓ Added executable configuration to Scarb.toml")
            print("      - Added [[target.executable]] sections")
            print("      - Added cairo_execute = \"2.13.1\" dependency")
            print("      - Added [cairo] enable-gas = false")
            for main_func in main_functions:
                if main_func['module_path']:
                    target_name = f"{main_func['module_path'].replace('::', '_')}_main"
                    function_path = f"{main_func['module_path']}::main"
                else:
                    target_name = "main"
                    function_path = "main"
                print(f"      - Target: {target_name} -> {function_path}")
        else:
            print("    ✓ Scarb.toml already has complete executable configuration")

    else:
        print("  - No main functions found in src directory")

        # Check if Scarb.toml has executable config that should be removed
        scarb_config = parse_scarb_toml(scarb_toml_path)
        has_executable_section = 'executable' in scarb_config
        has_cairo_execute_dep = (
            'dependencies' in scarb_config and
            'cairo_execute' in scarb_config['dependencies']
        )
        has_enable_gas_false = (
            'cairo' in scarb_config and
            'enable-gas' in scarb_config['cairo'] and
            scarb_config['cairo']['enable-gas'] == 'false'
        )

        if has_executable_section or has_cairo_execute_dep or has_enable_gas_false:
            print("  - Removing executable configuration from Scarb.toml")
            if remove_executable_config(scarb_toml_path):
                print("    ✓ Removed executable configuration")
            else:
                print("    ⚠ Failed to remove executable configuration")
        else:
            print("  ✓ No executable configuration to remove")


def main():
    """Main function."""
    script_dir = Path(__file__).parent
    listings_dir = script_dir / "../listings"

    if not listings_dir.exists():
        print(f"Error: listings directory not found at {listings_dir}")
        sys.exit(1)

    print(f"Scanning for Cairo crates in {listings_dir}")

    crates = find_cairo_crates(listings_dir)

    if not crates:
        print("No Cairo crates found!")
        return

    print(f"Found {len(crates)} Cairo crates")

    for crate_path in sorted(crates):
        process_crate(crate_path)

    print(f"\n✓ Processed {len(crates)} crates")


if __name__ == "__main__":
    main()
