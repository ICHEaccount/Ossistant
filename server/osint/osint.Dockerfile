FROM python:3.8-slim

RUN apt-get update && apt-get install -y git
COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
WORKDIR /app

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]