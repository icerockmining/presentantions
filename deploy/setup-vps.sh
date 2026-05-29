#!/usr/bin/env bash
# Bootstrap script for clean Ubuntu 22.04/24.04 VPS
# Run as root: bash setup-vps.sh
set -euo pipefail

DOMAIN="cashesgreen.ru"
APP_DIR="/srv/cgr-shop"
APP_USER="cgr"

echo "=== [1/6] System packages ==="
apt-get update -q
apt-get install -y curl git nginx certbot python3-certbot-nginx

echo "=== [2/6] Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "=== [3/6] PostgreSQL 16 ==="
apt-get install -y postgresql-16

echo "=== [4/6] App user + directory ==="
id -u "$APP_USER" &>/dev/null || useradd --system --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_DIR"
chown "$APP_USER":"$APP_USER" "$APP_DIR"

echo "=== [5/6] Nginx site ==="
cp "$(dirname "$0")/../nginx/cgr.conf" /etc/nginx/sites-available/"$DOMAIN"
ln -sf /etc/nginx/sites-available/"$DOMAIN" /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "=== [6/6] SSL (Let's Encrypt) ==="
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@"$DOMAIN" || true

echo ""
echo "Done. Next steps:"
echo "  1. Clone repo to $APP_DIR and run: npm ci && npm run build"
echo "  2. Create /etc/cgr-shop/.env from .env.example"
echo "  3. Create DB: su postgres -c \"createuser -P cgr && createdb -O cgr cgr_shop\""
echo "  4. Run migrations: DATABASE_URL=... npx prisma migrate deploy && npm run seed"
echo "  5. Copy deploy/cgr-shop.service → /etc/systemd/system/ and: systemctl enable --now cgr-shop"
