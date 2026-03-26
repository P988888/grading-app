import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

// Bot ID 配置
const BOT_ID = "7605126110724456482";

// 批改类型提示词映射
const GRADING_PROMPTS: Record<string, string> = {
  document: `你是一个专业的文档批改助手。请根据以下标准对文档进行评分和批注：

评分标准（满分100分）：
- 内容完整度（30分）：主题是否明确，内容是否完整，论据是否充分
- 理论准确性（25分）：理论引用是否正确，概念是否清晰
- 格式规范性（20分）：排版是否规范，引用格式是否正确
- 创新性（25分）：观点是否新颖，是否有独特见解

请以 JSON 格式返回评分结果，格式如下：
{
  "totalScore": 85,
  "scores": {
    "content": 28,
    "structure": 22,
    "creativity": 20,
    "technical": 15
  },
  "maxScores": {
    "content": 30,
    "structure": 25,
    "creativity": 25,
    "technical": 20
  },
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["建议1", "建议2", "建议3"]
}

请严格按此 JSON 格式返回，不要添加任何其他文字。`,

  video: `你是一个专业的视频批改助手。请根据以下标准对视频进行评分：

评分标准（满分100分）：
- 内容主题（40分）：主题是否鲜明，叙事是否清晰
- 剪辑节奏（25分）：转场是否流畅，节奏是否合理
- 镜头语言（20分）：景别运用是否丰富，镜头是否稳定
- 时长适配（15分）：时长是否合适，内容是否紧凑

请以 JSON 格式返回评分结果，格式如下：
{
  "totalScore": 88,
  "scores": {
    "content": 36,
    "editing": 22,
    "cameraWork": 17,
    "duration": 13
  },
  "maxScores": {
    "content": 40,
    "editing": 25,
    "cameraWork": 20,
    "duration": 15
  },
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "platformScore": {
    "weibo": 82,
    "xiaohongshu": 90,
    "douyin": 85
  }
}

请严格按此 JSON 格式返回，不要添加任何其他文字。`,

  image: `你是一个专业的图文内容批改助手。请根据以下标准对图文进行评分：

评分标准（满分100分）：
- 内容点题度（30分）：内容是否契合主题，表达是否清晰
- 视觉冲击力（30分）：视觉设计是否有层次，色彩是否和谐
- 传播潜力（40分）：标题是否吸引，话题标签是否精准，互动引导是否有效

请以 JSON 格式返回评分结果，格式如下：
{
  "totalScore": 82,
  "scores": {
    "content": 25,
    "visual": 26,
    "spread": 31
  },
  "maxScores": {
    "content": 30,
    "visual": 30,
    "spread": 40
  },
  "strengths": ["优点1", "优点2", "优点3"],
  "weaknesses": ["不足1", "不足2"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "interactionScore": {
    "views": 8500,
    "likes": 680,
    "comments": 45,
    "shares": 120
  }
}

请严格按此 JSON 格式返回，不要添加任何其他文字。`,
};

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

export interface BotServiceOptions {
  headers?: Record<string, string>;
}

/**
 * 调用智能体进行文档批改
 */
export async function gradeDocument(
  content: string,
  fileName: string,
  options?: BotServiceOptions
): Promise<GradingResult> {
  const config = new Config();
  const client = new LLMClient(config, options?.headers);

  const messages = [
    { role: "system" as const, content: GRADING_PROMPTS.document },
    { 
      role: "user" as const, 
      content: `请批改以下文档内容：\n\n文件名：${fileName}\n\n内容：\n${content}` 
    },
  ];

  const response = await client.invoke(messages, {
    model: "doubao-seed-1-8-251228",
    temperature: 0.7,
  });

  return parseGradingResult(response.content);
}

/**
 * 调用智能体进行视频批改
 */
export async function gradeVideo(
  videoDescription: string,
  videoUrl: string,
  options?: BotServiceOptions
): Promise<GradingResult> {
  const config = new Config();
  const client = new LLMClient(config, options?.headers);

  const messages = [
    { role: "system" as const, content: GRADING_PROMPTS.video },
    { 
      role: "user" as const, 
      content: [
        { type: "text" as const, text: `请批改以下视频：\n\n视频描述：${videoDescription}` },
        { type: "video_url" as const, video_url: { url: videoUrl, fps: 1 } }
      ]
    },
  ];

  const response = await client.invoke(messages, {
    model: "doubao-seed-1-6-vision-250815",
    temperature: 0.7,
  });

  return parseGradingResult(response.content);
}

/**
 * 调用智能体进行图片批改
 */
export async function gradeImage(
  imageDescription: string,
  imageUrl: string,
  options?: BotServiceOptions
): Promise<GradingResult> {
  const config = new Config();
  const client = new LLMClient(config, options?.headers);

  const messages = [
    { role: "system" as const, content: GRADING_PROMPTS.image },
    { 
      role: "user" as const, 
      content: [
        { type: "text" as const, text: `请批改以下图片内容：\n\n图片描述：${imageDescription}` },
        { type: "image_url" as const, image_url: { url: imageUrl, detail: "high" as const } }
      ]
    },
  ];

  const response = await client.invoke(messages, {
    model: "doubao-seed-1-6-vision-250815",
    temperature: 0.7,
  });

  return parseGradingResult(response.content);
}

/**
 * 流式调用智能体进行批改
 */
export async function* streamGrade(
  type: "document" | "video" | "image",
  content: string,
  mediaUrl?: string,
  options?: BotServiceOptions
): AsyncGenerator<string> {
  const config = new Config();
  const client = new LLMClient(config, options?.headers);

  const systemPrompt = GRADING_PROMPTS[type];
  
  let messages: any[];
  
  if (type === "document") {
    messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: `请批改以下内容：\n\n${content}` },
    ];
  } else if (type === "video" && mediaUrl) {
    messages = [
      { role: "system" as const, content: systemPrompt },
      { 
        role: "user" as const, 
        content: [
          { type: "text", text: `请批改以下视频：\n\n描述：${content}` },
          { type: "video_url", video_url: { url: mediaUrl, fps: 1 } }
        ]
      },
    ];
  } else if (type === "image" && mediaUrl) {
    messages = [
      { role: "system" as const, content: systemPrompt },
      { 
        role: "user" as const, 
        content: [
          { type: "text", text: `请批改以下图片：\n\n描述：${content}` },
          { type: "image_url", image_url: { url: mediaUrl, detail: "high" } }
        ]
      },
    ];
  } else {
    throw new Error("Invalid parameters for grading type");
  }

  const stream = client.stream(messages, {
    model: type === "document" ? "doubao-seed-1-8-251228" : "doubao-seed-1-6-vision-250815",
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    if (chunk.content) {
      yield chunk.content.toString();
    }
  }
}

/**
 * 解析批改结果
 */
function parseGradingResult(content: string): GradingResult {
  try {
    // 尝试提取 JSON 内容
    let jsonContent = content;
    
    // 如果返回内容包含 markdown 代码块，提取其中的 JSON
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // 尝试直接解析
    const result = JSON.parse(jsonContent);
    
    // 验证必要字段
    if (typeof result.totalScore !== 'number') {
      throw new Error('Invalid totalScore');
    }
    
    return result as GradingResult;
  } catch (error) {
    console.error("Failed to parse grading result:", error);
    console.error("Original content:", content);
    
    // 返回默认结果
    return {
      totalScore: 0,
      scores: {},
      maxScores: {},
      strengths: [],
      weaknesses: ["解析批改结果失败，请重试"],
      suggestions: ["请确保提交的内容完整"],
    };
  }
}

/**
 * 从请求头提取转发头
 */
export { HeaderUtils };
