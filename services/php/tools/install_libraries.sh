#!/bin/sh

composer install --no-interaction --no-scripts
exec "$@"