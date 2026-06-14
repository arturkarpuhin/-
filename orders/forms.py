import re
from django import forms


class CreateOrderForm(forms.Form):

    CITY_CHOICES = [
        ('Кант', 'Кант'),
        ('Бишкек', 'Бишкек'),
    ]

    STREET_CHOICES = [
        ('', '— выберите улицу —'),
        ('Ленина', 'Ленина'),
        ('Гагарина', 'Гагарина'),
        ('Токтогула', 'Токтогула'),
        ('Фрунзе', 'Фрунзе'),
        ('Логвиненко', 'Логвиненко'),
        ('Центральная', 'Центральная'),
        ('Зубкова', 'Зубкова'),
        ('Панфилова', 'Панфилова'),
    ]

    first_name = forms.CharField()
    last_name = forms.CharField(label='Фамилия')
    phone_number = forms.CharField()
    requires_delivery = forms.ChoiceField(
        choices=[
            ("0", False),
            ("1", True),
            ],
        )
    city = forms.ChoiceField(choices=CITY_CHOICES, required=False, label='Город')
    street = forms.ChoiceField(choices=STREET_CHOICES, required=False, label='Улица')
    house_number = forms.CharField(required=False, label='Номер дома/квартиры')
    delivery_address = forms.CharField(required=False, label='Ориентиры / Доп. информация')
    payment_on_get = forms.ChoiceField(
        choices=[
            ("0", 'False'),
            ("1", 'True'),
            ],
        )

    def clean_phone_number(self):
        # Валидация телефонного номера в формате Кыргызстана (+996XXXXXXXXX)
        data = self.cleaned_data['phone_number']

        pattern = re.compile(r'^\+996\d{9}$')
        if not pattern.match(data):
            raise forms.ValidationError("Неверный формат номера. Пример: +996700123456")

        return data