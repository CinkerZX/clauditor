# Auditor

## Quick start
copy template_config.json to config.json and fill the rabbitmq url, user and pass. 
If keys are not provided a new pair is generated everytime the auditor runs.
Put config file and plan file in a seperate directory.

build docker image

```
make build
```

run auditor
```
make run config=CONFIG_FOLDER
node auditor.js -c /mnt/config.auditorA.json 
```


