# Find Your Faculty

A centralized web application for students of VIT Vellore to search, rate, review, and bookmark faculty members. This project solves the issue of scattered and repeated faculty review requests across WhatsApp groups.

---

## Problem

During FFCS, students often ask for faculty reviews in various WhatsApp groups. This leads to:
- Repeated requests for the same faculty
- Scattered or missing information
- Important messages getting lost in spam

---

## Solution

Find Your Faculty provides a centralized platform where:
- Faculty data is scraped from VTOP and made searchable
- Students can rate faculty based on overall performance, notes, and marks
- Users can submit text-based reviews, checked by a basic profanity filter
- Students can bookmark preferred faculties
- Students can upload FFCS screenshots; faculty names are extracted using OCR and auto-bookmarked
- Students can request reviews if not available; most requested faculties appear on the homepage
- Users can report biased or inappropriate reviews, which are flagged and sent to the admin panel
- Users can mark reviews as helpful or not helpful to improve trustworthiness

---

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/find-your-faculty.git
cd find-your-faculty
```

### 2. Create ```.env``` file

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

## Design Link

You can view the design here:  
[View Design](https://www.figma.com/design/DfD9Rk1aoaaKVjzTwF0xNv/Untitled?node-id=0-1&t=Wz0T5Q57Pt3uJvkV-1)
