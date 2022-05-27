FROM debian:buster

RUN apt-get update && apt-get install -yq nginx

RUN apt-get clean && rm -rf /var/lib/apt/lists/

RUN mkdir /var/www/transcendence && \
chown -R www-data /var/www/* && \
chmod -R 755 /var/www/*

COPY nginx.conf /etc/nginx/sites-available/transcendence
RUN ln -s /etc/nginx/sites-available/transcendence /etc/nginx/sites-enabled && \
rm /etc/nginx/sites-enabled/default

RUN echo "\ndaemon off;" >> /etc/nginx/nginx.conf

EXPOSE 1024
CMD ["/usr/sbin/nginx"]