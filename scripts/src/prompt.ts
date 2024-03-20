import fuzzysort from "fuzzysort";
import prompts from "prompts";
import { extractFolderName, getSubSubfolders } from "./utils";

/**
 * Performs a fuzzy search on an array of folder names based on a user-provided search term.
 * It uses the fuzzysort library to perform the search, and prompts the user to select a folder from the top 10 results.
 * If no matches are found, it logs a message and returns undefined.
 *
 * @param folders - An array of folder names to search.
 * @returns A promise that resolves to the selected folder name, or undefined if no matches are found.
 */
export async function fuzzySearchFolders(
  folders: string[],
): Promise<string | undefined> {
  const response = await prompts({
    type: "text",
    name: "listingName",
    message: "Enter the name of the listing to rename:",
  });

  const results = fuzzysort.go(response.listingName, folders, { limit: 10 });
  const choices = results.map((result) => ({
    title: result.target,
    value: result.target,
  }));

  if (choices.length === 0) {
    console.log("No match found.");
    return undefined;
  }

  const selection = await prompts({
    type: "select",
    name: "folder",
    message: "Select the corresponding folder",
    choices,
  });

  return selection.folder;
}
