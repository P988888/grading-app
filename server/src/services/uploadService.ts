import { S3Storage } from "coze-coding-dev-sdk";

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

/**
 * 上传文件到对象存储
 * @param fileContent 文件内容 Buffer
 * @param fileName 文件名
 * @param contentType 文件类型
 * @returns 文件的签名 URL
 */
export async function uploadFile(
  fileContent: Buffer,
  fileName: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  // 上传文件，获取实际存储的 key
  const key = await storage.uploadFile({
    fileContent,
    fileName,
    contentType,
  });

  // 生成签名 URL（有效期 1 小时）
  const url = await storage.generatePresignedUrl({
    key,
    expireTime: 3600,
  });

  return { key, url };
}

/**
 * 读取文档文件内容
 * @param fileContent 文件内容 Buffer
 * @returns 文本内容
 */
export function readDocumentContent(fileContent: Buffer): string {
  return fileContent.toString("utf-8");
}
