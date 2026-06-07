import re
from django import forms


class CreateOrderForm(forms.Form):

    first_name = forms.CharField()
    last_name = forms.CharField(label='Фамилия')
    phone_number = forms.CharField()
    requires_delivery = forms.ChoiceField(
        choices=[
            ("0", False),
            ("1", True),
            ],
        )
    delivery_address = forms.CharField(required=False)
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