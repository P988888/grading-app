import express, { type Request, type Response } from "express";
import { 
  gradeDocument, 
  gradeVideo, 
  gradeImage, 
  streamGrade,
  HeaderUtils 
} from "../services/botService";

const router = express.Router();

/**
 * POST /api/v1/grading/document
 * 文档批改接口
 * Body: { content: string, fileName: string }
 */
router.post("/document", async (req: Request, res: Response) => {
  try {
    const { content, fileName } = req.body;

    if (!content) {
      return res.status(400).json({ error: "缺少文档内容" });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );

    console.log(`[Grading] Starting document grading: ${fileName || "unknown"}`);
    
    const result = await gradeDocument(content, fileName || "未命名文档", {
      headers: customHeaders,
    });

    console.log(`[Grading] Document grading completed, score: ${result.totalScore}`);
    res.json(result);
  } catch (error) {
    console.error("[Grading] Document grading error:", error);
    res.status(500).json({ 
      error: "批改过程中发生错误",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/v1/grading/video
 * 视频批改接口
 * Body: { description: string, videoUrl: string }
 */
router.post("/video", async (req: Request, res: Response) => {
  try {
    const { description, videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "缺少视频URL" });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );

    console.log(`[Grading] Starting video grading: ${videoUrl}`);
    
    const result = await gradeVideo(description || "", videoUrl, {
      headers: customHeaders,
    });

    console.log(`[Grading] Video grading completed, score: ${result.totalScore}`);
    res.json(result);
  } catch (error) {
    console.error("[Grading] Video grading error:", error);
    res.status(500).json({ 
      error: "批改过程中发生错误",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/v1/grading/image
 * 图片批改接口
 * Body: { description: string, imageUrl: string }
 */
router.post("/image", async (req: Request, res: Response) => {
  try {
    const { description, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "缺少图片URL" });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );

    console.log(`[Grading] Starting image grading: ${imageUrl}`);
    
    const result = await gradeImage(description || "", imageUrl, {
      headers: customHeaders,
    });

    console.log(`[Grading] Image grading completed, score: ${result.totalScore}`);
    res.json(result);
  } catch (error) {
    console.error("[Grading] Image grading error:", error);
    res.status(500).json({ 
      error: "批改过程中发生错误",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/v1/grading/stream
 * 流式批改接口（SSE）
 * Body: { type: "document" | "video" | "image", content: string, mediaUrl?: string }
 */
router.post("/stream", async (req: Request, res: Response) => {
  try {
    const { type, content, mediaUrl } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: "缺少必要参数" });
    }

    if ((type === "video" || type === "image") && !mediaUrl) {
      return res.status(400).json({ error: `${type}类型需要提供 mediaUrl` });
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(
      req.headers as Record<string, string>
    );

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, no-transform, must-revalidate");
    res.setHeader("Connection", "keep-alive");

    console.log(`[Grading] Starting stream grading: ${type}`);

    const stream = streamGrade(type, content, mediaUrl, {
      headers: customHeaders,
    });

    for await (const chunk of stream) {
      res.write(`data: ${chunk}\n\n`);
    }

    // 发送结束标记
    res.write("data: [DONE]\n\n");
    res.end();

    console.log(`[Grading] Stream grading completed`);
  } catch (error) {
    console.error("[Grading] Stream grading error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "批改过程中发生错误",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    } else {
      res.write(`data: [ERROR] ${error instanceof Error ? error.message : "Unknown error"}\n\n`);
      res.end();
    }
  }
});

export default router;
