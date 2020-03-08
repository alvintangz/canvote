FROM redis

# Just sets a password to this redis instance via the REDIS_PASSWORD environment variable
CMD ["sh", "-c", "exec redis-server --requirepass \"$REDIS_PASSWORD\""]