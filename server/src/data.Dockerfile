FROM python:3.10-slim

RUN apt-get update 

COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
WORKDIR /app

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]