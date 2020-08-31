import { promises as fs } from 'fs';

import { DirectoryHelper } from '../src/helpers/directory';
import { join } from 'path';

describe('directory helper', () => {
    const root: string = join(__dirname, 'actions');
    const files: string[] = [join(root, 'action-1.ts'), join(root, 'action-2.ts'), join(root, 'action-3.ts')];
    
    it('should find all actions', async () => {
        await fs.mkdir(root);
        const promises = files.map(async (file: string) => fs.writeFile(file, ''));
        await Promise.all(promises);
        
        const foundActions: string[] = [];
        for await (const actionDir of DirectoryHelper.recursiveFindFile(root)) {
            foundActions.push(actionDir);
        }
        await fs.rmdir(root, { recursive: true });

        expect(files).toEqual(foundActions);
    });
});
