import prompts from "prompts";
import { fuzzySearchFolders } from "./prompt";
import {
  extractFolderName,
  getChapterNumber,
  getSubSubfolders,
  renameListing,
} from "./utils";

/**
 * Allows the user to search for a listing folder and rename it.
 * It first gets all sub-subfolders in the listings path, then prompts the user to select a folder and enter a new name for it.
 * If a new name is provided, it renames the folder and updates any references to it in Markdown files.
 *
 * @param srcFolderPath - The path to the source folder containing the Markdown files.
 * @param listingsPath - The path to the folder containing the listings.
 * @returns A promise that resolves when the operation is complete.
 */
export async function searchAndRenameListing(
  srcFolderPath: string,
  listingsPath: string,
) {
  const folders = getSubSubfolders(listingsPath);
  const selectedFolder = await fuzzySearchFolders(folders);

  if (selectedFolder) {
    console.log(`Selected folder: ${selectedFolder}`);

    const oldFolderName = extractFolderName(selectedFolder);
    const response = await prompts({
      type: "text",
      name: "newFolderName",
      message: `Enter a new name for the folder (${oldFolderName}):`,
    });

    const chapterNumber = getChapterNumber(selectedFolder)!;

    if (response.newFolderName) {
      renameListing(
        srcFolderPath,
        chapterNumber,
        selectedFolder,
        oldFolderName,
        response.newFolderName,
      );
    }
  }
}
