import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const saveImageToStorage = {
	storage: diskStorage({
		destination: process.env.UPLOAD_DIR,
		filename: async (request, file, callback) => {
			const fileExtension = '.' + file.mimetype.split('/')[1];
			const fileName = uuidv4() + fileExtension;
			callback(undefined, fileName);
		},
	}),
};
