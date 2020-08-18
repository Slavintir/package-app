import { resolve } from 'path';
import { promises as fs, Dirent } from 'fs';

export class DirectoryHelper {
    static async* recursiveFindFile(directoryPath: string): AsyncGenerator<string> {
        const directories: Dirent[] = await fs.readdir(directoryPath, { withFileTypes: true });

        for (const directory of directories) {
            yield* DirectoryHelper.resolveDirectory(directoryPath, directory);
        }
    }

    private static async* resolveDirectory(directoryPath: string, directory: Dirent): AsyncGenerator<string> {
        const path: string = resolve(directoryPath, directory.name);

        if (!directory.isDirectory()) {
            return yield* DirectoryHelper.recursiveFindFile(path);
        }

        return DirectoryHelper.recursiveFindFile(path);
    }
}