// function to upload file on cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.API_KEY, api_secret: process.env.API_SECRET });

exports.uploadFile = (file, resource_type, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            const uploadResult_1 = await new Promise((resolve_1, reject_1) => {
                cloudinary.uploader.upload_stream({ overwrite: true, unique_filename: false, use_filename: false, folder: 'Images', resource_type, public_id: filename }, (error, uploadResult) => {
                    if (error) return reject_1(error);
                    return resolve_1(uploadResult);
                }).end(file);
            });
            resolve(uploadResult_1);
        } catch (error_1) {
            reject(error_1);
        }
    })
}

const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")

const S3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
})

exports.uploadFileS3Client = (file, fileName, folderName) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${process.env.NODE_ENV}/${folderName}/${fileName}`,
            Body: file.buffer,
            // ContentType: content_type,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(params);

        S3.send(command).then((response) => {
            resolve({ ...response, location: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`, fileLocation: params.Key });
        }).catch((error) => {
            reject(error);
        });
    });
};

exports.deleteFileS3Client = (fileLocation) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: fileLocation,
        };
        const command = new DeleteObjectCommand(params);

        S3.send(command).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
};

// function to add paginate on data
exports.pagination = (limit, page, total) => {
    return { limit, page, totalPage: Math.ceil(total / limit), skip: (page - 1) * limit, totalDocuments: total }
}