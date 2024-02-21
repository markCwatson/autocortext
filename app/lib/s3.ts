import { toast } from '@/components/Toast';

export const uploadFileToS3 = async (file: File) => {
  const fileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;

  // Request a signed URL from API
  const response = await fetch('/api/doc/s3-upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      contentType: file.type,
    }),
  });

  if (!response.ok) {
    toast({
      title: 'Error',
      message: 'Failed to get signed URL from server',
      type: 'error',
    });
  }

  const { url } = await response.json();

  // Use the signed URL to upload the file to S3
  // Note: cors was enabled on the S3 bucket to allow PUT requests
  const s3Response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!s3Response.ok) {
    toast({
      title: 'Error',
      message: 'Failed to upload file to S3',
      type: 'error',
    });
  }

  return { success: true, name: fileName };
};
