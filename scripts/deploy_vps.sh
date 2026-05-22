#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/askharekrishna-platform/frontend"
BRANCH="master"
SERVICE_NAME="askharekrishna-frontend.service"

cd "$APP_DIR"

echo "[deploy] Fetching latest code"
git pull --ff-only origin "$BRANCH"

echo "[deploy] Installing dependencies"
npm ci

echo "[deploy] Building Next.js app"
npm run build

echo "[deploy] Restarting frontend service"
sudo -n systemctl restart "$SERVICE_NAME"

echo "[deploy] Checking service status"
sudo -n systemctl --no-pager --full status "$SERVICE_NAME" | head -n 20

echo "[deploy] Verifying local app health"
HEALTH_URL="http://127.0.0.1:3002/"
MAX_RETRIES=30
SLEEP_SECONDS=2

for attempt in $(seq 1 "$MAX_RETRIES"); do
	if curl -fsS --max-time 2 "$HEALTH_URL" >/dev/null; then
		echo "[deploy] Health check passed on attempt $attempt"
		echo "[deploy] Completed successfully"
		exit 0
	fi

	echo "[deploy] Waiting for app startup... attempt $attempt/$MAX_RETRIES"
	sleep "$SLEEP_SECONDS"
done

echo "[deploy] Health check failed after $((MAX_RETRIES * SLEEP_SECONDS)) seconds"
echo "[deploy] Recent service logs:"
sudo -n journalctl -u "$SERVICE_NAME" -n 80 --no-pager || true
exit 1
