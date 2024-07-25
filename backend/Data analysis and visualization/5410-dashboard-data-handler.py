import os
import requests
import json
import pandas as pd
from google.cloud import storage

# Set key credentials file path
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'Auth.json'


def lambda_handler(event, context):
    """
    AWS Lambda function to fetch user login statistics, convert it to CSV, and upload to Google Cloud Storage.

    Args:
        event (dict): AWS Lambda event.
        context (object): AWS Lambda context.

    Returns:
        dict: HTTP response indicating the result of the operation.
    """
    try:
        # Fetch user login statistics from the provided URL
        response = requests.get('https://vpznk6pi7lmydtyhmt6hvt5ori0flxcj.lambda-url.us-east-1.on.aws/')
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps('Error fetching user login statistics.')
        }

    try:
        # Parse the JSON response
        users_login_statistics = response.json()
        print(users_login_statistics)

        # Convert data to a pandas DataFrame
        data = [statistic for statistic in users_login_statistics]
        df = pd.DataFrame(data)[['user_id', 'loginTimestamp']]
        print(df.head())
    except (ValueError, KeyError) as e:
        print(f"Error processing data: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps('Error processing user login statistics.')
        }

    try:
        # Initialize Google Cloud Storage client
        storage_client = storage.Client()

        # Specify the GCS bucket and blob
        bucket = storage_client.bucket('5410-dashboard-bucket')
        blob = bucket.blob('users_login_statistics.csv')

        # Upload the DataFrame as a CSV to the specified blob
        blob.upload_from_string(df.to_csv(index=False), 'text/csv')
    except Exception as e:
        print(f"Error uploading to GCS: {e}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET'
            },
            'body': json.dumps('Error uploading CSV to Google Cloud Storage.')
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': json.dumps('CSV uploaded to GCS!')
    }
