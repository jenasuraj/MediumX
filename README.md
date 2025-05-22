<h1>📝 Full-Stack Blog App</h1>

A powerful full-stack blogging platform that allows users to create, read, update, and delete blog posts. It integrates AI-powered features using LangChain for content suggestions and enhancements. Built with modern technologies including Next.js, Express, FastAPI, and LangChain.

<br/>

<h2>🚀 Tech Stack</h2>

Frontend (Next.js)
<br/>
Backend (Node)<br/>
Backend (Python)

<br/>

<h2>🔧 Features </h2>

🔐 User Authentication (login/register)<br/>
✍️ Create, Read, Update, Delete (CRUD) for blog posts<br/>
🧠 AI-generated suggestions using LangChain<br/>
📦 REST APIs built with Express and FastAPI<br/>
🌐 Modern UI with responsive design<br/>
🔄 Real-time updates and seamless client-server communication

<br/>

<h2>📁 Project Structure</h2>
blog-app/<br/>
├── client/               # Next.js frontend<br/>
├── server-node/          # Express.js backend for auth and REST APIs<br/>
├── server-python/        # FastAPI backend for AI/ML features<br/>
├── README.md


<h1>🛠️ Installation</h1>
<br/>
<h2>1. Clone the Repository</h2><br/>
git clone git@github.com:jenasuraj/MediumX.git<br/>
cd MediumX
<br/>

<h2>2. Frontend Setup (Next.js)</h2><br/>
cd client<br/>
npm install<br/>
npm run dev

<br/>

<h2>3. Node Backend (Express)</h2>h2<br/>
cd ../server-node</br>
npm install<br/>
node index.js<br/>

<br/>

<h2>4. Python Backend (FastAPI + LangChain)</h2><br/>
cd ../server-python <br/>
pip install -r requirements.txt<br/>
uvicorn app:app --reload

<br/>



<h2>📌 To-Do</h2> <br/>

 Add file upload for images<br/>
 Enable markdown support<br/>
 Add social media sharing<br/>
 Deploy on Vercel (frontend) and Render/Heroku (backends)<br/>



<h2>🧑‍💻 Author</h2> <br/>
Your Name – Suraj jena




For database integration (e.g., PostgreSQL, MySQL, MongoDB), configure your database URI in the respective .env files and use an ORM like Prisma (for Express) or SQLAlchemy (for FastAPI).
