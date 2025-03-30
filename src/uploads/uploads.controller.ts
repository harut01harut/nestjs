import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders } from '@nestjs/swagger';
import { Express } from 'express';
import { UploadsService } from './provider/uploads.service';

@Controller('uploads')
export class UploadsController {
    
    constructor(
        /**
         * Inject Uploads service
         */
        private readonly uploadService: UploadsService,
    ){}

    @UseInterceptors(FileInterceptor('file')) 
    @Post('file')
    public uploadFile(@UploadedFile() file: Express.Multer.File ){
        console.log(file);
        return  this.uploadService.uploadFile(file);
    }
}
