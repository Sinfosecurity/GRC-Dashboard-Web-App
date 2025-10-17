# GRC Atlas - GRC Dashboard Web Application

A comprehensive Governance, Risk, and Compliance (GRC) dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Simple email-based sign-in with localStorage persistence
- **Dashboard**: Comprehensive GRC dashboard with risk management, vendor management, and audit tracking
- **Risk Management**: Risk heatmap visualization, risk scoring, and tracking
- **Vendor Management**: Third-party risk assessment and monitoring
- **Audit Management**: Audit scheduling and tracking
- **Evidence Management**: Document upload and control mapping
- **Compliance Frameworks**: Support for SOC2, ISO 27001, NIST, GDPR, PCI DSS, and HIPAA
- **Real-time Monitoring**: Continuous monitoring alerts and notifications
- **Collaboration**: Team collaboration features and activity tracking

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign In**: Enter any valid email address to access the dashboard
2. **Dashboard**: View comprehensive GRC metrics and data
3. **Navigation**: Use the sidebar to navigate between different sections
4. **Data**: All data is fetched from mock API endpoints

## API Endpoints

- `/api/risks` - Risk management data
- `/api/vendors` - Vendor information and risk scores
- `/api/audits` - Audit scheduling and status

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   └── signin/
│   ├── api/
│   │   ├── risks/
│   │   ├── vendors/
│   │   └── audits/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   └── grc/
└── ...
```

## License

This project is for demonstration purposes.
