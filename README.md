# Project 2: AI on Cloud – Sentiment Analyzer using AWS Comprehend

## Intern Details
-Intern ID:CITS821
-Name:Thalatam Ramya Prasanna
-Internship duration:6 Weeks
-Domain:Cloud Computing

## CodTech Cloud Computing Internship

| Field | Details |
|-------|---------|
| **Project Name** | AI on Cloud – NLP Sentiment Analysis |
| **Project Scope** | Build an AI-powered web app using Amazon Comprehend for real-time text sentiment analysis |
| **Tech Stack** | AWS Comprehend, AWS Lambda, API Gateway, Python, HTML/CSS/JS |

---

## 📌 Project Overview

This project demonstrates using **AWS AI/ML Services** to perform Natural Language Processing (NLP) in the cloud:
- **Amazon Comprehend** – Managed NLP service for sentiment analysis
- **AWS Lambda** – Python backend that calls Comprehend API
- **API Gateway** – REST endpoint to connect frontend to Lambda

---

## 🗂️ Folder Structure

```
project2-ai-on-cloud/
├── index.html           # Frontend UI
├── style.css            # Styling
├── script.js            # Frontend JS (calls API)
├── lambda_function.py   # AWS Lambda backend (Python)
└── README.md
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Lambda Function
```
1. AWS Console → Lambda → Create Function
2. Runtime: Python 3.11
3. Paste lambda_function.py code
4. Add IAM permission: AmazonComprehendReadOnly
```

### Step 2: Create API Gateway
```
1. API Gateway → Create REST API
2. Create POST method → Lambda Proxy Integration
3. Enable CORS
4. Deploy to stage: prod
5. Copy the Invoke URL
```

### Step 3: Update Frontend
```javascript
// In script.js, update:
const API_ENDPOINT = 'https://YOUR_ID.execute-api.us-east-1.amazonaws.com/prod/analyze';
```

### Step 4: Test the API
```bash
curl -X POST https://YOUR_URL/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I love using AWS Comprehend!"}'
```

### Expected Response:
```json
{
  "Sentiment": "POSITIVE",
  "SentimentScore": {
    "Positive": 0.9987,
    "Negative": 0.0002,
    "Neutral": 0.0009,
    "Mixed": 0.0002
  },
  "LanguageCode": "en"
}
```

---

## 💡 Key Concepts Learned
- Amazon Comprehend NLP service
- AWS Lambda serverless functions
- API Gateway REST APIs
- Python boto3 AWS SDK
- CORS configuration for web APIs
- Cloud-based AI without ML expertise