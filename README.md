# SaaS Contracts Management Platform

A modern, full-stack SaaS application for contract management with AI-powered search capabilities.

## 🚀 Live Demo
https://saas-contracts-platform.vercel.app/

## ✨ Features Implemented

### 🔐 Authentication System
- **Multi-tenant user authentication** using Supabase Auth
- **JWT-based security** with automatic session management
- **Secure sign-up/sign-in flows** with email validation
- **Protected routes** ensuring data isolation between users

### 📊 Contract Dashboard
- **Professional table interface** displaying contract metadata
- **Status indicators** (Active, Renewal Due, Expired) with color coding
- **Risk assessment badges** (Low, Medium, High risk) for quick evaluation
- **File management** with download and delete capabilities
- **Responsive design** optimized for desktop and mobile

### 🔍 Intelligent Search & Query
- **Full-text search** across contract content and metadata
- **Natural language querying** with highlighted search results
- **Quick search suggestions** for common contract terms
- **Advanced filtering** by contract attributes
- **Search result pagination** with relevance scoring

### 📁 Document Upload System
- **Drag-and-drop file upload** with visual feedback
- **Multiple file format support** (PDF, TXT, DOCX)
- **Automatic metadata extraction** and storage
- **File size validation** and error handling
- **Progress indicators** for upload status

### 🎨 Professional UI/UX
- **Responsive sidebar navigation** with mobile hamburger menu
- **Modern design system** using Tailwind CSS
- **Consistent component library** with professional styling
- **Loading states and error handling** for smooth user experience
- **Accessibility features** with proper ARIA labels

## 🛠 Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Modern hooks** and context for state management

### Backend Infrastructure
- **Supabase** as Backend-as-a-Service platform
- **PostgreSQL** with pgvector extension for vector similarity search
- **Row Level Security (RLS)** for multi-tenant data isolation
- **Auto-generated REST APIs** with real-time subscriptions
- **Supabase Storage** for secure file management

### Database Schema
-- Users table with authentication integration
users (user_id, username, email, password_hash, created_at)

-- Documents table with comprehensive metadata
documents (doc_id, user_id, contract_name, filename, parties,
status, risk_score, uploaded_on, expiry_date, file_size)

-- Chunks table for AI/RAG functionality
chunks (chunk_id, doc_id, user_id, text_chunk, embedding,
chunk_index, page_number, created_at)

### Security Features
- **JWT authentication** with automatic token refresh
- **Row-level security policies** ensuring user data isolation
- **Input validation** and sanitization
- **HTTPS-only** communication in production
- **Environment variable** protection for sensitive keys

## 🧪 Test Credentials
Email: real_email_address
Password: password123
## 🚀 Deployment Architecture
- **Frontend**: Netlify with automatic deployments
- **Database**: Supabase managed PostgreSQL
- **Storage**: Supabase Storage with CDN
- **Environment**: Production-grade with environment variables

## 💡 AI & Modern Development Approach

This project showcases modern AI-assisted development:
- **AI-generated frontend** using Bolt.new for rapid prototyping
- **Expert-configured backend** with production-ready Supabase setup
- **Vector database implementation** ready for RAG/AI features
- **Scalable architecture** supporting future AI enhancements

## 🏗 Local Development Setup

Clone repository
git clone [your-repo-url]
cd saas-contracts-platform

Install dependencies
npm install

Environment setup
cp .env.example .env

Add your Supabase credentials to .env
Start development server
npm run dev

Build for production
npm run build

text

## 📈 Performance & Scalability
- **Optimized bundle size** with Vite tree-shaking
- **Lazy loading** for improved initial load times
- **Database indexing** for fast query performance
- **CDN-delivered assets** for global performance
- **Responsive caching** strategies

## 🔮 Future Enhancements Ready
- **AI-powered contract analysis** with pre-built vector embeddings
- **Advanced search** with semantic similarity
- **Document parsing** pipeline with LlamaCloud integration
- **Real-time collaboration** features
- **Advanced analytics** dashboard

Built with modern development practices demonstrating full-stack proficiency, AI integration readiness, and production deployment capabilities.
