# Dockerfile for the Backend (Hardened Version)

FROM node:20-alpine

WORKDIR /app

# Install system dependencies
# Added 'tesseract-ocr-data- deu' and other languages as examples if needed
RUN apk add --no-cache python3 py3-pip tesseract-ocr tesseract-ocr-data-eng build-base

# Explicitly set the path for Tesseract's data files
ENV TESSDATA_PREFIX=/usr/share/tessdata

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python libraries
COPY scripts/requirements.txt ./scripts/
RUN pip install --no-cache-dir -r scripts/requirements.txt

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

EXPOSE 5001

CMD ["node", "server.js"]