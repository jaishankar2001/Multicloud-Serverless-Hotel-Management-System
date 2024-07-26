from google.cloud import pubsub_v1
import json

# Initialize Pub/Sub client
publisher = pubsub_v1.PublisherClient()
topic_name = 'projects/dalvacationhome-427921/topics/querypub'  # Replace with your project and topic name

def publish_to_pubsub(request):
    """
    Triggered from a POST request.
    Publishes the request payload to a Pub/Sub topic.
    """
    try:
        # Parse incoming JSON payload
        request_json = request.get_json()
        if not request_json:
            return 'Invalid JSON payload', 400
        
        # Convert payload to JSON string
        message_data = json.dumps(request_json).encode('utf-8')

        # Publish message to Pub/Sub
        future = publisher.publish(topic_name, data=message_data)
        message_id = future.result()

        return f'Message published to Pub/Sub topic with message ID: {message_id}', 200
    except Exception as e:
        return f'Error publishing message: {str(e)}', 500
