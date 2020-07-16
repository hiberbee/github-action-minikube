FROM alpine:3.12
ARG version=1.12.0
ADD https://storage.googleapis.com/minikube/releases/v${version}/minikube-linux-amd64 /usr/local/bin/minikube
RUN chmod +x /usr/local/bin/minikube
ENTRYPOINT ["minikube"]
CMD ["start"]
