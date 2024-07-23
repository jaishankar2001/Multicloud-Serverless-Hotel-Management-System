import os
from google.cloud import language_v2 as language
import json

# Path to Google Cloud credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'Auth.json'

# Constants
POSITIVE_THRESHOLD = 0.24
NEGATIVE_THRESHOLD = -0.24

# Define paths for different operations
STATUS_CHECK_PATH = '/sentiment/status'
ANALYZE_PATH = '/sentiment/analyze'


def lambda_handler(event, context):
    """
    AWS Lambda handler function.

    Parameters:
        event (dict): The event dictionary.
        context (object): The runtime context.

    Returns:
        dict: The response dictionary.
    """
    print('Request event: ', event)

    try:
        http_method = event.get('httpMethod')
        path = event.get('path')

        if http_method == 'GET' and path == STATUS_CHECK_PATH:
            return build_response(200, 'Service is operational')
        elif http_method == 'POST' and path == ANALYZE_PATH:
            text = json.loads(event['body'])['text']
            analyzed_result = analyze_sentiment(text)
            return build_response(200, analyzed_result)
        else:
            return build_response(404, '404 Not Found')
    except Exception as e:
        print('Error:', e)
        return build_response(400, 'Error processing request')


def analyze_sentiment(text_content):
    """
    Analyze the sentiment of the provided text content.

    Parameters:
        text_content (str): The text to analyze.

    Returns:
        dict: A dictionary with sentiment score and magnitude.
    """
    client = language.LanguageServiceClient()
    document = language.Document(content=text_content, type_=language.Document.Type.PLAIN_TEXT)
    sentiment = client.analyze_sentiment(document=document).document_sentiment
    return {
        'score': sentiment.score,
        'magnitude': sentiment.magnitude,
        'polarity': get_polarity(sentiment.score)
    }


def get_polarity(score):
    """
    Determine the polarity of the sentiment score.

    Parameters:
        score (float): The sentiment score.

    Returns:
        str: The polarity of the sentiment score.
    """
    if score > POSITIVE_THRESHOLD:
        return "positive"
    elif score < NEGATIVE_THRESHOLD:
        return "negative"
    else:
        return "neutral"


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
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body)
    }


if __name__ == '__main__':
    # Example text
    text = "This is a test. I am happy."

    event = {
        'httpMethod': 'POST',
        'path': '/analyze',
        'body': json.dumps({'text': text})
    }

    response = lambda_handler(event, None)
    print('Response:', response)
