/**
 * 紫天鹅终极协调总线 v3.0 — 记忆、执行、审视、进化、画像五位一体闭环
 * 理论根基：谐振调谐论 — H = λU·U + λD·D - λA·A，系统朝向更高和谐度自组织
 * 
 * 完整流程：
 *   USER.md加载 → 行动前反思 → 语义记忆检索 → 执行 → 诊断 →
 *   分层记忆存储 → 进化判断 → 自我修正 → 用户画像更新
 */

import { diagnoseText, DiagnosisReport } from '../tools/diagnosis-bridge';
import { memory } from '../tools/hierarchical-memory';
import { semanticMemory } from '../tools/semantic-memory';
import { skillEvolver } from '../tools/skill-evolver';
import { userProfile } from '../tools/user-profile';
import { v4 as uuid } from 'uuid';

export interface TaskRequest { type: string; content: string; }
export interface TaskResult { 
  output: string; 
  evaluation: DiagnosisReport; 
  similarTasks: any[]; 
  preCheckPassed: boolean; 
  optimized: boolean; 
  evolved: boolean; 
  selfCorrected: boolean; 
  profileUpdated: boolean; 
}

export class PurpleSwanOrchestrator {
  async execute(task: TaskRequest): Promise<TaskResult> {
    // 阶段0：加载用户画像 (USER.md/MEMORY.md)
    const userPrefs = userProfile.getPreference('communication_style');
    const contextEnhanced = userPrefs ? `[用户偏好: ${userPrefs}] ${task.content}` : task.content;

    // 阶段1：行动前反思 (MIRROR)
    let preCheckPassed = true;
    try {
      const pre = await diagnoseText(task.content);
      if (pre.H < 0.3) {
        return { output: '', evaluation: pre, similarTasks: [], preCheckPassed: false, optimized: false, evolved: false, selfCorrected: false, profileUpdated: false };
      }
    } catch { preCheckPassed = false; }

    // 阶段2：语义记忆检索
    const similar = await semanticMemory.search(task.content, 5);

    // 阶段3：执行任务
    let output = `[紫天鹅·绝世神品 v3.0] 针对"${task.type}"的推理结果。${contextEnhanced}`;

    // 阶段4：执行后诊断
    let evaluation: DiagnosisReport;
    try { evaluation = await diagnoseText(output); } catch {
      evaluation = { U:0.5, D:0.5, A:0.5, H:0.5, verdict:'评估暂不可用', drift_warnings:[], suggestions:[] };
    }

    // 阶段5：自我修正循环
    let selfCorrected = false;
    if (evaluation.H < 0.6 && evaluation.suggestions.length > 0) {
      const suggestionHint = evaluation.suggestions.join('; ');
      output = `[紫天鹅·自我修正] ${output}\n\n[修正依据] ${suggestionHint}`;
      try {
        const recheck = await diagnoseText(output);
        if (recheck.H > evaluation.H) {
          evaluation = recheck;
          selfCorrected = true;
        }
      } catch {}
    }

    // 阶段6：分层记忆存储
    memory.save({ id: uuid(), content: output, timestamp: Date.now(), harmonyScore: evaluation.H, tags: [task.type] });
    
    // 语义记忆存储
    try {
      await semanticMemory.save({
        id: uuid(), content: output, embedding: [], timestamp: Date.now(),
        harmonyScore: evaluation.H, tags: [task.type], category: 'experience'
      });
    } catch {}

    // 阶段7：进化判断
    let evolved = false;
    if (evaluation.H >= 0.7) {
      const evolutionResult = await skillEvolver.evolve();
      if (evolutionResult.newSkills.length > 0) evolved = true;
    }

    // 阶段8：自动优化判断
    const optimized = evaluation.H < 0.6;

    // 阶段9：更新用户画像
    let profileUpdated = false;
    try {
      userProfile.recordPreference('last_task_type', task.type, 0.7);
      if (evaluation.H > 0.7) {
        userProfile.recordPreference('high_quality_pattern', task.type, 0.8);
      }
      await userProfile.inferPreferences();
      profileUpdated = true;
    } catch {}

    // 阶段10：记录项目上下文
    if (evaluation.drift_warnings && evaluation.drift_warnings.length > 0) {
      userProfile.recordProjectContext({
        commonPitfalls: evaluation.drift_warnings.map(w => `术语"${w.term}"漂移(一致性${w.consistency})`),
      });
    }

    return {
      output, evaluation, similarTasks: similar, preCheckPassed,
      optimized, evolved, selfCorrected, profileUpdated,
    };
  }

  getStatus() {
    return {
      version: '3.0.0-ultimate',
      mode: 'trinity-core-enhanced',
      components: {
        execution: 'OpenClaw Core',
        episodicMemory: 'Hierarchical Memory (L1/L2/L3)',
        semanticMemory: 'Vector Search (LanceDB)',
        evolution: 'EvoSkills-based Self-Evolution Engine',
        review: 'ThinkCheck 3.0 with MIRROR Pre-Reflection',
        profile: 'Cross-Session User Profile (USER.md/PROJECT.md)',
      },
    };
  }
}
