import { resolve } from 'path';
import { promises as fs, Dirent } from 'fs';

export class DirectoryHelper {
    static async* recursiveFindFile(directoryPath: string): AsyncGenerator<string> {
        for (const directory of await fs.readdir(directoryPath, { withFileTypes: true })) {
            const pathFile = resolve(directoryPath, directory.name);

            if (directory.isDirectory()) {
                yield* DirectoryHelper.recursiveFindFile(pathFile);
            }
            
            yield pathFile;
        }
    }
}