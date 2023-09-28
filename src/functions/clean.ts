import { readdirSync, statSync, unlinkSync } from "fs"
import { join } from "path"

/**
 * Removes all JS files in the repository. Meant to cleanup after tsc.
 */
function removeJsFiles(dir: string) {
    console.log(dir)
    readdirSync(dir).forEach((file) => {
        const filePath = join(dir, file)

        if (statSync(filePath).isDirectory()) {
            // If it's a directory, recursively call the function
            removeJsFiles(filePath)
        } else if (file.endsWith('.js')) {
            // If it's a .js file, remove it
            unlinkSync(filePath)
            console.log(`Removed: ${filePath}`)
        }
    })
}

// Specify the root directory from where you want to start the cleanup
const rootDir = '/Users/eirikhanasand/Desktop/Login/automatednotifications/src/'
removeJsFiles(rootDir)
console.log('Cleanup complete.')