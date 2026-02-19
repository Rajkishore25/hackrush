# JobShield AI - Recruitment Fraud Detection System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)

An AI-powered platform that analyzes job offers, emails, and chat messages to detect recruitment scams and fraudulent job postings. Built for HackRush hackathon.

## 🚀 Features

- **AI-Powered Scam Detection**: Uses Groq's Llama 3.3 70B model for intelligent fraud analysis
- **Multi-Input Support**: Analyze text, emails, chat messages, and job descriptions
- **Risk Scoring**: 0-100 risk score with categorization (Low, Moderate, High, Critical)
- **Detailed Analysis**:
  - Red flag detection
  - Suspicious phrase identification
  - Company verification
  - Salary plausibility analysis
- **PDF Report Generation**: Export detailed forensic reports
- **Real-time Dashboard**: Track scan history and statistics
- **Responsive UI**: Built with React, Tailwind CSS, and shadcn/ui

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Wouter for routing

### Backend
- Node.js 20+
- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- PDFKit for report generation

### AI/ML
- Groq API (Llama 3.3 70B)
- OpenAI API (fallback)
- Custom mock analyzer

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database (or use free Neon PostgreSQL)
- Groq API key (free at https://console.groq.com)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Rajkishore25/hackrush.git
cd hackrush
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=your_postgresql_connection_string

# Groq API Key (FREE - get from https://console.groq.com)
GROQ_API_KEY=your_groq_api_key

# Session Configuration
SESSION_SECRET=your_random_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🗄️ Database Setup

### Option 1: Free Neon PostgreSQL (Recommended for testing)

1. Go to https://console.groq.com
2. Sign up for free (no credit card required)
3. Use the CLI tool:
```bash
npx get-db -y
```
4. Copy the `DATABASE_URL` to your `.env` file

### Option 2: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
```sql
CREATE DATABASE jobshield;
```
3. Update `.env` with your connection string:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/jobshield
```

## 🔑 Getting API Keys

### Groq API (Free & Recommended)

1. Visit https://console.groq.com
2. Sign up for a free account (no credit card required)
3. Navigate to "API Keys" in the left menu
4. Click "Create API Key"
5. Copy the key and add it to your `.env` file

### OpenAI API (Optional)

1. Visit https://platform.openai.com/api-keys
2. Create an account and add billing
3. Generate an API key
4. Add to `.env` as `OPENAI_API_KEY`

## 📖 Usage

### Analyzing Content

1. Navigate to the dashboard
2. Select input type (Text, Email, Chat, Job Description)
3. Paste or type the content to analyze
4. Click "Analyze"
5. View the risk assessment and detailed analysis

### Generating Reports

1. After analyzing content, click "Generate Report"
2. A PDF report will be created with:
   - Risk level and score
   - Detected red flags
   - Suspicious phrases
   - Company verification status
   - Salary analysis
   - Detailed recommendations

### Dashboard Features

- View all past scans
- Track risk statistics
- Filter by risk level
- Export reports

## 🏗️ Project Structure

```
hackrush/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── mockAI.ts          # Fallback AI analyzer
│   └── replit_integrations/ # Auth & integrations
├── shared/                # Shared types and schemas
│   ├── schema.ts          # Database schema
│   └── routes.ts          # API route definitions
└── package.json
```

## 🔒 Security Features

- Session-based authentication
- Environment variable protection
- SQL injection prevention via Drizzle ORM
- Input validation with Zod
- Secure cookie handling
- API key encryption

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Ensure all environment variables are set:
- `DATABASE_URL`
- `GROQ_API_KEY`
- `SESSION_SECRET`
- `NODE_ENV=production`

## 🧪 Testing

The application includes:
- Mock AI analyzer for testing without API keys
- Automatic fallback mechanisms
- Error handling and logging

## 📊 AI Models Used

1. **Primary: Groq Llama 3.3 70B**
   - Fast inference
   - Free tier available
   - Excellent for text analysis

2. **Fallback: OpenAI GPT-4o**
   - High accuracy
   - Requires paid API key

3. **Last Resort: Mock Analyzer**
   - Keyword-based detection
   - Works offline
   - No API required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Raj Kishore**
- GitHub: [@Rajkishore25](https://github.com/Rajkishore25)
- Project: Auto-Dock It! AI

## 🙏 Acknowledgments

- Built for HackRush Hackathon
- Powered by Groq AI
- UI components from shadcn/ui
- Icons from Lucide React

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This tool is designed to assist in identifying potential scams but should not be the sole basis for decision-making. Always verify job offers through official channels and conduct your own due diligence.
