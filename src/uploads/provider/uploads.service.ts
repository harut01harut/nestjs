import { BadRequestException, ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadFile } from '../interfaces/upload-file..interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {

    constructor(
        @InjectRepository(Upload)
        private readonly uploadRepository: Repository<Upload>,
        private readonly configService: ConfigService
    ) {}

    public async uploadFile(file: Express.Multer.File) {
        // Throw error for unsupported MIME types
        if(!['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype))  {
            throw new BadRequestException('Mime type not supported');
        }

        try{
                // Upload the file in AWS S3
            const name = await this.fileUploadAws(file);
            // Generate to a new entry in database
            const uploadFile: UploadFile = {
                name,
                path: `${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
                type: fileTypes.IMAGE,
                mime: file.mimetype,
                size: file.size,
            }

            const upload = this.uploadRepository.create(uploadFile);

            return await this.uploadRepository.save(upload);
    
        }
        catch(error) {
            throw new ConflictException(error);
        }

    }

    public async fileUploadAws(file: Express.Multer.File) {
        const s3 = new S3();

        try {
            const uploadResult = await s3.upload({
                Bucket: this.configService.get('appConfig.awsBucketName') || '',
                Body: file.buffer,
                Key: this.generateFileName(file),
                ContentType: file.mimetype,
            }).promise();
    
            return uploadResult.Key;
        }catch(error) {
            throw new RequestTimeoutException(error);
        }
    }

    private generateFileName(file: Express.Multer.File) {
        // Extract file name
        let name = file.originalname.split('.')[0];

        // Remove white spaces
        name.replace(/\s/g, '').trim();

        // Extract the extensions
        const extention = path.extname(file.originalname);
        
        // Generate time stamp
        const timestamp = new Date().getTime().toString().trim();
        
        // Return file uuid
        return `${name}-${timestamp}-${uuid4()}`;
    }
}
