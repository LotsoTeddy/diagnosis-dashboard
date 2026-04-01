# ArkClaw Diagnosis System

A complete diagnosis system for OpenClaw instances with a Next.js data browser.

## 📦 Project Structure

```
arkclaw-diagnosis/
├── plugin/              # OpenClaw plugin (collects diagnosis data)
├── backend/             # Express API (optional, for separate deployment)
└── dashboard/           # Next.js full-stack app (API + UI)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install plugin dependencies
cd plugin
npm install

# Install dashboard dependencies
cd ../dashboard
npm install
```

### 2. Start the Dashboard

```bash
cd dashboard
npm run dev
```

The dashboard will start on **http://localhost:3000**

### 3. Use the Plugin

In your OpenClaw instance, run:

```bash
/arkclaw-diagnosis allow
```

The plugin will collect and send diagnosis data to the dashboard.

### 4. View Reports

Open **http://localhost:3000** in your browser to view all diagnosis reports.

## 📊 Dashboard Features

### **Home Page** (`/`)
- View all diagnosis reports in a list
- See report summaries with key metrics:
  - Instance ID and Space ID
  - Creation timestamp
  - Number of log files
  - Number of commands
- Click any report to view details

### **Report Detail Page** (`/reports/[id]`)
- **Instance Information**
  - Instance ID, Space ID, Created Time
  - Environment variables (expandable)

- **OpenClaw Configuration**
  - Plugin name, ID, version
  - Source and description

- **Command History**
  - All executed commands in chronological order

- **Logs**
  - Log files grouped by date
  - Searchable and scrollable log entries

## 🛠️ API Endpoints

### Get All Reports
```http
GET /api/reports
```

Response:
```json
{
  "total": 2,
  "reports": [
    {
      "tracingId": "uuid",
      "instanceId": "instance-123",
      "spaceId": "space-456",
      "createdAt": "2024-04-01T...",
      "logsCount": 5,
      "commandsCount": 23
    }
  ]
}
```

### Get Single Report
```http
GET /api/reports/[tracingId]
```

### Create New Report
```http
POST /api/reports
Content-Type: application/json

{
  "tracingId": "uuid",
  "instanceInfo": { ... },
  "clawConfig": { ... },
  "clawLogs": { ... },
  "historyCommands": { ... }
}
```

### Delete Report
```http
DELETE /api/reports/[tracingId]
```

## 📝 Data Storage

Reports are stored in `dashboard/data/reports.json` as a JSON array.

Example report structure:
```json
{
  "tracingId": "uuid-here",
  "instanceInfo": {
    "spaceId": "space-123",
    "instanceId": "instance-456",
    "instanceCreatedTime": "03-30 11:58",
    "envs": { "PATH": "/usr/bin", ... }
  },
  "clawConfig": {
    "id": "plugin-id",
    "name": "Plugin Name",
    "version": "1.0.0",
    ...
  },
  "clawLogs": {
    "logs": [
      {
        "date": "2024-03-30",
        "items": ["log line 1", "log line 2", ...]
      }
    ]
  },
  "historyCommands": {
    "commands": ["/command1", "/command2", ...]
  },
  "createdAt": "2024-04-01T..."
}
```

## 🎨 Tech Stack

- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Node.js** - Runtime

## 🔧 Development

### Dashboard Development
```bash
cd dashboard
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
```

### Plugin Development
```bash
cd plugin
npm run dev     # Watch mode
npm run build   # Build plugin
```

## 📖 Plugin Usage

Add the plugin to your OpenClaw configuration:

```json
{
  "plugins": [
    {
      "source": "./path/to/arkclaw-diagnosis/plugin"
    }
  ]
}
```

Then run in chat:
```
/arkclaw-diagnosis allow
```

## 🌐 Production Deployment

### Deploy Dashboard to Vercel

```bash
cd dashboard
vercel deploy
```

Update plugin endpoint:
```typescript
// plugin/index.ts
await fetch("https://your-dashboard.vercel.app/api/reports", ...)
```

## 📄 License

MIT
