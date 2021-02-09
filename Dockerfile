FROM ubuntu:16.04

# php / nginx
RUN apt-get update && apt-get install -y \
  curl zip unzip build-essential \
  nodejs npm git nginx \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g n && n 12

WORKDIR /home/mlc-translate-server

COPY . .

CMD ["/bin/bash"]
