FROM python:3.11-slim
WORKDIR /Srikanth

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r- requirements.txt

# Copy the rest of the application files
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
