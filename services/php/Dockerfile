FROM php:8.4-fpm

# BUILD TIME
# Install utils and dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    libfcgi-bin \
    zip unzip curl \
    mariadb-client

# Config GD extension, to use JPEG, before installing it
RUN docker-php-ext-configure gd --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    sockets \
    gd xml dom

# Install redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install composer from composer official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY ./www/composer.json .
COPY ./www/composer.lock .

# To install needed libraries in /www/vendor based on package.json
RUN composer install --no-scripts --no-interaction --no-autoloader

COPY www .

# To create composer static class map, used to detect classes or libraries without #include
RUN composer dump-autoload --optimize

RUN mkdir -p /var/www/storage /var/www/bootstrap/cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY ./conf/php.ini /usr/local/etc/php/conf.d/custom.ini
RUN chmod 644 /usr/local/etc/php/conf.d/custom.ini

# Script to install new dependencies and setup new databases if needed
COPY ./tools/setup.sh /usr/local/bin/setup.sh
RUN chmod +x /usr/local/bin/setup.sh

# Laravel port
EXPOSE 9000 
# Reverb port
EXPOSE 6001

# RUN TIME
ENTRYPOINT [ "/usr/local/bin/setup.sh" ]
CMD ["php-fpm"]
