/**
 * 分层记忆系统 — 三层记忆架构，支持自动压缩与技能提炼
 * L1 会话缓存 / L2 SQLite持久化 / L3 技能记忆
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const MEM_DIR = path.join(process.cwd(), 'data', 'memory');
if (!fs.existsSync(MEM_DIR)) fs.mkdirSync(MEM_DIR, { recursive: true });

const db = new Database(path.join(MEM_DIR, 'swan-memory.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY, content TEXT, embedding TEXT,
    timestamp INTEGER, harmony_score REAL, tags TEXT
  );
  CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY, name TEXT, description TEXT,
    pattern TEXT, success_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0, created_at INTEGER
  );
`);

export interface MemoryRecord { id: string; content: string; timestamp: number; harmonyScore?: number; tags?: string[]; }
export interface SkillRecord { id: string; name: string; pattern: string; successCount: number; totalCount: number; createdAt: number; }

export class HierarchicalMemory {
  private cache = new Map<string, MemoryRecord>();

  save(record: MemoryRecord): void {
    db.prepare('INSERT OR REPLACE INTO sessions (id, content, timestamp, harmony_score, tags) VALUES (?,?,?,?,?)')
      .run(record.id, record.content, record.timestamp, record.harmonyScore || 0, JSON.stringify(record.tags || []));
    this.cache.set(record.id, record);
    if (this.cache.size > 500) {
      const arr = [...this.cache.entries()].sort((a,b) => a[1].timestamp - b[1].timestamp);
      arr.slice(0, 100).forEach(([id]) => this.cache.delete(id));
    }
  }

  search(query: string, limit = 5): MemoryRecord[] {
    const kw = `%${query}%`;
    return (db.prepare('SELECT * FROM sessions WHERE content LIKE ? OR tags LIKE ? ORDER BY timestamp DESC LIMIT ?').all(kw, kw, limit) as any[])
      .map((r: any) => ({ id: r.id, content: r.content, timestamp: r.timestamp, harmonyScore: r.harmony_score, tags: JSON.parse(r.tags || '[]') }));
  }

  extractSkills(minRate = 0.7, minSamples = 3): SkillRecord[] {
    const rows = db.prepare('SELECT tags, COUNT(*) as cnt, AVG(harmony_score) as avgH FROM sessions GROUP BY tags HAVING cnt >= ? AND avgH >= 0.6').all(minSamples) as any[];
    return rows.filter((r: any) => (r.cnt / r.cnt) >= minRate).map((r: any) => ({
      id: `skill-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      name: `auto-skill-${JSON.parse(r.tags)[0] || 'unknown'}`,
      pattern: r.tags, successCount: r.cnt, totalCount: r.cnt, createdAt: Date.now(),
    }));
  }

  getStats() {
    const t = db.prepare('SELECT COUNT(*) as c FROM sessions').get() as any;
    const a = db.prepare('SELECT AVG(harmony_score) as a FROM sessions').get() as any;
    return { totalMemories: t.c, averageHarmony: a.a || 0 };
  }
}

export const memory = new HierarchicalMemory();
