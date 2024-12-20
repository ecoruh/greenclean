import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import trash from 'trash';

function escapeShellArg(arg) {
    return `'${arg.replace(/'/g, "'\\''")}'`;
}

function getTaggedFiles(folderPath, tag) {
    const files = fs.readdirSync(folderPath);
    return files.filter((file) => {
        const filePath = path.join(folderPath, file);
        try {
            const escapedPath = escapeShellArg(filePath);
            const result = execSync(`mdls -name kMDItemUserTags ${escapedPath}`, { encoding: 'utf8' });
            return result.includes(tag);
        } catch (error) {
            // Skip files that cause errors (e.g., not valid for mdls)
            return false;
        }
    });
}

function promptUser(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function main() {
    const folderPath = process.argv[2];

    if (!folderPath) {
        console.error('Error: Please provide a folder path as an argument.');
        process.exit(1);
    }

    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
        console.error('Error: The provided path is not a valid folder.');
        process.exit(1);
    }

    const greenTag = 'Green';
    const greenFiles = getTaggedFiles(folderPath, greenTag);

    if (greenFiles.length === 0) {
        console.error('No files with the Green tag were found. Aborting.');
        process.exit(1);
    }

    console.log('Files with Green tag:');
    greenFiles.forEach((file) => console.log(`- ${file}`));

    const proceed = await promptUser('Do you want to proceed and clean up non-Green files? (y/n): ');
    if (proceed !== 'y') {
        console.log('Aborting operation.');
        process.exit(0);
    }

    const filesToKeep = greenFiles.flatMap((file) => [file, file.replace(/\.JPG$/i, '.DNG')]);
    const allFiles = fs.readdirSync(folderPath);

    const filesToTrash = allFiles.filter((file) => 
        !filesToKeep.includes(file) && /\.(JPG|DNG)$/i.test(file)
    ).map((file) => path.join(folderPath, file));

    if (filesToTrash.length > 0) {
        await trash(filesToTrash);
        console.log('Moved to Trash:', filesToTrash);
    }

    console.log('Cleanup complete.');
}

main().catch((error) => {
    console.error('An error occurred:', error.message);
    process.exit(1);
});
