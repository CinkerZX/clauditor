.PHONY: all

CONFIGPATH = $(shell realpath ${config})

build:
	docker build -t dl4ld/clauditor .

run: build
	docker run -it -v ${CONFIGPATH}:/mnt dl4ld/clauditor /bin/sh

push: build
	docker push dl4ld/clauditor:latest
