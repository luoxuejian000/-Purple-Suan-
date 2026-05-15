/**
 * 跨会话用户画像系统 — 类比Hermes的USER.md/MEMORY.md机制
 * 理论根基：实践介入论 — 每一次交互都是对用户画像的介入，画像本身需要透明可追溯
 * 实现：持久化存储用户偏好、习惯、风格，跨会话持续学习
 */

import fs from 'fs';
import path from 'path';
import { semanticMemory } from './semantic-memory';

const PROFILE_DIR = path.join(process.cwd(), 'data', 'profile');
if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

const USER_PROFILE_PATH = path.join(PROFILE_DIR, 'USER.md');
const PROJECT_MEMORY_PATH = path.join(PROFILE_DIR, 'PROJECT.md');

export interface UserPreference {
  category: string;   // 偏好类别：communication_style, task_priority, domain_focus
  key: string;        // 偏好键
  value: string;      // 偏好值
  confidence: number; // 置信度（0-1）
  lastUpdated: number;
}

export interface ProjectContext {
  domain: string;          // 项目领域
  keyConcepts: string[];   // 关键概念
  commonPitfalls: string[];// 常见陷阱
  successPatterns: string[];// 成功模式
}

/**
 * 用户画像管理器
 */
export class UserProfileManager {
  private preferences: UserPreference[] = [];
  private projectContext: ProjectContext = { domain: '', keyConcepts: [], commonPitfalls: [], successPatterns: [] };

  constructor() {
    this.load();
  }

  /**
   * 从持久化文件加载画像
   */
  private load(): void {
    if (fs.existsSync(USER_PROFILE_PATH)) {
      const content = fs.readFileSync(USER_PROFILE_PATH, 'utf-8');
      this.parseUserProfile(content);
    }
    if (fs.existsSync(PROJECT_MEMORY_PATH)) {
      const content = fs.readFileSync(PROJECT_MEMORY_PATH, 'utf-8');
      this.parseProjectContext(content);
    }
  }

  /**
   * 解析用户画像
   */
  private parseUserProfile(content: string): void {
    // 提取偏好信息
    const prefRegex = /- \*\*(.+?)\*\*: (.+?) \(置信度: (\d+\.?\d*)\)/g;
    let match;
    while ((match = prefRegex.exec(content)) !== null) {
      this.preferences.push({
        category: 'general',
        key: match[1],
        value: match[2],
        confidence: parseFloat(match[3]),
        lastUpdated: Date.now(),
      });
    }
  }

  /**
   * 解析项目上下文
   */
  private parseProjectContext(content: string): void {
    const domainMatch = content.match(/## 项目领域\n(.+)/);
    if (domainMatch) this.projectContext.domain = domainMatch[1];

    const conceptsMatch = content.match(/## 关键概念\n([\s\S]*?)(?=##|$)/);
    if (conceptsMatch) {
      this.projectContext.keyConcepts = conceptsMatch[1]
        .split('\n')
        .filter(l => l.startsWith('- '))
        .map(l => l.replace('- ', ''));
    }
  }

  /**
   * 记录新的用户偏好
   */
  recordPreference(key: string, value: string, confidence: number = 0.5): void {
    const existing = this.preferences.find(p => p.key === key);
    if (existing) {
      existing.value = value;
      existing.confidence = Math.min(1, existing.confidence + 0.1);
      existing.lastUpdated = Date.now();
    } else {
      this.preferences.push({ category: 'general', key, value, confidence, lastUpdated: Date.now() });
    }
    this.saveUserProfile();
  }

  /**
   * 查询用户偏好
   */
  getPreference(key: string): string | undefined {
    const pref = this.preferences.find(p => p.key === key);
    return pref?.value;
  }

  /**
   * 保存用户画像到文件
   */
  private saveUserProfile(): void {
    let content = '# 用户画像 (USER.md)\n\n';
    content += '## 偏好设置\n';
    for (const pref of this.preferences) {
      content += `- **${pref.key}**: ${pref.value} (置信度: ${pref.confidence.toFixed(1)})\n`;
    }
    content += `\n> 最后更新: ${new Date().toISOString()}\n`;
    fs.writeFileSync(USER_PROFILE_PATH, content);
  }

  /**
   * 获取完整用户画像
   */
  getProfile(): string {
    if (fs.existsSync(USER_PROFILE_PATH)) {
      return fs.readFileSync(USER_PROFILE_PATH, 'utf-8');
    }
    return '# 用户画像\n\n暂无数据。随着使用次数增加，这里会自动记录您的偏好和习惯。\n';
  }

  /**
   * 记录项目上下文
   */
  recordProjectContext(context: Partial<ProjectContext>): void {
    Object.assign(this.projectContext, context);
    this.saveProjectContext();
  }

  /**
   * 保存项目上下文
   */
  private saveProjectContext(): void {
    let content = '# 项目记忆 (PROJECT.md)\n\n';
    content += `## 项目领域\n${this.projectContext.domain || '未设定'}\n\n`;
    content += '## 关键概念\n';
    for (const concept of this.projectContext.keyConcepts) {
      content += `- ${concept}\n`;
    }
    content += '\n## 常见陷阱\n';
    for (const pitfall of this.projectContext.commonPitfalls) {
      content += `- ${pitfall}\n`;
    }
    content += '\n## 成功模式\n';
    for (const pattern of this.projectContext.successPatterns) {
      content += `- ${pattern}\n`;
    }
    content += `\n> 最后更新: ${new Date().toISOString()}\n`;
    fs.writeFileSync(PROJECT_MEMORY_PATH, content);
  }

  /**
   * 智能推断用户偏好（基于交互历史）
   */
  async inferPreferences(): Promise<void> {
    // 从语义记忆中分析高频关键词和交互模式
    const stats = await semanticMemory.getStats();
    if (stats.totalMemories > 10) {
      this.recordPreference('活跃度', '高', 0.8);
    }
  }
}

export const userProfile = new UserProfileManager();
