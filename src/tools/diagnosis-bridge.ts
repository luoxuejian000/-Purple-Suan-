/**
 * 诊断桥接模块 — 直接调用水晶之心中的真实 ThinkCheck 3.0 引擎
 * 基于晶脉哲学四重公理：关系本体论、矛盾动力论、实践介入论、谐振调谐论
 * 此模块是紫天鹅与水晶之心之间的核心桥梁，直接复用 mcp_tool.py 中的诊断函数
 */

import { exec } from 'child_process';
import path from 'path';
import { existsSync } from 'fs';

const CRYSTAL_HEART = 'D:/luoxuejian000/new02/hermes-agent-main/hermes-agent-main';

// 尝试多个可能的 Python 路径
function findPythonPath(): string {
  const possiblePaths = [
    path.join(CRYSTAL_HEART, '.venv', 'Scripts', 'python.exe'),
    path.join(CRYSTAL_HEART, '.venv', 'bin', 'python'),
    'python3',
    'python',
    'py'
  ];
  for (const p of possiblePaths) {
    if (existsSync(p) || !p.includes('/')) {
      if (!p.includes('/') || existsSync(p)) {
        return p;
      }
    }
  }
  return 'python';
}

const PYTHON = findPythonPath();

export interface DiagnosisReport {
  U: number;
  D: number;
  A: number;
  H: number;
  verdict: string;
  drift_warnings: Array<{ term: string; consistency: number }>;
  suggestions: string[];
}

/**
 * 直接调用水晶之心中真实的 evaluate_text 函数进行诊断
 * @param text 待评估的文本
 * @returns 四维诊断报告
 */
export function diagnoseText(text: string): Promise<DiagnosisReport> {
  return new Promise((resolve, reject) => {
    // 对文本进行安全处理，防止注入
    const safeText = text
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    
    // 直接调用 mcp_tool.py 中的 evaluate_text 函数
    const script = `
import sys
import json
sys.path.insert(0, r'${CRYSTAL_HEART.replace(/\\/g, '\\\\')}')
try:
    from mcp_tool import evaluate_text
    result = evaluate_text(r'''${safeText}''')
    print(json.dumps(result, ensure_ascii=False))
except Exception as e:
    print(json.dumps({
        'U': 0.5, 'D': 0.5, 'A': 0.5, 'H': 0.5,
        'verdict': '诊断引擎异常：' + str(e),
        'drift_warnings': [],
        'suggestions': []
    }))
`;
    
    const child = exec(`${PYTHON} -c "${script.replace(/"/g, '\\"')}`, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err && !stdout.trim() === '') {
        reject(new Error(`诊断引擎调用失败: ${stderr || err.message}`));
        return;
      }
      try {
        const result = JSON.parse(stdout.trim());
        resolve({
          U: result.U, D: result.D, A: result.A, H: result.H,
          verdict: result.verdict,
          drift_warnings: result.drift_warnings || [],
          suggestions: result.suggestions || [],
        });
      } catch (e) {
        reject(new Error(`解析诊断结果失败: ${stdout}`));
      }
    });
  });
}
