/**
 * Processes a file for direct database storage
 * @param file The file to process
 * @returns Object containing the buffer and mime type
 */
export async function processFileForStorage(file: File): Promise<{
  buffer: Buffer;
  mimeType: string;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return {
    buffer,
    mimeType: file.type
  };
}
