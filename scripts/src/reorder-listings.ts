import fs from "fs";
import * as path from "path";
import {
  findFileIncludingString,
  getChapterNumber,
  printDiff,
  renameListing,
} from "./utils";
import prompts from "prompts";

/**
 * Used to interrupt the prompts library when the user presses Ctrl+C.
 */
const enableTerminalCursor = () => {
  process.stdout.write("\x1B[?25h");
};

const onState = (state: any) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    enableTerminalCursor();
    process.stdout.write("\n");
    process.exit(1);
  }
};

/**
 * Reorders the listings in each chapter file in the source directory.
 * It iterates over each chapter in the source directory.
 * The processing involves reading each chapter's content and replacing
 * any listing captions that don't match the chapter number and are not in correct order.
 *
 * Because chapter are split in multiple files, we need to keep track of the
 * expected listing number for each chapter. We do this by passing the
 * expectedListingNumber to the processFile function. If the file has been updated,
 * we re-read the file content with the same expectedListingNumber, as there could have
 * been conflicting changes.
 *
 * Since we are renaming listing folders, we might have conflicts with existing folders.
 * Thus, we add a suffix _tmp to the renamings, process the entire chapter,
 * and only then commit the tmp folders.
 *
 *
 * @param srcFolderPath - The path to the source directory containing the chapter files.
 * @param listingsFolderPath - The path to the listings directory.
 * @returns A promise that resolves when all files have been processed.
 */
export async function reorderListings(
  srcFolderPath: string,
  listingsFolderPath: string,
) {
  const chapterFiles = fs
    .readdirSync(srcFolderPath)
    .filter((file) => file.startsWith("ch") && file.endsWith(".md"))
    .sort();

  // First listing is always 1
  let expectedListingNumber = 1;
  let currentChapter = 0;

  for (const file of chapterFiles) {
    const chapterNumber = getChapterNumber(file);
    if (chapterNumber === null) {
      console.log(
        `Warning: File ${file} doesn't match expected format (chX.md)`,
      );
      return false;
    }
    if (chapterNumber !== currentChapter) {
      // Commit any pending folder renames before moving to the next chapter
      commitFolderRenames(listingsFolderPath);
      currentChapter = chapterNumber;
      expectedListingNumber = 1; // Reset to 1 when the chapter changes
    }

    let contentChanged;
    do {
      let { updated, nextListingNumber } = await processFile(
        srcFolderPath,
        listingsFolderPath,
        file,
        expectedListingNumber, // Pass expectedListingNumber to processFile
      );
      if (!updated) {
        // If the content didn't change, we can move to the next expected listing number
        expectedListingNumber = nextListingNumber;
      }

      // If the content changed, we need to re-read the file content with the same
      // expectedListingNumber to ensure that the rest of the listings are in order, post-modification.
      contentChanged = updated;
    } while (contentChanged);
  }
  commitFolderRenames(listingsFolderPath); // final commit
}

/**
 * Processes a chapter file in the source directory.
 * It reads the file content and checks each listing caption in the content.
 * If the listing number in the caption doesn't match the expected listing number, it processes the caption and updates the content.
 * If any changes are made, the function writes the updated content back to the file.
 *
 *
 * @param srcFolderPath - The path to the source directory containing the chapter files.
 * @param listingsFolderPath - The path to the listings directory.
 * @param file - The name of the chapter file.
 * @param expectedListingNumber - The expected listing number.
 * @returns An object containing a boolean indicating whether the content was updated, and the next expected listing number.
 */
async function processFile(
  srcFolderPath: string,
  listingsFolderPath: string,
  file: string,
  expectedListingNumber: number,
): Promise<{ updated: boolean; nextListingNumber: number }> {
  let updated = false;
  const chapterNumber = getChapterNumber(file);
  if (chapterNumber === null) {
    console.log(`Warning: File ${file} doesn't match expected format (chX.md)`);
    return { updated, nextListingNumber: expectedListingNumber };
  }

  const filePath = path.join(srcFolderPath, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Search the folder containing listings for this chapter.
  const paddedChapterNumber = chapterNumber.toString().padStart(2, "0");
  const searchString = `ch${paddedChapterNumber}`;
  const chapterListingsFolder = findFileIncludingString(
    listingsFolderPath,
    searchString,
  );
  if (!chapterListingsFolder) {
    console.log(
      `Warning: No listings folder found for chapter ${chapterNumber}`,
    );
    return { updated: false, nextListingNumber: expectedListingNumber };
  }

  const regex = /<span class="caption">Listing (\d+)-(\d+)/g;
  let match;

  // For each listings caption in the file, process it
  // which involves checking if the listing number matches the expected listing number
  // and updates the content if not.
  while ((match = regex.exec(content)) !== null) {
    const result = await processListingCaption(
      match,
      content,
      chapterNumber,
      expectedListingNumber,
      srcFolderPath,
      listingsFolderPath,
      chapterListingsFolder,
      file,
    );
    // Content is updated with the eventual updated content from processListingCaption
    content = result.content;
    updated = result.updated || updated;
    expectedListingNumber++;
  }

  if (updated) {
    fs.writeFileSync(filePath, content, "utf8");
    return { updated: true, nextListingNumber: expectedListingNumber };
  }

  return { updated: false, nextListingNumber: expectedListingNumber };
}

/**
 * Processes a listing caption in a chapter file.
 * It checks if the listing number in the caption matches the expected listing number.
 * If it doesn't, the function finds the last occurrence of the listing reference
 * before the current caption, and renames the corresponding listing folder to the correct number.
 * It then updates the caption in the file content to reflect the new listing number.
 *
 * @param match - The result of the RegExp execution on the listing caption.
 * @param content - The content of the chapter file.
 * @param currentChapter - The current chapter number.
 * @param expectedListingNumber - The expected listing number.
 * @param srcFolderPath - The path to the source directory containing the chapter files.
 * @param listingsFolderPath - The path to the listings directory.
 * @param listingsFolder - The name of the listings folder.
 * @param file - The name of the chapter file.
 * @returns An object containing a boolean indicating whether the content was updated, and the updated content.
 */
async function processListingCaption(
  match: RegExpExecArray,
  content: string,
  currentChapter: number,
  expectedListingNumber: number,
  srcFolderPath: string,
  listingsFolderPath: string,
  listingsFolder: string,
  file: string,
): Promise<{ updated: boolean; content: string }> {
  const listingNumber = match[2];
  const listingNum = parseInt(listingNumber, 10);
  let updated = false;

  if (listingNum !== expectedListingNumber) {
    // Find the last occurrence of the listing reference before the current caption
    const contentBeforeCaption = content.substring(0, match.index);
    const folderNameRegex = new RegExp(
      `${listingsFolder}/(listing_\\d+_\\d+)`,
      "g",
    );
    let lastIncludeMatch;
    let includeMatch;
    while (
      (includeMatch = folderNameRegex.exec(contentBeforeCaption)) !== null
    ) {
      lastIncludeMatch = includeMatch;
    }
    if (!lastIncludeMatch) {
      console.log(
        `Warning: No include found for listing ${listingNumber} in file ${file}`,
      );
      return { updated, content };
    }

    // Find the folder name used for this listing, in the snippet just above
    // the current listing caption
    let oldFolderName = "";
    if (lastIncludeMatch && lastIncludeMatch[1]) {
      oldFolderName = lastIncludeMatch[1];
    }

    // Prepare the new folder name to update
    const paddedChapterNumber = currentChapter.toString().padStart(2, "0");
    const paddedNewListingNumber = expectedListingNumber
      .toString()
      .padStart(2, "0");
    const newFolderName = `listing_${paddedChapterNumber}_${paddedNewListingNumber}`;
    const chapterListingsFolder = path.join(listingsFolderPath, listingsFolder);

    // Search inside the chapterListingsFolder for a file containing the oldFolderName
    oldFolderName = findFileIncludingString(
      chapterListingsFolder,
      oldFolderName,
    )!;

    if (!oldFolderName) {
      console.log(`No file found including string: ${oldFolderName}`);
      return { updated, content };
    }
    const oldFolderPath = path.join(chapterListingsFolder, oldFolderName);

    // Ask validation before renaming
    // Skip 3 lines in console
    process.stdout.write("\n\n\n");
    const renameResponse = await prompts({
      type: "confirm",
      name: "rename",
      message: `Listing ${match[1]}-${match[2]} in file ${file} should be Listing ${currentChapter}-${expectedListingNumber}.
Rename and move source from ${oldFolderName} to ${newFolderName}?`,
      onState,
    });
    if (!renameResponse.rename) {
      return { updated, content };
    }
    await renameListing(
      srcFolderPath,
      currentChapter,
      oldFolderPath,
      oldFolderName,
      newFolderName,
      true,
    );
    content = fs.readFileSync(path.join(srcFolderPath, file), "utf8");

    // Update the caption in the current file's content
    const newListing = `Listing ${currentChapter}-${expectedListingNumber}`;
    const newCaption = `<span class="caption">${newListing}`;
    const oldContent = content;
    content = content.replace(match[0], newCaption);

    //TODO: make global over all files
    // Search for all mentions to this listing in the current file's content
    // Listing ${match[1]}-${match[2]}
    // and replace it with the new listing number
    //TODO: add a prompt for each change
    const mentionsRegex = new RegExp(`Listing ${match[1]}-${match[2]}`, "g");
    const updatedContent = content.replace(mentionsRegex, newListing);

    // Show the difference
    printDiff(content, updatedContent);

    // Ask for user confirmation
    const renameReference = await prompts({
      type: "confirm",
      name: "rename",
      message: "Found a reference. Do you want to rename it?",
    });

    if (renameReference.rename) {
      content = updatedContent; // Apply the change
    } else {
      console.log("Change skipped.");
    }

    updated = true;
  }

  return { updated, content };
}

/**
 * Fixes the chapter number in listings captions for each chapter file in the source directory.
 * It iterates over each file in the source directory, and if it finds a
 * file that starts with "ch" and ends with ".md", it processes that file.
 *
 * The processing involves reading the file content and replacing any listing
 * captions that don't match the chapter number. If any changes are made,
 * the function writes the updated content back to the file and logs the changes.
 *
 * @param srcFolderPath - The path to the source directory containing the chapter files.
 */
export function fixListingsChapterNumber(srcFolderPath: string) {
  const files = fs.readdirSync(srcFolderPath);

  for (const file of files) {
    if (file.startsWith("ch") && file.endsWith(".md")) {
      const filePath = path.join(srcFolderPath, file);
      const chapterMatch = file.match(/ch(\d+)/);
      if (!chapterMatch) {
        console.log(
          `Warning: File ${file} doesn't match expected format (chX.md)`,
        );
        continue;
      }
      const chapterNumber = parseInt(chapterMatch[1], 10);

      let content = fs.readFileSync(filePath, "utf8");
      let updated = false;

      let changes: { old: string; new: string }[] = [];

      const updatedContent = content.replace(
        /<span class="caption">Listing (\d+)-(\d+)/g,
        (match, listingChapterNumber, listingNumber) => {
          // Check if the listing chapter number matches the actual chapter number
          // if not, update the caption with the correct chapter number.
          if (parseInt(listingChapterNumber, 10) !== chapterNumber) {
            updated = true; // Flag to indicate content was modified
            const newListing = `<span class="caption">Listing ${chapterNumber}-${listingNumber}`;
            changes.push({ old: match, new: newListing }); // Store change details
            return newListing;
          }
          return match;
        },
      );

      if (updated) {
        fs.writeFileSync(filePath, updatedContent, "utf8");
        console.log(`Updated captions in file: ${file}`);
        changes.forEach((change) => {
          console.log(`Replaced: "${change.old}" with "${change.new}"`);
        });
      }
    }
  }
}

/**
 * This function commits the renaming of folders in the listings directory.
 * It iterates over each subdirectory in the listings directory,
 *  and if it finds a subdirectory that ends with "_tmp", it renames it to remove the "_tmp" suffix.
 * If a directory with the new name already exists, it is removed before the renaming operation.
 *
 * When renaming listings folders, there might be a conflict if the new name already exists.
 * Therefore, we add a suffix _tmp, process the entire chapter, and only then commit the renaming.
 *
 * @param listingsPath - The path to the listings directory.
 */
function commitFolderRenames(listingsPath: string) {
  // For each subdirectory in listingsPath, check if it has a subdirectory
  // that ends with _tmp, and if so, rename it to remove the _tmp suffix
  const folders = fs.readdirSync(listingsPath);
  for (const folder of folders) {
    const folderPath = path.join(listingsPath, folder);
    const stats = fs.statSync(folderPath);
    if (stats.isDirectory()) {
      const subfolders = fs.readdirSync(folderPath);
      for (const subfolder of subfolders) {
        const subfolderPath = path.join(folderPath, subfolder);
        const subfolderStats = fs.statSync(subfolderPath);
        if (subfolderStats.isDirectory() && subfolder.endsWith("_tmp")) {
          const newSubfolderName = subfolder.replace("_tmp", "");
          const newSubfolderPath = path.join(folderPath, newSubfolderName);

          // Check if the new subfolder path already exists if so remove it
          if (fs.existsSync(newSubfolderPath)) {
            fs.rmdirSync(newSubfolderPath, { recursive: true });
          }

          try {
            fs.renameSync(subfolderPath, newSubfolderPath);
          } catch (e) {
            console.log(`Error renaming folder ${subfolderPath}`);
          }
          console.log(`Renamed ${subfolderPath} to ${newSubfolderPath}`);
        }
      }
    }
  }
}

export function deletePreviousTmpFolders(listingsPath: string) {
  const folders = fs.readdirSync(listingsPath);
  for (const folder of folders) {
    const folderPath = path.join(listingsPath, folder);
    const stats = fs.statSync(folderPath);
    if (stats.isDirectory()) {
      const subfolders = fs.readdirSync(folderPath);
      for (const subfolder of subfolders) {
        const subfolderPath = path.join(folderPath, subfolder);
        const subfolderStats = fs.statSync(subfolderPath);
        if (subfolderStats.isDirectory() && subfolder.endsWith("_tmp")) {
          console.log(`Found old tmp folder ${subfolderPath}, deleting it`);
          fs.rmdirSync(subfolderPath, { recursive: true });
        }
      }
    }
  }
}
