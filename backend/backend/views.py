# /backend/backend/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
import os

@api_view(['GET'])
def send_test_data(request):
    return Response({
        "data": "Hello from django backend"
    })
    
TWILIO_ACCOUNT_SID = os.environ['TWILIO_ACCOUNT_SID']
TWILIO_AUTH_TOKEN = os.environ['TWILIO_AUTH_TOKEN']
TWILIO_PHONE_NUMBER = os.environ['TWILIO_PHONE_NUMBER']
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def test_view(request):
    data = {
        'message': 'Hello, this is a test!'
    }
    return JsonResponse(data)

@csrf_exempt
def handle_call(request):
    from_number = request.POST.get('From')
    send_sms(from_number)

    response = VoiceResponse()
    response.say("Thank you for calling. You will receive an SMS shortly.")
    return HttpResponse(str(response), content_type='text/xml')

def send_sms(to_number):
    message = client.messages.create(
        body="Hi there. Click the link to share your location: https://yourserver.com/location",
        from_=TWILIO_PHONE_NUMBER,
        to=to_number
    )
    return message.sid