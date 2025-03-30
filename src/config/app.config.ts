import { registerAs } from "@nestjs/config";

export default registerAs('appConfig', () =>({
    enviroment: process.env.NODE_ENV || 'production',
    apiVersion: process.env.API_VERSION || 1,
    awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME || '',
    awsRegion: process.env.AWS_REGION || '',
    awsCloudFrontUrl: process.env.AWS_CLOUDFRONT || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    mailHost: process.env.MAIL_HOST,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
}))