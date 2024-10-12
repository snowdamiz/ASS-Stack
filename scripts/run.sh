#!/bin/bash
set -e

# Set the directory of the database in a variable
DB_PATH=/data/db.sqlite3
DB_DIR=$(dirname "$DB_PATH")

# Ensure the directory exists
if [ ! -d "$DB_DIR" ]; then
    echo "Database directory does not exist. Creating $DB_DIR"
    mkdir -p "$DB_DIR"
fi

# Restore the database if it does not already exist.
if [ -f "$DB_PATH" ]; then
    echo "Database already exists, skipping restore"
else
    echo "No database found, restoring from replica if exists"
    litestream restore -if-replica-exists "$DB_PATH"
fi

# Run litestream with your app as the subprocess.
exec litestream replicate -exec "node ./dist/server/entry.mjs"
