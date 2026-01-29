import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "nirmaan-launchpad";
const REGION = process.env.AWS_REGION || "ap-south-1";

const s3Client = new S3Client({
  region: REGION,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

/**
 * Upload a file to S3 bucket (nirmaan-launchpad) and return its public URL and original filename.
 * Preserves original filename while making it unique with timestamp prefix.
 * Key format: applications/{timestamp}__{suffix}__{original-filename}
 */
export async function uploadFileToS3(
  file: File,
  suffix?: string
): Promise<{ url: string; filename: string } | null> {
  try {
    // Sanitize filename: remove special characters, keep only alphanumeric, dots, hyphens, underscores
    const sanitizeFilename = (name: string): string => {
      return name.replace(/[^a-zA-Z0-9._-]/g, "_");
    };

    const originalFileName = sanitizeFilename(file.name);
    const timestamp = Date.now();
    
    // Create unique filename: {timestamp}__{suffix}__{original-filename}
    // Using double underscore as delimiter to easily extract original filename later
    const uniqueFileName = suffix 
      ? `${timestamp}__${suffix}__${originalFileName}`
      : `${timestamp}__${originalFileName}`;
    
    const key = `applications/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        // Add metadata to store original filename
        Metadata: {
          "original-filename": file.name,
        },
      })
    );

    // Public URL format for S3 (bucket must allow public read or use CloudFront)
    const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    
    return {
      url: publicUrl,
      filename: file.name, // Return original filename for display
    };
  } catch (err) {
    console.error("S3 upload error:", err);
    return null;
  }
}

/**
 * Extract the original filename from an S3 URL.
 * URL format: https://bucket.s3.region.amazonaws.com/applications/{timestamp}__{suffix}__{filename}
 * Returns the original filename (e.g., "data1.pdf")
 * Handles both S3 URLs and regular URLs gracefully.
 */
export function extractFilenameFromS3Url(url: string): string {
  if (!url) return url;
  
  try {
    // Check if it's an S3 URL
    const isS3Url = url.includes('.s3.') && url.includes('amazonaws.com');
    
    if (isS3Url) {
      // Extract the key part from the S3 URL
      const urlObj = new URL(url);
      const key = urlObj.pathname.substring(1); // Remove leading slash
      
      // Key format: applications/{timestamp}__{suffix}__{filename} or applications/{timestamp}__{filename}
      const parts = key.split("/");
      const fileName = parts[parts.length - 1];
      
      // Split by double underscore to extract original filename
      const fileNameParts = fileName.split("__");
      
      // Original filename is the last part after the delimiter
      if (fileNameParts.length >= 2) {
        return fileNameParts[fileNameParts.length - 1];
      }
      
      // Fallback: if no delimiter found, return the filename as-is
      return fileName;
    } else {
      // For non-S3 URLs (e.g., manually entered links), extract filename from path
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        const fileName = pathParts[pathParts.length - 1];
        return fileName || url;
      } catch {
        // If URL parsing fails, try to extract from string
        const parts = url.split("/");
        return parts[parts.length - 1] || url;
      }
    }
  } catch (err) {
    console.error("Error extracting filename from URL:", err);
    // Final fallback: return URL as-is
    return url;
  }
}

export { BUCKET_NAME, REGION };
