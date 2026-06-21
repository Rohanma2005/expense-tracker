# Use python:3.11-slim as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application files
COPY . .

# Expose backend port
EXPOSE 5000

ENV FLASK_APP=app.py

# Start Gunicorn server after waiting for database and running migrations
CMD ["sh", "-c", "python wait_for_db.py && flask db upgrade && gunicorn -w 4 -b 0.0.0.0:5000 'app:create_app()'"]
