import json
import requests


def lambda_handler(event, context):
    """
    AWS Lambda handler function triggered by DynamoDB stream.

    Parameters:
        event (dict): The event dictionary containing DynamoDB stream records.
        context (object): The runtime context.

    Returns:
        None
    """
    print('Request event: ', event)

    # Check if the event is an INSERT (new item added)
    if event['Records'][0]['eventName'] == 'INSERT':
        # Extract the new image (new item data)
        new_image = event['Records'][0]['dynamodb']['NewImage']
        print(">>> ### <<< ", new_image)

        # Extract individual attributes from the new image
        feedback = new_image['feedback']['S']
        feedback_id = new_image['feedback_id']['S']
        username = new_image['username']['S']
        date_time = new_image['date_time']['S']

        # Analyze sentiment of the feedback
        sentiment_data = get_feedback_sentiment(feedback)
        if sentiment_data:
            polarity = sentiment_data['polarity']
            score = sentiment_data['score']

            # Prepare feedback data with sentiment analysis results
            feedback_data = {
                "date_time": date_time,
                "username": username,
                "feedback": feedback,
                "feedback_id": feedback_id,
                "polarity": polarity,
                "score": str(score)
            }

            # Post feedback data with sentiment analysis results
            response = post_feedback_sentiment(feedback_data)
            print(response)


def get_feedback_sentiment(feedback_text):
    """
    Analyze the sentiment of the provided feedback text.

    Parameters:
        feedback_text (str): The text to analyze.

    Returns:
        dict: A dictionary with sentiment polarity and score.
    """
    url = "https://mx9uotjgz8.execute-api.us-east-1.amazonaws.com/v2/sentiment/analyze"
    payload = json.dumps({"text": feedback_text})
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("Error analyzing sentiment:", e)
        return None

    return response.json()


def post_feedback_sentiment(feedback_data):
    """
    Post feedback data with sentiment analysis results.

    Parameters:
        feedback_data (dict): The feedback data including sentiment results.

    Returns:
        dict: The response from the API.
    """
    url = "https://2levm8ra85.execute-api.us-east-1.amazonaws.com/v1/feedback"
    payload = json.dumps(feedback_data)
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("Error posting feedback:", e)
        return None

    return response.json()
