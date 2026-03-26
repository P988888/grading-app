/**
 * API 服务模块
 * 统一管理所有后端 API 调用
 */

import { createFormDataFile } from './index';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';

export interface GradingResult {
  totalScore: number;
  scores: Record<string, number>;
  maxScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  platformScore?: {
    weibo: number;
    xiaohongshu: number;
    douyin: number;
  };
  interactionScore?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface UploadResult {
  success: boolean;
  key: string;
  url: string;
  fileName: string;
}

export interface DocumentContent {
  success: boolean;
  content: string;
  fileName: string;
  size: number;
}

/**
 * 上传文件到对象存储
 * @param fileUri 本地文件 URI
 * @param fileName 文件名
 * @param mimeType 文件类型
 */
export async function uploadFile(
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<UploadResult> {
  /**
   * 服务端文件：server/src/routes/upload.ts
   * 接口：POST /api/v1/upload
   * FormData 参数：file: File
   */
  const formData = new FormData();
  
  const file = await createFormDataFile(fileUri, fileName, mimeType);
  formData.append('file', file as any);

  const uploadResponse = await fetch(`${BASE_URL}/api/v1/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    throw new Error(error.error || '上传失败');
  }

  return uploadResponse.json();
}

/**
 * 上传文档并获取内容
 * @param fileUri 本地文件 URI
 * @param fileName 文件名
 */
export async function uploadDocument(
  fileUri: string,
  fileName: string
): Promise<DocumentContent> {
  /**
   * 服务端文件：server/src/routes/upload.ts
   * 接口：POST /api/v1/upload/document
   * FormData 参数：file: File
   */
  const formData = new FormData();
  
  const file = await createFormDataFile(fileUri, fileName, 'application/octet-stream');
  formData.append('file', file as any);

  const uploadResponse = await fetch(`${BASE_URL}/api/v1/upload/document`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    throw new Error(error.error || '上传失败');
  }

  return uploadResponse.json();
}

/**
 * 文档批改
 * @param content 文档内容
 * @param fileName 文件名
 */
export async function gradeDocument(content: string, fileName: string): Promise<GradingResult> {
  /**
   * 服务端文件：server/src/routes/grading.ts
   * 接口：POST /api/v1/grading/document
   * Body 参数：content: string, fileName: string
   */
  const response = await fetch(`${BASE_URL}/api/v1/grading/document`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, fileName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '批改失败');
  }

  return response.json();
}

/**
 * 视频批改
 * @param description 视频描述
 * @param videoUrl 视频 URL
 */
export async function gradeVideo(description: string, videoUrl: string): Promise<GradingResult> {
  /**
   * 服务端文件：server/src/routes/grading.ts
   * 接口：POST /api/v1/grading/video
   * Body 参数：description: string, videoUrl: string
   */
  const response = await fetch(`${BASE_URL}/api/v1/grading/video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, videoUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '批改失败');
  }

  return response.json();
}

/**
 * 图片批改
 * @param description 图片描述
 * @param imageUrl 图片 URL
 */
export async function gradeImage(description: string, imageUrl: string): Promise<GradingResult> {
  /**
   * 服务端文件：server/src/routes/grading.ts
   * 接口：POST /api/v1/grading/image
   * Body 参数：description: string, imageUrl: string
   */
  const response = await fetch(`${BASE_URL}/api/v1/grading/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '批改失败');
  }

  return response.json();
}
