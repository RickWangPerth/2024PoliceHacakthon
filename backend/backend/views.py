# /backend/backend/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
import os
import json

def convert_data_to_string(data):
    return '**'.join([f"{key}##{value}" for key, value in data.items()])

@csrf_exempt
def send_to_chatroom(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("data type is ", type(data))
        print(data)
        data['message'] = convert_data_to_string(data['message'])
        print(data)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'chat',
            {
                'type': 'chat_message',
                'message': json.dumps(data),
            }
        )
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
    
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
        body="Hi there. Click the link to share your location: https://www.cloudwa.com.au/emergency",
        from_=TWILIO_PHONE_NUMBER,
        to=to_number
    )
    return message.sid

@csrf_exempt
def location_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        heading = data.get('heading')
        total_time = data.get('totalTime')
        speed = data.get('speed')
        total_distance = data.get('totalDistance')
        tag = data.get('tag')
        sender = data.get('sender')
        altitude = data.get('altitude') 

        message_data = {
            'username': 'SYSTEM',
            'message': {
                'Latitude': latitude,
                'Longitude': longitude,
                'Heading': heading,
                'Total Time': total_time,
                'Speed': speed,
                'Total Distance': total_distance,
                'Tag': tag,
                'Sender': sender,
                'Altitude': altitude,
            },
            'timestamp': datetime.now().strftime('%d/%m/%Y, %H:%M:%S'),
            'type': 'location'
        }
        
        data['message'] = convert_data_to_string(data['message'])

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            'chat',
            {
                'type': 'chat_message',
                'message': json.dumps(message_data),
            }
        )
        

        print(f"Received location data:")
        print(f"Latitude: {latitude}")
        print(f"Longitude: {longitude}")
        print(f"Heading: {heading}")
        print(f"Total Time: {total_time}")
        print(f"Speed: {speed}")
        print(f"Total Distance: {total_distance}")
        print(f"Tag: {tag}")
        print(f"Sender: {sender}")
        print(f"Altitude: {altitude}")  

        return JsonResponse({
            'status': 'success',
            'latitude': latitude,
            'longitude': longitude,
            'heading': heading,
            'totalTime': total_time,
            'speed': speed,
            'totalDistance': total_distance,
            'tag': tag,
            'sender': sender,
            'altitude': altitude  # 返回海拔高度数据
        })
    return JsonResponse({'error': 'Invalid request method'}, status=400)
# @csrf_exempt
# def location_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         latitude = data.get('latitude')
#         longitude = data.get('longitude')
#         # 处理接收到的位置信息
#         print(f"Received location: Latitude = {latitude}, Longitude = {longitude}")
#         return JsonResponse({'status': 'success', 'latitude': latitude, 'longitude': longitude})
#     return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def incident_output_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        summarydata = data.get('data')
        # 处理接收到的位置信息
        print(f"Received incident_output_view: data = {data}")
        
        return JsonResponse({'status': 'success', 'data': data})
    return JsonResponse({'error': 'Invalid request method'}, status=400)



import asyncio
import websockets
import os

async def command_receiver():
    host = os.getenv('WEBSOCKET_HOST', 'localhost')
    port = os.getenv('WEBSOCKET_PORT', '8000')
    ws_url = f"wss://{host}:{port}/ws/"
    async with websockets.connect(ws_url) as websocket:
        
        while True:
            message = await websocket.recv()
            await websocket.send("Received the command '{message}'")
            if message == "start":
                # run the start command
                ...
            elif message == "stop":
                # run the stop command
                ...
            else:
                await websocket.send("Unknown command")     
