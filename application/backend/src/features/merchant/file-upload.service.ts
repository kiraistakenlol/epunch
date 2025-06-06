import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUploadResponseDto } from 'e-punch-common-core';

export interface FileUploadOptions {
  bucketName: string;
  key: string;
  contentType?: string;
  expiresIn?: number;
}

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.getOrThrow<string>('aws.secretAccessKey'),
      },
    });
  }

  async generateFileUploadUrl(options: FileUploadOptions): Promise<FileUploadResponseDto> {
    this.logger.log(`Generating file upload URL for key: ${options.key}`);
    
    const command = new PutObjectCommand({
      Bucket: options.bucketName,
      Key: options.key,
      ContentType: options.contentType || 'application/octet-stream',
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, { 
        expiresIn: options.expiresIn || 3600 // 1 hour default
      });
      
      const region = this.configService.getOrThrow<string>('aws.region');
      const publicUrl = `https://${options.bucketName}.s3.${region}.amazonaws.com/${options.key}`;
      
      this.logger.log(`Generated upload URL for ${options.key}`);
      
      return {
        uploadUrl,
        publicUrl,
      };
    } catch (error: any) {
      this.logger.error(`Error generating upload URL for ${options.key}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 