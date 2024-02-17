import json
import urllib.parse
import boto3
from io import BytesIO
import PyPDF2
import http.client
import logging
import os

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Set to DEBUG for more detailed logging

# Initialize Boto3 S3 client
s3 = boto3.client('s3')

def lambda_handler(event, context):
    logger.info("Event: " + json.dumps(event))  # Log the received event

    # Get bucket name and object key from the Lambda event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    logger.info(f"Processing PDF from Bucket: {bucket_name}, Key: {object_key}")

    if object_key.endswith('.pdf'):
        try:
            # Get the PDF file from S3
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            file_stream = response['Body']
            logger.info("Successfully retrieved the PDF file from S3")

            # Use BytesIO for PyPDF2 compatibility
            with BytesIO(file_stream.read()) as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                text_content = []

                # Extract text from each page
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:  # Check if text was extracted
                        text_content.append(page_text)
                    else:
                        logger.warning("A page could not be converted to text.")

                # Join all text into a single string
                full_text = "\n".join(text_content)

            # Prepare payload for the API request
            payload = json.dumps({"fileName": object_key, "doc": full_text})
            logger.info("Sending extracted text to API")

            # Send `full_text` to API using http.client
            conn = http.client.HTTPSConnection("ascend-six.vercel.app")
            headers = {'Content-type': 'application/json'}
            # Example of sending a single document's text with metadata
            payload = json.dumps({
                "doc": [
                    {
                        "metadata": {
                            "source": object_key,
                        },
                        "pageContent": full_text,
                    }
                ]
            })

            conn.request("POST", "/api/setup/aws-lambda", payload, headers)
            response = conn.getresponse()
            response_data = response.read().decode()
            logger.info(f"API Response: {response_data}")

            return {
                'statusCode': 200,
                'body': json.dumps('PDF processed successfully!')
            }
        except Exception as e:
            logger.error("An error occurred", exc_info=True)
            return {
                'statusCode': 500,
                'body': json.dumps('Error processing PDF file.')
            }
    else:
        logger.warning("File is not a PDF.")
        return {
            'statusCode': 400,
            'body': json.dumps('Not a PDF file.')
        }
