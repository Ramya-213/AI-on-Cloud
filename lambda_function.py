"""
PROJECT 2: AI on Cloud - AWS Lambda Function
CodTech Cloud Computing Internship

Deploy this as an AWS Lambda function (Python 3.11)
Trigger: API Gateway POST /analyze

IAM Permissions needed:
  - comprehend:DetectSentiment
  - comprehend:DetectLanguage
"""

import json
import boto3
import logging

# Set up logging (visible in CloudWatch Logs)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS Comprehend client
comprehend = boto3.client('comprehend', region_name='us-east-1')


def lambda_handler(event, context):
    """
    Main Lambda handler.
    Receives text via POST body and returns sentiment analysis from AWS Comprehend.
    """
    logger.info(f"Received event: {json.dumps(event)}")

    # --- CORS headers for browser access ---
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    }

    # Handle preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        text = body.get('text', '').strip()

        # Input validation
        if not text:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Text field is required'})
            }

        if len(text) > 5000:  # Comprehend limit
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Text too long (max 5000 chars)'})
            }

        # --- Call Amazon Comprehend: Detect Dominant Language ---
        lang_response = comprehend.detect_dominant_language(Text=text)
        language_code = lang_response['Languages'][0]['LanguageCode']
        logger.info(f"Detected language: {language_code}")

        # --- Call Amazon Comprehend: Detect Sentiment ---
        sentiment_response = comprehend.detect_sentiment(
            Text=text,
            LanguageCode=language_code
        )
        logger.info(f"Sentiment: {sentiment_response['Sentiment']}")

        # Build response
        result = {
            'Sentiment': sentiment_response['Sentiment'],
            'SentimentScore': sentiment_response['SentimentScore'],
            'LanguageCode': language_code,
            'ResponseMetadata': {
                'RequestId': context.aws_request_id,
                'HTTPStatusCode': 200,
                'ServiceName': 'Amazon Comprehend',
                'Region': 'us-east-1'
            }
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(result)
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }