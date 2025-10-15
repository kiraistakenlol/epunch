import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadResponseDto } from 'e-punch-common-core';
import * as fs from 'fs';
import * as path from 'path';

export interface FileUploadOptions {
  merchantId: string;
  fileName: string;
  contentType?: string;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadsDirectory: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsDirectory = this.configService.get<string>('uploads.directory', './uploads');
    this.ensureUploadsDirectoryExists();
  }

  private ensureUploadsDirectoryExists() {
    if (!fs.existsSync(this.uploadsDirectory)) {
      fs.mkdirSync(this.uploadsDirectory, { recursive: true });
      this.logger.log(`Created uploads directory: ${this.uploadsDirectory}`);
    }
  }

  async generateFileUploadUrl(options: FileUploadOptions): Promise<FileUploadResponseDto> {
    const { merchantId, fileName } = options;

    this.logger.log(`Generating file upload URL for merchant: ${merchantId}, file: ${fileName}`);

    const merchantDir = path.join(this.uploadsDirectory, merchantId);
    if (!fs.existsSync(merchantDir)) {
      fs.mkdirSync(merchantDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    const publicUrl = `/uploads/${merchantId}/${uniqueFileName}`;

    return {
      uploadUrl: publicUrl,
      publicUrl,
    };
  }

  async saveUploadedFile(merchantId: string, fileName: string, fileBuffer: Buffer): Promise<string> {
    const merchantDir = path.join(this.uploadsDirectory, merchantId);
    if (!fs.existsSync(merchantDir)) {
      fs.mkdirSync(merchantDir, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = path.join(merchantDir, uniqueFileName);

    await fs.promises.writeFile(filePath, fileBuffer);
    this.logger.log(`Saved file: ${filePath}`);

    return `/uploads/${merchantId}/${uniqueFileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const relativePath = fileUrl.replace('/uploads/', '');
      const filePath = path.join(this.uploadsDirectory, relativePath);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
      }
    } catch (error: any) {
      this.logger.warn(`Failed to delete file ${fileUrl}: ${error.message}`);
    }
  }
} 