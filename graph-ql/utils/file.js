import fs from 'node:fs/promises';
import { HttpError } from './errors.js';

export const deleteFile = async filePath => {
    try {
        return await fs.unlink(filePath);
    } catch (err) {
        console.log(err);
        throw new HttpError(500, err.message);
    }
};
