# Server Monitoring Dashboard

A modern server monitoring dashboard built with Angular 19, featuring real-time server metrics visualization and management capabilities.

![Angular](https://img.shields.io/badge/Angular-19.2-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Overview

This application provides a comprehensive dashboard for monitoring server performance metrics. It displays server status, CPU usage, memory consumption, and historical performance data through interactive charts.

## ✨ Features

- **Server List Management**: View all servers with their current status (up/down)
- **Real-time Metrics**: Monitor CPU and memory usage for each server
- **Interactive Charts**: Visualize server performance data using ApexCharts
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar navigation
- **Performance Analytics**: Track highest and lowest CPU usage metrics
- **Modern UI**: Built with Ng-Zorro (Ant Design) components

## 🛠️ Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **UI Library**: Ng-Zorro (Ant Design for Angular)
- **Charts**: ApexCharts / ng-apexcharts
- **Styling**: SCSS + Tailwind CSS
- **Mock Backend**: JSON Server
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with interceptors

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (optional, but recommended)

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bhavya-practical-loginix.git
   cd bhavya-practical-loginix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

The application requires both the Angular development server and the JSON Server to run simultaneously.

**Option 1: Run both servers with a single command (Recommended)**

```bash
npm start
```

This will start:

- JSON Server on `http://localhost:3000`
- Angular dev server on `http://localhost:4200`

**Option 2: Run servers separately**

In one terminal:

```bash
json-server --watch db.json
```

In another terminal:

```bash
ng serve
```

Then navigate to `http://localhost:4200/` in your browser.

## 🏗️ Build

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Running Tests

To execute the unit tests via [Karma](https://karma-runner.github.io):

```bash
npm test
```

## 📁 Project Structure

```
bhavya-practical-loginix/
├── src/
│   ├── app/
│   │   ├── core/              # Core services and interceptors
│   │   ├── features/
│   │   │   └── servers/       # Server monitoring feature module
│   │   ├── layout/            # Layout components (header, sidebar)
│   │   └── shared/            # Shared components and utilities
│   ├── assets/                # Static assets
│   └── environments/          # Environment configurations
├── db.json                    # Mock database for JSON Server
└── package.json
```

## 🔧 Configuration

### API Endpoint

The API endpoint is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
};
```

### Mock Data

Server data is stored in `db.json`. You can modify this file to add or update server information.

## 📊 API Endpoints

The JSON Server provides the following endpoints:

- `GET /servers` - Get all servers
- `GET /servers/:id` - Get a specific server
- `GET /servers-metrics` - Get all server metrics
- `GET /servers-metrics?serverId=:id` - Get metrics for a specific server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Bhavya

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Ng-Zorro Team for the UI components
- ApexCharts for the charting library

## 📚 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
