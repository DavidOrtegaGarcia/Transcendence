#!/bin/sh

# Install dependencies
composer install --no-interaction --no-scripts
# Install databases
php artisan migrate --force
#Give permissions 
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

#Set secret variables in env
export APP_KEY=$(cat /run/secrets/app_key)
export REVERB_APP_SECRET=$(cat /run/secrets/reverb_app_secret)
export DB_PASSWORD=$(cat /run/secrets/db_password)

exec "$@"