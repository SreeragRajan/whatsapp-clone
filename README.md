
# WhatsApp Web Clone (Evaluation Task)

This repository is a local scaffold for the Full Stack Developer Evaluation Task (WhatsApp Web clone).
It includes a backend (Node.js + Express + Mongoose) and a minimal frontend (Vite + React).

## What I included
- Backend with REST APIs and a payload processor scripted to work with the uploaded webhook files.
- Frontend that lists conversations and shows messages with a send box.
- The uploaded webhook JSON files are placed under `backend/payloads/`.

## How to run locally (high level)
1. Install Node.js (>=18 recommended).
2. Create a MongoDB (Atlas or local) and copy the URI to `backend/.env` as `MONGODB_URI`.
3. Backend:
   - cd backend
   - npm install
   - copy .env.example -> .env and set MONGODB_URI
   - npm run process-payloads   # to populate DB with the provided webhook files
   - npm run dev
4. Frontend:
   - cd frontend
   - npm install
   - set VITE_API_BASE to your backend URL (default http://localhost:4000/api) in .env or hosting platform
   - npm run dev

## Notes
- This project structure is ready to be extended and deployed.
- The payload processor is adapted to the webhook format you uploaded (metaData.entry[].changes[].value).

