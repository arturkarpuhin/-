# Проект: Интернет-магазин "Абдыш-Ата"

## Контекст
Дипломный MVP. Адаптация готового Django-шаблона интернет-магазина мебели
под интернет-магазин завода напитков "Абдыш-Ата" (Бишкек, Кыргызстан).

## Стек (НЕ МЕНЯТЬ)
Python, Django 4.2.7, SQLite, Bootstrap, jQuery + AJAX, session cart.

## Окружение (важно для команд)
ОС: Windows 11, shell: PowerShell (НЕ bash, НЕ cmd).
- Используй PowerShell-нативные команды: `Get-ChildItem`, `Get-Content`,
  `Select-String`, `Select-Object -First N`, `Select-Object -Last N`.
- НЕ используй Unix-утилиты которых нет в Windows: `head`, `tail`, `grep`,
  `wc`, `awk`, `sed`.
- Для поиска по содержимому файлов: `Select-String -Path '**/*.html' -Pattern '...'`
  или встроенный grep-инструмент.

## Локализация
- Регион: Кыргызстан
- Валюта: "сом" (после числа с пробелом, например "1500 сом")
- Телефон: +996 XXX XXX XXX (regex ^\+996\d{9}$)
- Язык интерфейса: русский

## ЗАПРЕТЫ (СТРОГО)
- Папка `carts/` — ТОЛЬКО ЧТЕНИЕ. Никаких правок ни в моделях, ни в views,
  ни в JS/AJAX корзины.
- Папка `users/` — не трогать без явного разрешения в промнте.
- НЕ запускать без подтверждения: `makemigrations`, `migrate`, `runserver`,
  `pip install`, `loaddata`, `collectstatic`.
- НЕ ставить новые пакеты, НЕ менять `requirements.txt`.
- НЕ удалять данные/фикстуры без подтверждения.

## ЗАПРЕТ НА ПЕРЕИМЕНОВАНИЕ (ломает корзину)
Поля модели Product: `name`, `price`, `discount`, `quantity`, метод `sell_price()`.

JS-классы и ID:
`.add-to-cart`, `.remove-from-cart`, `.decrement`, `.increment`, `.number`,
`#goods-in-cart-count`, `#cart-items-container`, `#modalButton`,
`#exampleModal`, `#jq-notification`, `#deliveryAddressField`,
`#create_order_form`, `#id_phone_number`, `#phone_number_error`.

URL-namespace: `cart:cart_add`, `cart:cart_change`, `cart:cart_remove`,
`orders:create_order`.

data-атрибуты: `data-product-id`, `data-cart-id`, `data-cart-change-url`.

## Workflow с пользователем
- Промнты приходят разбитые на ШАГИ или ГРУППЫ.
- После каждого ШАГА — СТОП, дождаться от пользователя слова "далее".
- В конце ГРУППЫ — список всех изменённых файлов.
- Перед опасным шагом (JS корзины, миграции, удаление данных) — отдельный
  git-чекпоинт. Коммитит пользователь сам в отдельном PowerShell.
- На опасных шагах — режим "manually approve edits".

## Архитектурные решения (уже сделано, не пересматривать)
- Модель Product расширена полями: `container`, `volume`, `is_alcoholic`,
  плюс FK на `Categories`. От поля `type_of_beer` отказались — заменили
  системой из 6 категорий через FK.
- Поиск переписан на `Q(name__icontains=...) | Q(description__icontains=...)`
  потому что `django.contrib.postgres.search` несовместим с SQLite.
- Категорий 7: 6 основных (pk 1-6) + системная "Все напитки" (pk=7, slug="all").
  Slug "all" жёстко прописан в `goods/views.py:24` — НЕ менять.
- Товаров в фикстурах: 24 шт (9 алкогольных + 15 безалкогольных).
- Картинки товаров: одна заглушка-плейсхолдер для fallback
  (`deps/images/Not found image.png`).
- Форма заказа: имя + фамилия + телефон + адрес + способ доставки (radio) +
  способ оплаты (radio: "Картой при получении" / "Наличными курьеру").
- НИКАКИХ онлайн-платежей (Stripe/PayPal/Kaspi и т.п.).
- `LoginRequiredMixin` на оформлении заказа: гость может класть в корзину,
  но для checkout нужен логин.
- В админке: `list_editable = ["status", "is_paid"]` в `orders/admin.py` —
  ключевая фишка для защиты диплома.

## Текущий статус
Этап 1 (бэкенд) — закрыт, Группы 1-5 выполнены.
Сейчас: багфикс перед Этапом 2 (редизайн фронта по мокапам).
