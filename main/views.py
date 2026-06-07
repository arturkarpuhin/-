from django.views.generic import TemplateView


class IndexView(TemplateView):
    template_name = 'main/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Абдыш-Ата — производитель напитков'
        context['content'] = 'Абдыш-Ата — производитель напитков'
        return context


class AboutView(TemplateView):
    template_name = 'main/about.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Абдыш-Ата — О компании'
        context['content'] = 'О компании'
        context['text_on_page'] = (
            'Завод «Абдыш-Ата» основан в 1993 году в Бишкеке. '
            'Мы производим безалкогольные напитки, энергетики, '
            'растительные продукты и слабоалкогольную продукцию '
            'под собственными брендами для рынков Кыргызстана и СНГ.'
        )
        return context


class DeliveryView(TemplateView):
    template_name = 'main/delivery.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Абдыш-Ата — Доставка и оплата'
        context['content'] = 'Доставка и оплата'
        return context


class ContactsView(TemplateView):
    template_name = 'main/contacts.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Абдыш-Ата — Контакты'
        context['content'] = 'Контактная информация'
        return context