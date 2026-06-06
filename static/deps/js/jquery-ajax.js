// Когда html документ готов (прорисован)
$(document).ready(function () {
    // берем в переменную элемент разметки с id jq-notification для оповещений от ajax
    var successMessage = $("#jq-notification");

    // Ловим собыитие клика по кнопке добавить в корзину
    $(document).on("click", ".add-to-cart", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInCartCount = $(".cart-count");
        var cartCount = parseInt(goodsInCartCount.first().text() || 0);

        // Получаем id товара из атрибута data-product-id
        var product_id = $(this).data("product-id");

        // Из атрибута href берем ссылку на контроллер django
        var add_to_cart_url = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: add_to_cart_url,
            data: {
                product_id: product_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                cartCount++;
                goodsInCartCount.text(cartCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });




    // Ловим собыитие клика по кнопке удалить товар из корзины
    $(document).on("click", ".remove-from-cart", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInCartCount = $(".cart-count");
        var cartCount = parseInt(goodsInCartCount.first().text() || 0);

        // Получаем id корзины из атрибута data-cart-id
        var cart_id = $(this).data("cart-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_cart = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_cart,
            data: {
                cart_id: cart_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                cartCount -= data.quantity_deleted;
                goodsInCartCount.text(cartCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });




    // Теперь + - количества товара 
    // Обработчик события для уменьшения значения
    $(document).on("click", ".decrement", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("cart-change-url");
        // Берем id корзины из атрибута data-cart-id
        var cartID = $(this).data("cart-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());
        // Если количества больше одного, то только тогда делаем -1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Запускаем функцию определенную ниже
            // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
            updateCart(cartID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения значения
    $(document).on("click", ".increment", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("cart-change-url");
        // Берем id корзины из атрибута data-cart-id
        var cartID = $(this).data("cart-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Запускаем функцию определенную ниже
        // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
        updateCart(cartID, currentValue + 1, 1, url);
    });

    function updateCart(cartID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                cart_id: cartID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },

            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Изменяем количество товаров в корзине
                var goodsInCartCount = $(".cart-count");
                var cartCount = parseInt(goodsInCartCount.first().text() || 0);
                cartCount += change;
                goodsInCartCount.text(cartCount);

                // Меняем содержимое корзины
                var cartItemsContainer = $("#cart-items-container");
                cartItemsContainer.html(data.cart_items_html);

            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    }

    // Берем из разметки элемент по id - оповещения от django
    var notification = $('#notification');
    // И через 7 сек. убираем
    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');
        }, 7000);
    }

    // При клике по значку корзины открываем всплывающее(модальное) окно
    $('#modalButton').click(function () {
        $('#exampleModal').appendTo('body');

        $('#exampleModal').modal('show');
    });

    // Собыите клик по кнопке закрыть окна корзины
    $('#exampleModal .btn-close').click(function () {
        $('#exampleModal').modal('hide');
    });

    // Обработчик события радиокнопки выбора способа доставки
    $("input[name='requires_delivery']").change(function () {
        var selectedValue = $(this).val();
        // Скрываем или отображаем input ввода адреса доставки
        if (selectedValue === "1") {
            $("#deliveryAddressField").show();
        } else {
            $("#deliveryAddressField").hide();
        }
    });

    // Маска ввода телефона: +996 XXX XXX XXX
    var phoneInput = document.getElementById('id_phone_number');
    if (phoneInput) {
        var PHONE_PREFIX = '+996 ';

        // Форматирование цифр локальной части (до 9 цифр) → "XXX XXX XXX"
        function formatLocalDigits(digits) {
            var d = digits.slice(0, 9);
            var out = d.slice(0, 3);
            if (d.length > 3) out += ' ' + d.slice(3, 6);
            if (d.length > 6) out += ' ' + d.slice(6, 9);
            return out;
        }

        // focus: подставить PREFIX в пустое поле
        phoneInput.addEventListener('focus', function () {
            if (this.value.trim() === '' || this.value === '+996') {
                this.value = PHONE_PREFIX;
            }
            var len = this.value.length;
            this.setSelectionRange(len, len);
        });

        // keydown: блокировать нецифры и переполнение
        phoneInput.addEventListener('keydown', function (e) {
            // Backspace: не удалять дальше PREFIX
            if (e.keyCode === 8) {
                if (this.value.length <= PHONE_PREFIX.length) {
                    e.preventDefault();
                }
                return;
            }
            // Разрешить Ctrl/Cmd-комбинации (Ctrl+V, Ctrl+A, Ctrl+C, Ctrl+Z и т.п.)
            if (e.ctrlKey || e.metaKey) return;
            // Спец-клавиши: delete, tab, стрелки, home, end — пропускаем
            if ([46, 9, 37, 38, 39, 40, 35, 36].indexOf(e.keyCode) !== -1) return;
            // Только цифры (основная клавиатура и numpad, без shift)
            var isDigit = (e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) ||
                          (e.keyCode >= 96 && e.keyCode <= 105);
            if (!isDigit) {
                e.preventDefault();
                return;
            }
            // Не больше 9 цифр в локальной части
            var localDigits = this.value.slice(PHONE_PREFIX.length).replace(/\D/g, '');
            if (localDigits.length >= 9) {
                e.preventDefault();
            }
        });

        // input: переформатировать (страховка — работает и с автозаполнением)
        phoneInput.addEventListener('input', function () {
            var val = this.value;
            // Восстановить PREFIX если он повреждён (автозаполнение, вставка)
            if (!val.startsWith(PHONE_PREFIX)) {
                var rawDigits = val.replace(/\D/g, '');
                if (rawDigits.startsWith('996')) rawDigits = rawDigits.slice(3);
                val = PHONE_PREFIX + rawDigits;
            }
            var localDigits = val.slice(PHONE_PREFIX.length).replace(/\D/g, '').slice(0, 9);
            this.value = PHONE_PREFIX + formatLocalDigits(localDigits);
            // Курсор в конец
            var len = this.value.length;
            this.setSelectionRange(len, len);
        });

        // paste: нормализовать вставленный текст
        phoneInput.addEventListener('paste', function (e) {
            e.preventDefault();
            var pasted = (e.clipboardData || window.clipboardData).getData('text');
            var digits = pasted.replace(/\D/g, '');
            var local = '';
            if (digits.startsWith('996')) {
                local = digits.slice(3, 12);          // +996XXXXXXXXX или 996XXXXXXXXX
            } else if (digits.startsWith('0') && digits.length > 1) {
                local = digits.slice(1, 10);           // 0XXXXXXXXX (старый формат)
            } else {
                local = digits.slice(0, 9);            // уже локальная часть
            }
            if (local === '' || local.length > 9) {
                this.value = PHONE_PREFIX;
            } else {
                this.value = PHONE_PREFIX + formatLocalDigits(local);
            }
        });
    }

    // Валидация и очистка телефона перед отправкой: +996XXXXXXXXX (без пробелов)
    $('#create_order_form').on('submit', function (event) {
        var phoneNumber = $('#id_phone_number').val();
        var cleanedPhone = phoneNumber.replace(/\s/g, '');
        var regex = /^\+996\d{9}$/;

        if (!regex.test(cleanedPhone)) {
            $('#phone_number_error').show();
            event.preventDefault();
        } else {
            $('#phone_number_error').hide();
            $('#id_phone_number').val(cleanedPhone);
        }
    });
});