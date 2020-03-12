import { resolve } from 'path';
import { promises, Dirent } from 'fs';
import readdir = promises.readdir;


export class DirectoryHelper {
    static async* getFiles(dir: string): AsyncGenerator<string> {
        const dirents: Dirent[] = await readdir(dir, { withFileTypes: true });
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