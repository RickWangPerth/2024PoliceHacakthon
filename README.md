
*******************************************
Auto SMS 
Open one terminal docker-compose up --build
Open second terminal docker-compose up ngrok
Go to http://localhost:4040/status
Copy an ngrok public URL looks like "https://212f-1-146-184-216.ngrok-free.app"
Go to https://console.twilio.com/: 
  Active numbers->Voice Configuration->A call comes in->
  change the URL to https://212f-1-146-184-216.ngrok-free.app/handle_call/
  change HTTP to HTTP POST
  save configuration
Try to dail the number +16185886026
Press any key to receive an auto message
