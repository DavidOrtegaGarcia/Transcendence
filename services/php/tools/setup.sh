#!/bin/sh

# Install dependencies
composer install --no-interaction --no-scripts
# Install databases
php artisan migrate --force
exec "$@"