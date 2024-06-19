
*******************************************<br>
Auto SMS <br>
Open one terminal docker-compose up --build<br>
Open second terminal docker-compose up ngrok<br>
Go to http://localhost:4040/status<br>
Copy an ngrok public URL looks like "https://212f-1-146-184-216.ngrok-free.app"<br>
Go to https://console.twilio.com/: <br>
  Active numbers->Voice Configuration->A call comes in-><br>
  change the URL to https://212f-1-146-184-216.ngrok-free.app/handle_call/<br>
  change HTTP to HTTP POST<br>
  save configuration<br>
Try to dail the number +16185886026<br>
Press any key to receive an auto message<br>
