#!/bin/sh

# Install dependencies
composer install --no-interaction --no-scripts
# Install databases
php artisan migrate --force
#Give permissions 
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

exec "$@"