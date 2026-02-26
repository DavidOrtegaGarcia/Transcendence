#!/bin/sh

#Set secret variables in env
if [ -f /run/secrets/app_key ]; then
    export APP_KEY=$(cat /run/secrets/app_key | tr -d '\n')
fi
if [ -f /run/secrets/reverb_app_secret ]; then
    export REVERB_APP_SECRET=$(cat /run/secrets/reverb_app_secret | tr -d '\n')
fi
if [ -f /run/secrets/db_password ]; then
    export DB_PASSWORD=$(cat /run/secrets/db_password | tr -d '\n')
fi

# Install dependencies
composer install --no-interaction --no-scripts
# Install databases
php artisan migrate --force
#Give permissions 
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

exec "$@"