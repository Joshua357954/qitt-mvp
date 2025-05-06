import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name: 'dsmqkzdg4',
  api_key: '634427887519418',
  api_secret: 'DtAkFgOBKDff4lgKQ5doMDokNOI',
  timeout: 10000, // 10 seconds
});


export async function uploadToCloudinary(file,resourceType) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Auto-detect file type (image, video, etc.)
        folder: resourceType, // Optional: Save in the 'assignments' folder
      },
      (error, result) => {
        if (error) reject(error); // Reject if there’s an error
        else resolve(result); // Resolve with the result if the upload is successful
      }
    );
    stream.end(buffer); // End the stream to initiate the upload
  });
}