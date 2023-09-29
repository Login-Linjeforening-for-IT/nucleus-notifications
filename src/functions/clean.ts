import { readdirSync, statSync, unlinkSync } from "fs"
import { basename, join } from "path"

/**
 * Removes all JS files in the repository. Meant to cleanup after tsc.
 */
function removeJsFiles(dir: string) {
    console.log(dir)
    readdirSync(dir).forEach((file) => {
        const filePath = join(dir, file)
        const fileBaseName = basename(filePath);

        // Skipping node_modules, distribuiton and git folders
        if (fileBaseName === "node_modules" || fileBaseName === "dist" || fileBaseName === ".git") {
            console.log("Skipping directory:", filePath);
            return;
        }

        if (statSync(filePath).isDirectory()) {
            // If it's a directory, recursively call the function
            removeJsFiles(filePath)
        }
        
        if (file.endsWith('.js') && !file.endsWith('secrets.js') && !file.endsWith('clean.js')) {
            // If it's a .js file, remove it
            unlinkSync(filePath)
            console.log(`Removed: ${filePath}`)
        }
    })
}

// Specify the root directory from where you want to start the cleanup
const rootDir = './'
removeJsFiles(rootDir)
console.log('Cleanup complete.')