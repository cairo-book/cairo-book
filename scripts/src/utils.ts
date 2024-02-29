import fs from "fs";
import path from "path";

/**
 * Returns an array of paths to all sub-subfolders in a given directory.
 * It first reads the contents of the base directory, then for each directory it finds,
 * it reads its contents and adds the paths of any directories it finds to the output array.
 *
 * @param basePath - The path to the directory to search.
 * @returns A promise that resolves to an array of strings, each string being a path to a sub-subfolder.
 */
export function getSubSubfolders(basePath: string): string[] {
  let folders: string[] = [];

  for (const folder of fs.readdirSync(basePath, { withFileTypes: true })) {
    if (folder.isDirectory()) {
      const subFolderPath = path.join(basePath, folder.name);
      for (const subFolder of fs.readdirSync(subFolderPath, {
        withFileTypes: true,
      })) {
        if (subFolder.isDirectory()) {
          folders.push(path.join(subFolderPath, subFolder.name));
        }
      }
    }
  }

  return folders;
}

/**
 * Extracts the base name of a folder from a given path.
 *
 * @param folderPath - The full path to the folder.
 * @returns The base name of the folder.
 */
export function extractFolderName(folderPath: string): string {
  return path.basename(folderPath);
}

/**
 * Updates the 'name' field in a Scarb.toml file located in a specified folder.
 * It reads the file, replaces the old name with the new name using a regular expression,
 *  and then writes the updated content back to the file.
 *
 * @param folderPath - The path to the folder containing the Scarb.toml file.
 * @param oldName - The old name to be replaced.
 * @param newName - The new name to replace the old one.
 */
export function updateScarbTomlFile(
  folderPath: string,
  oldName: string,
  newName: string,
) {
  const tomlFilePath = path.join(folderPath, "Scarb.toml");
  let tomlContent = fs.readFileSync(tomlFilePath, "utf8");
  tomlContent = tomlContent.replace(
    new RegExp(`name = "${oldName}"`, "g"),
    `name = "${newName}"`,
  );
  fs.writeFileSync(tomlFilePath, tomlContent, "utf8");
}

/**
 * Renames a folder with a new name provided by the user.
 * It constructs a new path for the folder and then renames the folder.
 *
 * @param folderPath - The current path of the folder to be renamed.
 * @param newName - The new name for the folder.
 * @param temp - Whether the folder is a temporary folder.
 */
export function renameFolder(
  folderPath: string,
  newName: string,
  temp: boolean,
) {
  newName = temp ? newName + "_tmp" : newName;
  const newFolderPath = path.join(folderPath, "..", newName);
  fs.renameSync(folderPath, newFolderPath);
}

export function printDiff(oldStr: string, newStr: string) {
  const oldLines = oldStr.split("\n");
  const newLines = newStr.split("\n");

  oldLines.forEach((line, i) => {
    if (line !== newLines[i]) {
      console.log("\x1b[31m%s\x1b[0m", `- ${line}`); // red for old line
      console.log("\x1b[32m%s\x1b[0m", `+ ${newLines[i]}`); // green for new line
    }
  });
}

/**
 * Updates the paths in Markdown files that reference a renamed folder.
 * It reads all the files in a given source folder, and for each Markdown file,
 * it replaces the old folder name with the new one in any paths.
 *
 * @param srcFolderPath - The path to the source folder containing the Markdown files.
 * @param oldName - The old name of the folder.
 * @param newName - The new name of the folder.
 */
export function updateMarkdownFiles(
  srcFolderPath: string,
  chapterNumber: number,
  oldName: string,
  newName: string,
) {
  const paddedChapterNumber = chapterNumber.toString().padStart(2, "0");
  const files = fs.readdirSync(srcFolderPath);

  for (const file of files) {
    const chapterPrefix = `ch${paddedChapterNumber}`;
    if (!file.includes(chapterPrefix)) {
      continue;
    }
    const filePath = path.join(srcFolderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile() && filePath.endsWith(".md")) {
      let content = fs.readFileSync(filePath, "utf8");
      // Regex with capturing group for the chapter name
      // Regex with capturing group for the chapter name
      const regex = new RegExp(`(listings/[^/]+/)${oldName}/`, "g");
      const oldContent = content;
      content = content.replace(regex, `$1${newName}/`);
      printDiff(oldContent, content);

      fs.writeFileSync(filePath, content, "utf8");
    }
  }
}

/**
 * Renames a listing folder and updates all references to it.
 * It first updates the Scarb.toml file in the selected folder,
 * then renames the folder (moves it), and finally updates all Markdown files that reference the folder.
 * It waits for 50 ms after renaming the folder to allow the file system to update.
 *
 * @param srcFolderPath - The path to the source folder containing the Markdown files.
 * @param chapterNumber - The number of the chapter that the listing folder belongs to.
 * @param selectedFolder - The path to the selected folder to be renamed.
 * @param oldFolderName - The old name of the folder.
 * @param newFolderName - The new name for the folder.
 * @param temp - Whether the destination folder is a temporary folder, marked with _tmp.
 * @returns A promise that resolves when the operation is complete.
 */
export async function renameListing(
  srcFolderPath: string,
  chapterNumber: number,
  selectedFolder: string,
  oldFolderName: string,
  newFolderName: string,
  temp = false,
) {
  try {
    updateScarbTomlFile(selectedFolder, oldFolderName, newFolderName);
    renameFolder(selectedFolder, newFolderName, temp);
    updateMarkdownFiles(
      srcFolderPath,
      chapterNumber,
      oldFolderName,
      newFolderName,
    );
    // wait 50 ms for file system to update - bad but works
    await new Promise((resolve) => setTimeout(resolve, 50));
  } catch (e) {
    console.log(e);
  }
}

/**
 * Extracts the chapter number from a given file name using regex.
 *
 * The expected format of file is chX-(additional info) where X is the chapter number.
 * @param file - The name of the file.
 * @returns The chapter number as an integer, or null if no chapter number was found.
 */
export function getChapterNumber(file: string): number | null {
  const chapterMatch = file.match(/ch(\d+)(-\d+-[\w-]+)?/);
  return chapterMatch ? parseInt(chapterMatch[1], 10) : null;
}

/**
 * Searches for a folder in the listings directory that includes a specific string.
 *
 * @param path - The path to the search in directory.
 * @param searchString - The string to search for in the folder names.
 * @returns The name of the found folder, or null if no folder was found.
 */
export function findFileIncludingString(
  path: string,
  searchString: string,
): string | null {
  const listingsFolder = fs
    .readdirSync(path)
    .find(
      (folder) => folder.includes(searchString) && !folder.includes("_tmp"),
    );
  return listingsFolder || null;
}
