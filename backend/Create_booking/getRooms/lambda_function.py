import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):

    # Select your DynamoDB table
    table_name = 'rooms'  # Replace with your actual table name
    table = dynamodb.Table(table_name)

    # Scan the table to retrieve all items
    response = table.scan()
    items = response.get('Items', [])
    return {
        'statusCode': 200,
        'body': json.dumps(items)
    }