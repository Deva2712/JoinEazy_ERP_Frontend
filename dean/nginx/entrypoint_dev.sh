#!/bin/sh
envsubst '${SERVER_NAME} ${BACKEND_APP_API_URL}' < /etc/nginx/conf.d/default_dev.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"