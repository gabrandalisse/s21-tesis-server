import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  // Multer configuration for pet photos
  static getPetPhotoStorage() {
    return diskStorage({
      destination: './uploads/pets',
      filename: (req, file, callback) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    });
  }

  // Multer configuration for report photos
  static getReportPhotoStorage() {
    return diskStorage({
      destination: './uploads/reports',
      filename: (req, file, callback) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    });
  }

  // File filter to only allow images
  static imageFileFilter(req: any, file: any, callback: any) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  }

  // Generate file URL
  static getFileUrl(filename: string, type: 'pet' | 'report'): string {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/api/uploads/${type}s/${filename}`;
  }
}