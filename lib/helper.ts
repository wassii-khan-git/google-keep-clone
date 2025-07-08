import { del, put } from "@vercel/blob";

// upload to blob
export const uploadToBlob = async (file: File) => {
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
};

// upload to blob
export const deleteFromBlob = async (pathname: string) => {
  // Blob SDK currently doesn't support delete via JS SDK – you'd need API route to call REST DELETE
  // For now, this is a stub to handle cleanup.

  await del(pathname, { token: process.env.BLOB_READ_WRITE_TOKEN });

  return new Response();
};
