"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
var readdir = fs_1.promises.readdir;
class DirectoryHelper {
    static async *getFiles(dir) {
        const dirents = await readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = path_1.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                yield* DirectoryHelper.getFiles(res);
            }
            else {
                yield res;
            }
        }
    }
}
exports.DirectoryHelper = DirectoryHelper;
//# sourceMappingURL=directory.js.map