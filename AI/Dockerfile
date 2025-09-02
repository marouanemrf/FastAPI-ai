FROM python:3.11-slim

WORKDIR /app

# Install PyTorch dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make sure model folders are copied
COPY gpt_response_model ./gpt_response_model
COPY translation_model ./translation_model
COPY clarification_model ./clarification_model

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
