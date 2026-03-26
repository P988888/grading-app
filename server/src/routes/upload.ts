import express, { type Request, type Response } from "express";
import multer from "multer";
import { uploadFile, readDocumentContent } from "../services/uploadService";

const router = express.Router();

// 配置 multer 用于接收文件
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

/**
 * POST /api/v1/upload
 * 上传文件到对象存储
 * FormData: file (文件)
 */
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "未提供文件" });
    }

    const { originalname, mimetype, buffer } = req.file;

    console.log(`[Upload] Uploading file: ${originalname}, type: ${mimetype}, size: ${buffer.length}`);

    const result = await uploadFile(buffer, originalname, mimetype);

    console.log(`[Upload] File uploaded successfully, key: ${result.key}`);

    res.json({
      success: true,
      key: result.key,
      url: result.url,
      fileName: originalname,
    });
  } catch (error) {
    console.error("[Upload] Upload error:", error);
    res.status(500).json({
      error: "上传失败",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/v1/upload/document
 * 上传文档并返回内容
 * FormData: file (文档文件)
 */
router.post("/document", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "未提供文件" });
    }

    const { originalname, mimetype, buffer } = req.file;

    console.log(`[Upload] Processing document: ${originalname}`);

    // 读取文档内容
    const content = readDocumentContent(buffer);

    res.json({
      success: true,
      content,
      fileName: originalname,
      size: buffer.length,
    });
  } catch (error) {
    console.error("[Upload] Document processing error:", error);
    res.status(500).json({
      error: "文档处理失败",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
