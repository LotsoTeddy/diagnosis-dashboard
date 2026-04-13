#!/bin/bash
echo "本脚本将收集以下信息并发送至诊断服务器："
echo "[实例信息]"
echo "- 实例 ID"
echo "- 空间 ID"
echo "- 实例创建时间"
echo "[系统信息]"
echo "- 环境变量"
echo "- 历史执行过的命令"
echo "[Claw 信息]"
echo "- OpenClaw 配置 (~/.openclaw/openclaw.json)"
echo "- 会话历史 (~/.openclaw/agents/main/sessions/)"
echo "- OpenClaw 日志 (/tmp/openclaw/)"
echo "- 历史命令 (~/.bash_history 近100条)"
echo ""
read -p "确认继续？(y/N) " c
[[ "$c" != [yY] ]] && echo "已取消" && exit 0

IP_ADDR="${1:?用法: bash diagnosis.sh IP_ADDR}"
DIAG_SERVER="${IP_ADDR}"

python3 - "$DIAG_SERVER" << 'PYEOF'
import json, glob, os, sys, time, urllib.request

home = os.path.expanduser("~")
data = {
    "id": str(int(time.time() * 1000)),
    "instanceCreatedAt": os.popen('stat -c "%y" /var/log/cloud-init.log 2>/dev/null').read().strip(),
    "envVars": dict(l.split("=", 1) for l in os.popen("env").read().strip().split("\n") if "=" in l),
    "clawConfig": json.load(open(f"{home}/.openclaw/openclaw.json")) if os.path.exists(f"{home}/.openclaw/openclaw.json") else {},
    "sessions": [
        {"name": os.path.basename(f), "messages": [json.loads(l) for l in open(f) if l.strip()]}
        for f in sorted(glob.glob(f"{home}/.openclaw/agents/main/sessions/*.jsonl"))
    ],
    "logs": [
        {"name": os.path.basename(f), "entries": [json.loads(l) for l in open(f) if l.strip()]}
        for f in sorted(glob.glob("/tmp/openclaw/openclaw-*.log"))[-1:]
    ],
    "history": open(f"{home}/.bash_history").read().strip().split("\n")[-100:] if os.path.exists(f"{home}/.bash_history") else [],
}

server = sys.argv[1]
req = urllib.request.Request(server + "/api/report", json.dumps(data).encode(), {"Content-Type": "application/json"})
urllib.request.urlopen(req)
print("Done! Report ID:", data["id"])
PYEOF
