FROM python:3.9-slim

RUN apt-get update && apt-get install -y git
COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
WORKDIR /app
COPY . .

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]