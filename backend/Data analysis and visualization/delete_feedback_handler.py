import json
import requests

# Define the URLs of the DELETE APIs
DELETE_API_URLS = ["https://2levm8ra85.execute-api.us-east-1.amazonaws.com/v1/feedback",
                   "https://mx9uotjgz8.execute-api.us-east-1.amazonaws.com/v2/feedback"]

# Define paths for different operations
DELETE_FEEDBACK_PATH = '/delete_feedbacks'


def lambda_handler(event, context):
    """
    AWS Lambda handler function to delete feedback from two different APIs.

    Parameters:
        event (dict): The event data containing the POST request with feedback_id.
        context (object): The runtime context.

    Returns:
        dict: The response dictionary.
    """
    try:
        http_method = event.get('httpMethod')
        path = event.get('path')

        if http_method == 'POST' and path == DELETE_FEEDBACK_PATH:
            feedback_id = json.loads(event.get('body', '{}')).get('feedback_id')

            # Validate feedback_id
            if not feedback_id:
                return build_response(400, {'message': 'Invalid request: Missing feedback_id'})

            # Call the DELETE APIs
            responses = []
            for api_url in DELETE_API_URLS:
                response = call_delete_api(api_url, feedback_id)
                responses.append(response)

            # Construct the consolidated response
            result = {
                "status": "success",
                "responses": responses
            }

            return build_response(200, result)
        else:
            return build_response(404, {'message': '404 Not Found'})
    except Exception as e:
        print('Error:', e)
        return build_response(500, {'message': f'Error processing request: {str(e)}'})


def call_delete_api(api_url, feedback_id):
    """
    Call the DELETE API with the given feedback_id.

    Parameters:
        api_url (str): The URL of the DELETE API.
        feedback_id (str): The ID of the feedback to delete.

    Returns:
        dict: The response from the DELETE API.
    """
    payload = json.dumps({"feedback_id": feedback_id})
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.delete(api_url, headers=headers, data=payload)
        response.raise_for_status()
        return {"status": "success", "response": response.json()}
    except requests.exceptions.RequestException as e:
        print(f'Error calling API {api_url}:', e)
        return {"status": "error", "message": str(e)}


def build_response(status_code, body):
    """
    Build an HTTP response.

    Parameters:
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
