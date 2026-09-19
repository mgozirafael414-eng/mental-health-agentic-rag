\# MindCare — Mental Health Agentic RAG Platform



MindCare is a production-oriented mental health and wellness support platform that combines conversational AI, Retrieval-Augmented Generation (RAG), wellness tracking, professional support, and administrative management in one web application.



The system is designed to provide users with accessible, supportive, and context-aware mental health and wellness assistance while maintaining clear boundaries around clinical diagnosis and treatment.



\---



\## 🌱 Project Overview



MindCare provides a conversational environment where users can:



\* Chat with an AI wellness assistant

\* Receive responses grounded in trusted mental health resources

\* Track personal wellness information

\* Review Mood, Stress, Energy, and other wellness information

\* Receive personalized wellness guidance

\* Manage conversations

\* Access mental health resources

\* Interact with professional support features

\* Receive notifications

\* Manage appointments where available



Administrators can manage users, professionals, notifications, appointments, and other administrative functions.



Professionals have access to dedicated functionality for supporting users through the platform.



\---



\## ✨ Main Features



\### 🤖 AI Mental Health Assistant



The MindCare assistant provides supportive conversational responses for topics such as:



\* Stress

\* Study pressure

\* Emotional wellbeing

\* Motivation

\* Daily challenges

\* Communication

\* Relationships

\* General wellness



The assistant uses the existing Agentic RAG architecture to retrieve relevant information from the project's knowledge resources before generating responses.



\---



\### 📚 Agentic RAG



MindCare uses Retrieval-Augmented Generation to improve the relevance of AI responses.



The RAG pipeline includes:



1\. Mental health resource documents

2\. Document ingestion

3\. Text chunking

4\. Embedding generation

5\. Resource retrieval

6\. Context construction

7\. LLM response generation



This allows the assistant to use relevant information from the project's knowledge base instead of relying only on general model knowledge.



\---



\### 🧠 Wellness Check



Users can record wellness information such as:



\* Mood

\* Stress

\* Energy

\* Sleep, when available



The system stores wellness check-ins and can use the user's recent wellness information to provide more personalized support.



The assistant should use the authenticated user's actual wellness records and should not invent missing values.



\---



\### 💬 Conversations



Users can maintain conversations with the MindCare assistant.



The application supports:



\* Starting new conversations

\* Sending messages

\* Viewing previous conversations

\* Continuing existing conversations

\* Personalized conversational context



\---



\### 🔔 Notifications



MindCare includes notification functionality for communication between the platform and its users.



Administrators can send notifications to:



\* All active users

\* Users

\* Professionals

\* A specific user

\* A specific professional



Users can view notifications from their account.



\---



\### 👨‍⚕️ Professional Support



The platform includes functionality for professional users.



Professional features include areas for:



\* Professional dashboards

\* User support

\* Communication

\* Notes

\* Appointments

\* Professional-specific information



\---



\### 🛡️ Administration



MindCare provides an administrative interface for managing platform operations.



Administrative functionality includes:



\* User management

\* Professional management

\* Appointments

\* Notifications

\* Dashboard information

\* Audit-related functionality

\* Administrative communication



\---



\## 👥 User Roles



MindCare supports role-based access.



| Role           | Description                         |

| -------------- | ----------------------------------- |

| `USER`         | Regular platform user               |

| `PROFESSIONAL` | Mental health/wellness professional |

| `ADMIN`        | Platform administrator              |

| `OWNER`        | Highest-level administrative role   |



Access to features is controlled according to the authenticated user's role.



\---



\# 🏗️ System Architecture



MindCare uses a separate frontend and backend architecture.



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │      MindCare       │

&#x20;                   │       Frontend      │

&#x20;                   │     React + Vite    │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │      MindCare       │

&#x20;                   │       Backend       │

&#x20;                   │ Express + Node.js   │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;             ┌────────────────┼────────────────┐

&#x20;             │                │                │

&#x20;             ▼                ▼                ▼

&#x20;         PostgreSQL        Prisma            RAG

&#x20;         Database           ORM           Pipeline

&#x20;                                              │

&#x20;                                              ▼

&#x20;                                       Knowledge Resources

&#x20;                                              │

&#x20;                                              ▼

&#x20;                                          LLM Service

```



\---



\# 🛠️ Technology Stack



\## Frontend



\* React

\* Vite

\* JavaScript

\* CSS

\* Lucide React



\## Backend



\* Node.js

\* Express

\* REST API

\* JWT Authentication



\## Database



\* PostgreSQL

\* Prisma ORM



\## AI / RAG



\* Large Language Model integration

\* Retrieval-Augmented Generation

\* Text embeddings

\* Mental health resource documents



\## Deployment



The project is designed to support cloud deployment using platforms such as Vercel and managed PostgreSQL services.



\---



\# 📁 Project Structure



```text

mental-health-agentic-rag/

│

├── backend/

│   ├── prisma/

│   │   ├── migrations/

│   │   └── schema.prisma

│   │

│   └── src/

│       ├── controllers/

│       │   ├── adminController.js

│       │   ├── appointmentController.js

│       │   ├── authController.js

│       │   ├── chatController.js

│       │   ├── professionalCommunicationController.js

│       │   ├── professionalController.js

│       │   └── wellnessController.js

│       │

│       ├── rag/

│       │   ├── scripts/

│       │   │   └── ingestResources.js

│       │   └── services/

│       │       └── resourceIngestionService.js

│       │

│       ├── routes/

│       │   ├── adminRoutes.js

│       │   ├── professionalCommunicationRoutes.js

│       │   └── wellnessRoutes.js

│       │

│       ├── services/

│       │   └── llmService.js

│       │

│       └── server.js

│

├── frontend/

│   └── src/

│       ├── AdminApp.jsx

│       ├── App.jsx

│       ├── ProfessionalApp.jsx

│       ├── services/

│       │   └── api.js

│       └── ...

│

└── README.md

```



\---



\# 🔐 Authentication



MindCare uses JWT-based authentication.



After login, the authenticated user receives a token that is used when communicating with protected backend endpoints.



The system uses the authenticated user's identity to provide role-based access and personalized information.



\---



\# 🧠 Personalization



Personalization is designed around the authenticated user.



For example, when a user asks:



> "Kwa kuzingatia taarifa nilizoweka kwenye Wellness Check, hali yangu ya sasa inaonyesha nini?"



MindCare should:



1\. Identify the authenticated user.

2\. Retrieve that user's wellness records.

3\. Use the latest valid record for the current state.

4\. Clearly distinguish current and historical information.

5\. Avoid fabricating missing information.

6\. Generate a practical response based on the available data.



\---



\# ⚙️ Local Development



\## 1. Clone the repository



```bash

git clone https://github.com/mgozirafael414-eng/mental-health-agentic-rag.git

cd mental-health-agentic-rag

```



\---



\## 2. Backend Setup



```bash

cd backend

npm install

```



Create the required environment configuration.



Example:



```env

DATABASE\_URL=your\_postgresql\_connection\_string

JWT\_SECRET=your\_jwt\_secret

GROQ\_API\_KEY=your\_groq\_api\_key

```



Run Prisma:



```bash

npx prisma generate

```



Apply the database schema/migrations according to the project's current database configuration.



Start the backend:



```bash

npm run dev

```



The local backend runs on:



```text

http://localhost:5000

```



\---



\## 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

```



Configure the frontend API URL if required:



```env

VITE\_API\_URL=http://localhost:5000

```



Start the frontend:



```bash

npm run dev

```



The Vite development server will provide the local frontend URL.



\---



\# 🔑 Environment Variables



The application may require environment variables such as:



| Variable       | Purpose                        |

| -------------- | ------------------------------ |

| `DATABASE\_URL` | PostgreSQL database connection |

| `JWT\_SECRET`   | JWT authentication secret      |

| `GROQ\_API\_KEY` | LLM API access                 |

| `VITE\_API\_URL` | Frontend backend API URL       |



\*\*Never commit real API keys, database passwords, JWT secrets, or other credentials to GitHub.\*\*



Use environment variables in local development and deployment platforms.



\---



\# 🗄️ Database



MindCare uses PostgreSQL with Prisma ORM.



The Prisma schema is located at:



```text

backend/prisma/schema.prisma

```



Database migrations are stored under:



```text

backend/prisma/migrations/

```



After database model changes, use the appropriate Prisma migration workflow for the environment.



\---



\# 📖 RAG Resources



Mental health resources are stored and processed through the RAG pipeline.



The ingestion process can:



1\. Read resource documents

2\. Process the content

3\. Split content into chunks

4\. Generate embeddings

5\. Store information for retrieval

6\. Make relevant resources available to the AI assistant



Relevant RAG files are located under:



```text

backend/src/rag/

```



\---



\# 🔒 Privacy and Safety



MindCare is designed as a supportive wellness application.



The AI assistant should:



\* Provide supportive information

\* Encourage healthy coping strategies

\* Avoid diagnosing mental health conditions

\* Avoid prescribing medication

\* Avoid pretending to be a licensed clinician

\* Protect user-specific information

\* Use authenticated user context for personalization



For serious or immediate safety concerns, users should seek appropriate emergency or professional support.



\---



\# 🧪 Testing



Testing should cover the main application areas:



\### User



\* Registration

\* Login

\* Chat

\* New conversation

\* Conversation history

\* Wellness Check

\* Notifications

\* Resources



\### Administrator



\* Admin login

\* Dashboard

\* User management

\* Professional management

\* Appointments

\* Notifications

\* Administrative functions



\### Professional



\* Professional login

\* Dashboard

\* User support

\* Communication

\* Notes

\* Appointments



\### AI / RAG



\* General wellness questions

\* Study stress questions

\* Personalized wellness questions

\* Resource-grounded responses

\* Out-of-scope questions

\* Safety-related conversations



\---



\# 🚀 Deployment



MindCare can be deployed using a cloud architecture consisting of:



```text

Frontend

&#x20;  ↓

Vercel



Backend

&#x20;  ↓

Vercel / Node.js-compatible hosting



Database

&#x20;  ↓

Managed PostgreSQL

```



Environment variables must be configured separately for the production environment.



\---



\# 📌 Current Development Status



MindCare is an actively developed project.



Implemented areas include:



\* React frontend

\* Express backend

\* JWT authentication

\* Role-based access

\* PostgreSQL + Prisma

\* AI chatbot

\* RAG architecture

\* Wellness Check

\* Admin dashboard

\* Notifications

\* Professional functionality

\* Appointments

\* Resource ingestion

\* Personalized wellness context



Some production integrations and endpoints may still require additional testing and debugging before the system can be considered fully production-ready.



\---



\# 🎯 Project Goals



The main goals of MindCare are to:



1\. Provide accessible mental health and wellness support.

2\. Use RAG to improve the relevance of AI-generated responses.

3\. Personalize support using user-provided wellness information.

4\. Connect users with professional support functionality.

5\. Provide administrative tools for managing the platform.

6\. Maintain responsible AI and safety boundaries.

7\. Build a scalable web-based mental health support platform.



\---



\# 👨‍💻 Developer



\*\*Rafael Mgozi\*\*



GitHub:



`mgozirafael414-eng`



Repository:



`mental-health-agentic-rag`



\---



\# 📄 License



This project is currently under development.



Add an appropriate open-source license before distributing the project publicly if required.



