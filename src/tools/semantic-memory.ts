/**
 * 语义向量记忆系统 — 基于LanceDB的嵌入式向量数据库
 * 理论根基：关系本体论 — 存在即关系，记忆的本质是概念在关系网络中的位置
 * 实现：将记忆内容转换为语义向量，基于余弦相似度检索相似记忆
 */

import { LanceDB } from 'lancedb';
import { pipeline } from '@xenova/transformers';
import path from 'path';
import fs from 'fs';

const MEM_DIR = path.join(process.cwd(), 'data', 'semantic-memory');
if (!fs.existsSync(MEM_DIR)) fs.mkdirSync(MEM_DIR, { recursive: true });

const db = new LanceDB(path.join(MEM_DIR, 'vectors.lance'));

// 嵌入模型（懒加载）
let embedder: any = null;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

export interface SemanticMemory {
  id: string;
  content: string;
  embedding: number[];
  timestamp: number;
  harmonyScore?: number;
  tags?: string[];
  category?: string; // 记忆分类：preference/profile/goal/fact/decision
}

/**
 * 语义记忆管理器 — 实现真正的语义检索
 */
export class SemanticMemoryStore {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    // LanceDB 自动创建表，无需手动建表
    this.initialized = true;
  }

  /**
   * 将文本转换为向量嵌入
   */
  async embed(text: string): Promise<number[]> {
    const model = await getEmbedder();
    const result = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  /**
   * 存储语义记忆
   */
  async save(memory: SemanticMemory): Promise<void> {
    await this.init();
    if (!memory.embedding) {
      memory.embedding = await this.embed(memory.content);
    }
    await db.add([memory]);
  }

  /**
   * 语义检索：基于向量余弦相似度搜索相似记忆
   * 搜索完成后更新被检索记忆的访问时间和频率权重
   */
  async search(query: string, limit: number = 5): Promise<SemanticMemory[]> {
    await this.init();
    const queryVector = await this.embed(query);
    const results = await db.search(queryVector).limit(limit).toArray();
    return results.map((r: any) => ({
      id: r.id, content: r.content, embedding: r.embedding,
      timestamp: r.timestamp, harmonyScore: r.harmonyScore,
      tags: r.tags, category: r.category,
    }));
  }

  /**
   * 获取记忆统计
   */
  async getStats() {
    const count = await db.countRows();
    return { totalMemories: count, storagePath: path.join(MEM_DIR, 'vectors.lance') };
  }
}

export const semanticMemory = new SemanticMemoryStore();
