FROM php:8.4-fpm

# Install utils and php libraries
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libonig-dev \
    libxml2-dev \
    zip unzip curl \
    mariadb-client

# Compile and enable PHP extensions
RUN docker-php-ext-install pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd xml dom

# Install redis
RUN pecl install redis && docker-php-ext-enable redis

# Get composer from composer official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY ./www/composer.json .
COPY ./www/composer.lock .

# To install needed libraries in /www/vendor based on package.json
RUN composer install --no-scripts --no-interaction --no-autoloader

COPY www .

# To create composer static class map, used to detect classes or libraries without #include
RUN composer dump-autoload --optimize

EXPOSE 9000

CMD ["php-fpm"]
