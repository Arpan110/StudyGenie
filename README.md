# StudyGenie - AI-Powered Study Assistant

StudyGenie is a smart web application designed to enhance students' productivity by combining AI-powered features with personal study planning tools.

## 🚀 Features

- **🤖 AI Chat Assistant**: Ask academic questions and get detailed explanations powered by Google's Gemini AI
- **📄 PDF & Notes Summarizer**: Upload PDFs or notes for instant summarization and quiz generation
- **📅 Smart Study Planner**: Schedule study tasks, get reminders, and visualize your study week
- **🖥️ Modern UI/UX**: Built with React and Tailwind CSS, fully responsive design

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js 14, Tailwind CSS
- **AI Integration**: Google Gemini AI via AI SDK
- **Backend**: Next.js API Routes
- **UI Components**: Radix UI, Lucide React Icons
- **Styling**: Tailwind CSS with custom gradients

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API Key (Gemini)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd study-genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   ```

## 🌐 Deployment

**Vercel Deployment**

StudyGenie can be easily deployed to Vercel. We've included configuration files to make this process smooth.

Push your code to GitHub

Go to Vercel and import your GitHub repository

Configure your environment variables in the Vercel dashboard

Click Deploy — you're live! 🚀

## 🏃‍♂️ Running Locally

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI (Gemini) API key
- `NODE_ENV`: Environment (development/production)

### API Endpoints

- `/api/chat` - AI chat assistant
- `/api/summarize` - PDF and text summarization
- `/api/generate-quiz` - Quiz question generation
- `/api/test` - Test API connection

## 📱 Usage

### AI Chat Assistant
1. Navigate to the Chat page
2. Ask any academic question
3. Get detailed explanations and step-by-step solutions

### PDF Summarizer
1. Go to the Summarizer page
2. Upload a PDF or paste text
3. Generate summaries or create quiz questions

### Study Planner
1. Access the Planner page
2. Add study tasks with priorities
3. Track your progress and manage your schedule

# 🚀 Deployment

**Deploy to Vercel**

Connect your repository to Vercel

Add environment variables in the Vercel dashboard:
   - GOOGLE_GENERATIVE_AI_API_KEY

Deploy – Vercel will automatically build and deploy your project 🎉

## 🔒 Security

- API keys are stored in environment variables
- Server-side API routes protect sensitive operations
- Input validation and error handling implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API integration guides

## 🔮 Future Enhancements

- Firebase integration for real-time data
- User authentication and profiles
- Push notifications for study reminders
- Advanced PDF text extraction
- Mobile app version
- Collaborative study features

---

Built with ❤️ for students worldwide
