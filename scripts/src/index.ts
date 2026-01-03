import * as path from "path";
import prompts from "prompts";
import {
	deletePreviousTmpFolders,
	fixListingsChapterNumber,
	reorderListings,
} from "./reorder-listings";
import { searchAndRenameListing } from "./search-rename-listing";

const ROOT_PATH = path.join(__dirname, "../..");

const listingsPath = path.join(ROOT_PATH, "listings");
const srcFolderPath = path.join(ROOT_PATH, "src");

async function main() {
	console.log("Welcome to the Maintenance Script for the Cairo Book");

	const actionResponse = await prompts({
		type: "select",
		name: "action",
		message: "What action would you like to perform?",
		choices: [
			{ title: "Rename a listing", value: "rename" },
			{ title: "Reorder listings automatically", value: "reorder" },
		],
	});

	switch (actionResponse.action) {
		case "rename":
			searchAndRenameListing(srcFolderPath, listingsPath);
			break;
		case "reorder":
			deletePreviousTmpFolders(listingsPath);
			fixListingsChapterNumber(srcFolderPath);
			reorderListings(srcFolderPath, listingsPath);
			break;
		default:
			console.log("No action selected.");
			break;
	}
}

main();
