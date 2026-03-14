FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (e.g. for lxml used by newspaper3k)
RUN apt-get update && apt-get install -y \
    build-essential \
    libxml2-dev \
    libxslt-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python requirements
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download NLTK data required by newspaper3k to reduce start time
RUN python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('punkt_tab', quiet=True)"

COPY . .

# Uvicorn looks for PORT via main.py script
ENV PORT=8000
EXPOSE $PORT

# Start application
CMD ["python", "main.py"]
