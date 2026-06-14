#!/usr/bin/env bash
# deploy.sh — автоматический деплой Абдыш-Ата на Ubuntu 24.04 (root)
set -euo pipefail

# ── 1. Gunicorn systemd service ───────────────────────────────────────────────
echo "[1/4] Создаём /etc/systemd/system/gunicorn.service ..."

cat > /etc/systemd/system/gunicorn.service << 'EOF'
[Unit]
Description=gunicorn daemon for Abdysh-Aata Project
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/abdysh-ata
ExecStart=/var/www/abdysh-ata/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/var/www/abdysh-ata/app.sock app.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# ── 2. Запуск Gunicorn ────────────────────────────────────────────────────────
echo "[2/4] Перезапускаем systemd, стартуем и включаем gunicorn ..."

systemctl daemon-reload
systemctl start gunicorn
systemctl enable gunicorn

echo "      Статус gunicorn:"
systemctl is-active gunicorn

# ── 3. Nginx config ───────────────────────────────────────────────────────────
echo "[3/4] Создаём /etc/nginx/sites-available/abdysh-ata ..."

cat > /etc/nginx/sites-available/abdysh-ata << 'EOF'
server {
    listen 80;
    server_name 159.194.206.184;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        root /var/www/abdysh-ata;
    }

    location /media/ {
        root /var/www/abdysh-ata;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/abdysh-ata/app.sock;
    }
}
EOF

# ── 4. Симлинк, проверка синтаксиса, перезапуск Nginx ────────────────────────
echo "[4/4] Активируем конфиг Nginx ..."

ln -sf /etc/nginx/sites-available/abdysh-ata /etc/nginx/sites-enabled/abdysh-ata

nginx -t
systemctl restart nginx

echo ""
echo "======================================================"
echo " Деплой завершён успешно!"
echo " Gunicorn : $(systemctl is-active gunicorn)"
echo " Nginx    : $(systemctl is-active nginx)"
echo " Сайт     : http://159.194.206.184"
echo "======================================================"
