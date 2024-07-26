import json
import boto3
from datetime import datetime
# Initialize Boto3 client
dynamodb = boto3.resource('dynamodb')

TABLE_NAME_LOGIN = 'UserLoginTimestamps'

def lambda_handler(event, context):
    try:
        # Get the current time in UTC formmat to generalise
        utc_time = datetime.utcnow()

        # Format UTC time to ISO 8601 format so that it is feasible to process
        utc_time_iso = utc_time.isoformat()

        # Parse incoming JSON request body that it is getting in the event
        body = json.loads(event['body'])
        user_id = body['userId']

        # Store user ID and login timestamp in DynamoDB
        store_login_info(user_id, utc_time_iso)

        # Prepare response to be sent back as json
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'User login info stored successfully',
            })
        }

    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error storing user login info',
                'error': str(e)
            })
        }

    return response

# Method to record the login timestamp in the dynaoDB table
def store_login_info(user_id, login_timestamp):
    try:
        table = dynamodb.Table(TABLE_NAME_LOGIN)
        item = {
            'user_id': user_id,
            'loginTimestamp': login_timestamp
        }
        table.put_item(Item=item)
        print('User login info stored in DynamoDB')
    except Exception as e:
        print(f'Error storing user login info in DynamoDB: {str(e)}')
        raise
