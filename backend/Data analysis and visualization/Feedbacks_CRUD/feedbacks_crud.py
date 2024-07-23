import json
import boto3
from botocore.exceptions import ClientError
import uuid
from boto3.dynamodb.conditions import Key

# Create a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
dynamodb_table = dynamodb.Table('users_feedbacks_table')

# Define paths for different operations
STATUS_CHECK_PATH = '/status'
FEEDBACK_PATH = '/feedback'
FEEDBACKS_PATH = '/feedbacks'


def lambda_handler(event, context):
    """
    Main handler function for the AWS Lambda.

    Args:
        event (dict): The event data containing HTTP method and parameters.
        context (object): The runtime information of the Lambda function.

    Returns:
        dict: Response containing status code and message or data.
    """
    print('Request event: ', event)
    response = None

    try:
        http_method = event.get('httpMethod')
        path = event.get('path')

        if http_method == 'GET' and path == STATUS_CHECK_PATH:
            response = build_response(200, {'message': 'Service is operational'})
        elif http_method == 'GET' and path == FEEDBACK_PATH:
            response = get_feedback(json.loads(event['body']))
        elif http_method == 'GET' and path == FEEDBACKS_PATH:
            response = get_feedbacks()
        elif http_method == 'POST' and path == FEEDBACK_PATH:
            response = save_feedback(json.loads(event['body']))
        elif http_method == 'DELETE' and path == FEEDBACK_PATH:
            response = delete_feedback(json.loads(event['body']))
        else:
            response = build_response(404, {'message': '404 Not Found'})

    except Exception as e:
        print('Error:', e)
        response = build_response(400, {'message': f'Error processing request: {str(e)}'})

    return response


def get_feedback(body):
    """
    Get feedback by its ID or user.

    Args:
        body (dict): The request body containing the feedback ID or user.

    Returns:
        dict: A response with the feedback data.
    """
    try:
        feedback_id = body.get('feedback_id')
        feedback_user = body.get('username')

        if feedback_id:
            return get_feedback_by_id(feedback_id)
        elif feedback_user:
            return get_feedback_by_user(feedback_user)
        else:
            return build_response(400, {'message': 'Invalid request: Missing feedback_id or username'})
    except ClientError as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error getting feedback: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def get_feedback_by_id(feedback_id):
    """
    Get feedback by its ID.

    Args:
        feedback_id (str): The ID of the feedback to retrieve.

    Returns:
        dict: A response with the feedback data.
    """
    try:
        response = dynamodb_table.get_item(Key={'feedback_id': feedback_id})
        feedback = response.get('Item', {})
        if not feedback:
            return build_response(404, {'message': f'Feedback with id {feedback_id} not found'})
        return build_response(200, feedback)
    except ClientError as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error getting feedback: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def get_feedback_by_user(feedback_user):
    """
    Get feedback by its user.

    Args:
        feedback_user (str): The username to retrieve feedback for.

    Returns:
        dict: A response with the feedback data.
    """
    try:
        response = dynamodb_table.query(
            IndexName='username-index',
            KeyConditionExpression=Key('username').eq(feedback_user)
        )
        feedback = response.get('Items', [])
        if not feedback:
            return build_response(404, {'message': f'No feedback found for user {feedback_user}'})
        return build_response(200, feedback)
    except ClientError as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error getting feedback: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def get_feedbacks():
    """
    Get all feedbacks from the database.

    Returns:
        dict: A response with a list of feedbacks.
    """
    try:
        response = dynamodb_table.scan()
        feedbacks = response.get('Items', [])
        return build_response(200, feedbacks)
    except ClientError as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error getting feedbacks: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def save_feedback(feedback_data):
    """
    Save new feedback to the database.

    Args:
        feedback_data (dict): The feedback data to save.

    Returns:
        dict: A response indicating success or failure.
    """
    try:
        if not feedback_data.get('feedback'):
            return build_response(400, {'message': 'Invalid request: Missing feedback content'})
        if not feedback_data.get('username'):
            return build_response(400, {'message': 'Invalid request: Missing username'})

        feedback_data['feedback_id'] = generate_uuid()
        dynamodb_table.put_item(Item=feedback_data)
        return build_response(200, {'message': 'Feedback added successfully'})
    except ClientError as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error saving feedback: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def delete_feedback(body):
    """
    Delete feedback by its ID.

    Args:
        body (dict): The request body containing the feedback ID.

    Returns:
        dict: A response indicating success or failure.
    """
    try:
        feedback_id = body.get('feedback_id')
        if not feedback_id:
            return build_response(400, {'message': 'Invalid request: Missing feedback_id'})

        response = dynamodb_table.delete_item(
            Key={'feedback_id': feedback_id},
            ConditionExpression='attribute_exists(feedback_id)'
        )
        return build_response(200, {'message': f'Feedback with id {feedback_id} deleted successfully'})
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return build_response(404, {'message': f'Feedback with id {feedback_id} not found'})
        print('Error:', e)
        return build_response(500, {'message': f'Error deleting feedback: {str(e)}'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Unexpected error: {str(e)}'})


def build_response(status_code, body):
    """
    Build an HTTP response.

    Args:
        status_code (int): The HTTP status code.
        body (dict or list): The body of the response to be converted to JSON.

    Returns:
        dict: The HTTP response with the specified status code and body.
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE,PATCH'
        },
        'body': json.dumps(body)
    }


def generate_uuid():
    """
    Generate a UUID.

    Returns:
        str: A string representation of the UUID.
    """
    return str(uuid.uuid1())

