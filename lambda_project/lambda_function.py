import json
import urllib.parse
import boto3
from io import BytesIO
import PyPDF2
import http.client
import logging
import os
import chardet

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Set to DEBUG for more detailed logging

# Initialize Boto3 S3 client
s3 = boto3.client("s3")


def decode_with_chardet(file_bytes):
    result = chardet.detect(file_bytes)
    encoding = result["encoding"]
    return file_bytes.decode(encoding)


def lambda_handler(event, context):
    logger.info("Event: " + json.dumps(event))  # Log the received event

    # Get bucket name and object key from the Lambda event
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = urllib.parse.unquote_plus(event["Records"][0]["s3"]["object"]["key"])
    logger.info(f"Processing file from Bucket: {bucket_name}, Key: {object_key}")

    file_extension = object_key.split(".")[-1].lower()

    if file_extension == "pdf":
        try:
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            file_stream = response["Body"]

            with BytesIO(file_stream.read()) as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                text_content = [
                    page.extract_text()
                    for page in pdf_reader.pages
                    if page.extract_text()
                ]

            full_text = "\n".join(text_content)
        except Exception as e:
            logger.error("An error occurred processing the PDF file", exc_info=True)
            return {"statusCode": 500, "body": json.dumps("Error processing PDF file.")}
    elif file_extension == "txt":
        try:
            response = s3.get_object(Bucket=bucket_name, Key=object_key)
            file_stream = response["Body"]

            # Reading the file content as bytes
            file_bytes = file_stream.read()
            # Now decode
            full_text = decode_with_chardet(file_bytes)
        except Exception as e:
            logger.error("An error occurred processing the TXT file", exc_info=True)
            return {"statusCode": 500, "body": json.dumps("Error processing TXT file.")}
    else:
        logger.warning("Unsupported file type.")
        return {"statusCode": 400, "body": json.dumps("Unsupported file type.")}

    # Sending extracted text to API (Common for both PDF and TXT)
    try:
        logger.info("Sending extracted text to API")
        conn = http.client.HTTPSConnection("ascend-six.vercel.app")
        headers = {"Content-type": "application/json"}
        payload = json.dumps(
            {"doc": [{"metadata": {"source": object_key}, "pageContent": full_text}]}
        )

        conn.request("POST", "/api/setup/aws-lambda", payload, headers)
        response = conn.getresponse()
        response_data = response.read().decode()
        logger.info(f"API Response: { response_data }")

        return {"statusCode": 200, "body": json.dumps("File processed successfully!")}
    except Exception as e:
        logger.error("An error occurred sending data to the API", exc_info=True)
        return {"statusCode": 500, "body": json.dumps("Error sending data to the API.")}
