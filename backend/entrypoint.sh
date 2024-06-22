#!/bin/sh
# Wait for Postgres to be ready
/wait-for-postgres.sh postgresdb

# Perform database migration
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start Django application with Uvicorn
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000
