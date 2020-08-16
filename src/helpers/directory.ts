import { resolve } from 'path';
import { promises as fs, Dirent } from 'fs';

export class DirectoryHelper {
    static async* getFiles(dir: string): AsyncGenerator<string> {
        const dirents: Dirent[] = await fs.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                yield* DirectoryHelper.getFiles(res);
            } else {
                yield res;
            }
        }
    }
}