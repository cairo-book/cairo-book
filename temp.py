# import os
# import re

## Step 1: Identify and rename direct subfolders
# listings_path = "listings/"
# subfolders = [f.name for f in os.scandir(listings_path) if f.is_dir()]

# for subfolder in subfolders:
#     match = re.match(r"ch(\d+)-(.+)", subfolder)
#     if match:
#         chapter_number, chapter_name = match.groups()
#         chapter_number = int(chapter_number)
#         if chapter_number > 2 and chapter_number < 99:
#             new_chapter_number = chapter_number + 1
#             new_subfolder_name = f"ch{new_chapter_number:02}-{chapter_name}"
#             os.rename(os.path.join(listings_path, subfolder), os.path.join(listings_path, new_subfolder_name))

# # Step 2: Update references in markdown files
# for root, dirs, files in os.walk("."):
#     for file in files:
#         if file.endswith(".md"):
#             file_path = os.path.join(root, file)
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 content = f.read()
#             for subfolder in subfolders:
#                 match = re.match(r"ch(\d+)-(.+)", subfolder)
#                 if match:
#                     chapter_number, chapter_name = match.groups()
#                     chapter_number = int(chapter_number)
#                     if chapter_number > 2 and chapter_number < 99:
#                         new_chapter_number = chapter_number + 1
#                         new_subfolder_name = f"ch{new_chapter_number:02}-{chapter_name}"
#                         content = content.replace(subfolder, new_subfolder_name)
#             with open(file_path, 'w', encoding='utf-8') as f:
#                 f.write(content)



# # Step 2: Update references in markdown files
# for root, dirs, files in os.walk("."):
#     for file in files:
#         if file.endswith(".md"):
#             file_path = os.path.join(root, file)
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 content = f.read()

#             content = re.sub(r"Chapter (\d+)", lambda x: f"Chapter {int(x.group(1)) + 1}" if 2 < int(x.group(1)) < 99 else x.group(0), content)
#             content = re.sub(r"Listing (\d+)-(\d+)", lambda x: f"Listing {int(x.group(1)) + 1}-{x.group(2)}" if 2 < int(x.group(1)) < 99 else x.group(0), content)

#             with open(file_path, 'w', encoding='utf-8') as f:
#                 f.write(content)


import os
import re

# Step 3: Update chapter numbers in filenames in the src directory
src_path = "src/"
renamed_files = {}

# Identify and rename files first, and store the old and new names in a dictionary
for root, dirs, files in os.walk(src_path):
    for file in files:
        if file.endswith(".md"):
            match = re.match(r"ch(\d+)-(\d+)-(.+).md", file)
            if match:
                chapter_number, section_number, description = match.groups()
                chapter_number = int(chapter_number)
                if 3 < chapter_number < 99:
                    new_chapter_number = chapter_number + 1
                    new_filename = f"ch{new_chapter_number:02}-{section_number}-{description}.md"
                    os.rename(os.path.join(root, file), os.path.join(root, new_filename))
                    renamed_files[file] = new_filename

# # Update references in all .md files
# for root, dirs, files in os.walk("."):
#     for file in files:
#         if file.endswith(".md"):
#             file_path = os.path.join(root, file)
#             with open(file_path, 'r', encoding='utf-8') as f:
#                 content = f.read()
#             for old_name, new_name in renamed_files.items():
#                 content = content.replace(old_name, new_name)
#             with open(file_path, 'w', encoding='utf-8') as f:
#                 f.write(content)
