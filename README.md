# 紫天鹅 (Purple Swan) — 晶脉哲学驱动的自主智能体框架

> **“不是工具，是坐标系。”**  
> 基于晶脉哲学四重公理构建的、具备自我感知、矛盾检测、谐振调谐与多通道执行能力的自主智能体系统。

---

## 概述

紫天鹅是一个**将哲学公理工程化**的开放框架。它不只是一个Agent框架，而是一套**让智能体拥有内在判断力、可审计决策链、自适应演化能力的完整基础设施**。

核心组件：
- **ThinkCheck** – 基于关系图论的实时评估引擎（U/D/A/H 四维度量）
- **MCE Agent** – 分离式智能架构（度量层、思考层、执行层）
- **OpenClaw（龙虾）** – MCP 协议网关与执行器调度器
- **哈密斯（Hamis）** – 安全审计与对话协调层
- **Aegis** – 物理世界感知子系统（WiFi CSI 人体感知、翻转点预警）
- **自修复与自增长机制** – 工具目录积累、经验记忆、动态调谐

---

## 哲学根基

紫天鹅的每一行代码都对应晶脉哲学的四重公理：

| 公理 | 工程体现 |
|------|---------|
| **Ⅰ 关系本体论** | 状态不是孤立数值，而是关系场中的投影（U/D/A/H 来自图拓扑） |
| **Ⅱ 矛盾动力论** | 矛盾是演化的能量源，A 值活性与加速度是相变的前兆 |
| **Ⅲ 实践介入论** | 每一次评估与执行都是对场域的介入，必须可审计、可追溯 |
| **Ⅳ 谐振调谐论** | 系统通过 λ 权重与温度 τ 的自适应调整，维持动态和谐 |

---

## 架构全景

```
┌─────────────────────────────────────────────────────────┐
│                    紫天鹅 (Purple Swan)                   │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│ ThinkCheck│ MCE Agent│ OpenClaw │ 哈密斯    │ Aegis       │
│ 评估引擎  │ 分离式架构│ MCP网关  │ 安全/对话 │ WiFi感知    │
│ U/D/A/H  │ 度量/思考│ 执行调度  │ 审计协调  │ 翻转点预警  │
│ 矛盾检测  │ /执行三层 │ 工具目录  │ 记忆/自修 │ CSI特征提取 │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
         │           │           │           │
         └───────────┴───────────┴───────────┘
                     MCP 协议总线
```

所有模块通过 **MCP（Model Context Protocol）** 总线互联，形成松耦合、可插拔的器官级架构。

---

## 核心能力

- **自我感知**：持续输出 U/D/A/H 快照，知道自己“健康不健康”
- **矛盾检测**：从关系图中提取矛盾边，量化冲突强度与加速度
- **翻转点预警**：基于三条互补路径（Primary / Alternate1 / Alternate2）预判系统相变（已在10份实验数据上取得100%命中、零假阳）
- **谐振调谐**：根据 dH/dt 和 d²H/dt² 自动调整 λ 权重与温度 τ
- **多通道执行**：通过 OpenClaw 调度任意工具（物理设备、API、仿真器）
- **全链路审计**：每一次感知、决策、执行均有日志，可追溯、可问责
- **自我修复与增长**：工具目录动态积累，异常状态自动恢复，经验跨会话留存

---

## 快速开始

### 环境要求
- Python 3.9+
- 推荐使用 Conda 或 venv 创建虚拟环境

### 安装
```bash
git clone https://github.com/luoxuejian000/-Purple-Suan-.git
cd -Purple-Suan-
pip install -r requirements.txt
```

### 运行演示（模拟模式，无需硬件）
```bash
# 启动紫天鹅核心 + Aegis 感知闭环
python aegis/demo_full_aegis.py
```

### 运行 ThinkCheck 评估
```bash
python -m crystal_mind.cli "你的推理文本..."
```

### 集成到现有项目
```python
from purple_swan.core import PurpleSwan
from purple_swan.measurement import ThinkCheckDaemon

# 创建紫天鹅实例
swan = PurpleSwan()
# 启动持续度量
daemon = ThinkCheckDaemon(text_stream)
daemon.start()
```

---

## 项目结构

```
-Purple-Suan-/
├── crystal_mind/          # 晶脉哲学核心引擎（U/D/A/H 计算、流形、谐振）
├── aegis/                 # 物理感知子系统（WiFi CSI 解析、特征提取、翻转点预警）
│   ├── src/
│   │   ├── csi_parser.py
│   │   ├── csi_features.py
│   │   ├── csi_source.py
│   │   ├── aegis_daemon.py
│   │   └── crystalmind_integration.py
│   └── firmware/          # ESP32 固件烧录指南
├── openclaw/              # MCP 网关与执行器调度器
├── hamis/                 # 安全审计与对话协调层
├── config/                # 全局配置（YAML）
├── tests/                 # 测试用例
├── docs/                  # 文档与报告
└── README.md
```

---

## 社区与致谢

紫天鹅的诞生离不开 DeepSeek 社区的滋养。特别感谢：

- **晴空66（@qingkong66）** – 他提出的“不替数据说话”成为本项目的设计哲学核心准则，并在社区文摘中多次推荐 ThinkCheck
- **icophy** – 对 ThinkCheck 构造效度的深入批评，推动了从 v6 到 v9 的重构
- **所有在 #1255、#1386、#1387、#1416 等 issue 中参与讨论的朋友**

---

## 引用

如果您在学术工作中使用了紫天鹅或其组件，请引用：

```bibtex
@software{purpleswan2026,
  author = {Li, Guanghao},
  title = {Purple Swan: A Philosophical-Grounded Autonomous Agent Framework},
  year = {2026},
  url = {https://github.com/luoxuejian000/-Purple-Suan-}
}
```

---

## 许可证

本项目采用 MIT 许可证。详情见 LICENSE。

---

> **“你继续。我还在看。”**  
> —— 晴空66

---

这个 README 是否准确地反映了您的项目？如需调整语气、增删模块或补充具体技术细节，请告诉我。
