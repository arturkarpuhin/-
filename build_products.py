# -*- coding: utf-8 -*-
"""Генератор фикстуры товаров Абдыш-Ата. Пишет fixtures/goods/products.json.
Не обращается к базе данных — только создаёт текстовый файл и проверяет его."""
import json, os
from collections import Counter

CAT = {"alko":1, "bezalko":2, "pivo":3, "razliv":4, "rast":5, "energ":6}

# (name, slug, desc, price, discount, qty, cat, container, volume, is_alco)
rows = [
    ("Наше Пиво Шахтёрское Светлое 1л","nashe-pivo-shahterskoe-svetloe-1l","Светлое фильтрованное пиво «Наше» из артезианской воды. Классический солодовый вкус.","90.00","0.00",150,"pivo","pet","1.0",True),
    ("Наше Пиво Шахтёрское Светлое 1.5л","nashe-pivo-shahterskoe-svetloe-1-5l","Светлое пиво «Наше» в семейном формате 1.5 л.","120.00","10.00",120,"pivo","pet","1.5",True),
    ("Наше Пиво Московское 0.5л","nashe-pivo-moskovskoe-0-5l","Светлое пиво «Московское» с мягкой хмелевой горчинкой.","75.00","0.00",140,"pivo","glass","0.5",True),
    ("Наше Пиво Жигулёвское 0.5л","nashe-pivo-zhigulevskoe-0-5l","Классическое «Жигулёвское» по традиционному рецепту.","70.00","0.00",140,"pivo","glass","0.5",True),
    ("Живое Светлое нефильтрованное 0.5л","zhivoe-svetloe-nefiltrovannoe-0-5l","Непастеризованное светлое пиво «Живое» — натуральный вкус без осветления.","95.00","0.00",100,"pivo","glass","0.5",True),
    ("Живое Тёмное нефильтрованное 0.5л","zhivoe-temnoe-nefiltrovannoe-0-5l","Тёмное «Живое» с карамельно-солодовым ароматом.","100.00","0.00",90,"pivo","glass","0.5",True),
    ("Urban 312 Пшеничное нефильтрованное 0.5л","urban-312-pshenichnoe-0-5l","Премиальное пшеничное нефильтрованное пиво Urban 312 «в ритме города».","110.00","0.00",110,"pivo","can","0.5",True),
    ("Kuznec Black Pilsner 0.5л","kuznec-black-pilsner-0-5l","Тёмный пилснер Kuznec с насыщенным вкусом и плотной пеной.","130.00","0.00",80,"pivo","can","0.5",True),
    ("Kuznec Belgian Blond Ale 0.5л","kuznec-belgian-blond-ale-0-5l","Бельгийский светлый эль Kuznec с фруктовыми нотами.","135.00","0.00",80,"pivo","can","0.5",True),
    ("Buff Крепкое 0.5л","buff-krepkoe-0-5l","Крепкое светлое пиво Buff для любителей насыщенного вкуса.","95.00","0.00",100,"pivo","can","0.5",True),
    ("LEMO Персик-Личи 0.5л","lemo-persik-lichi-0-5l","Газированный напиток LEMO с натуральным соком, вкус персика и личи.","60.00","15.00",200,"bezalko","pet","0.5",False),
    ("LEMO Арбуз-Клубника 0.5л","lemo-arbuz-klubnika-0-5l","Газированный напиток LEMO с натуральным соком, вкус арбуза и клубники.","60.00","0.00",200,"bezalko","pet","0.5",False),
    ("RETRO Cola 0.5л","retro-cola-0-5l","Классическая кола RETRO COLA — бодрящий вкус по проверенному рецепту.","55.00","0.00",220,"bezalko","pet","0.5",False),
    ("RETRO Twist 0.5л","retro-twist-0-5l","Газированный напиток RETRO TWIST с цитрусовым вкусом.","55.00","0.00",180,"bezalko","pet","0.5",False),
    ("RETRO Tango 0.5л","retro-tango-0-5l","Газированный напиток RETRO TANGO с фруктовым вкусом.","55.00","0.00",180,"bezalko","pet","0.5",False),
    ("NITRO FRESH Мохито 0.5л","nitro-fresh-mohito-0-5l","Газированный напиток NITRO FRESH со вкусом мохито.","65.00","0.00",160,"bezalko","pet","0.5",False),
    ("NITRO FRESH Манго-Клубника 0.5л","nitro-fresh-mango-klubnika-0-5l","Газированный напиток NITRO FRESH со вкусом манго и клубники.","65.00","0.00",160,"bezalko","pet","0.5",False),
    ("Salam Ice Tea Зелёный 0.5л","salam-ice-tea-zelenyj-0-5l","Холодный зелёный чай Salam Ice Tea — освежает в жару.","60.00","0.00",150,"bezalko","pet","0.5",False),
    ("Salam Ice Tea Чёрный 0.5л","salam-ice-tea-chernyj-0-5l","Холодный чёрный чай Salam Ice Tea с лимоном.","60.00","0.00",150,"bezalko","pet","0.5",False),
    ("Живая вода Лайм 0.5л","zhivaya-voda-lajm-0-5l","Витаминизированная вода «Живая» со вкусом лайма.","50.00","0.00",180,"bezalko","pet","0.5",False),
    ("Минеральная вода Ыссык-Ата Тунгуч 0.5л","mineralnaya-voda-yssyk-ata-tunguch-0-5l","Природная минеральная вода «Ыссык-Ата Тунгуч». Без газа, 0.5 л.","30.00","0.00",250,"bezalko","pet","0.5",False),
    ("Минеральная вода Ыссык-Ата Тунгуч 1.5л","mineralnaya-voda-yssyk-ata-tunguch-1-5l","Природная минеральная вода «Ыссык-Ата Тунгуч». Без газа, 1.5 л.","55.00","0.00",250,"bezalko","pet","1.5",False),
    ("NITRO Balance+ Клубника 0.5л","nitro-balance-klubnika-0-5l","Тонизирующий напиток NITRO Balance+ со вкусом клубники. Таурин, кофеин, витамины B.","110.00","10.00",150,"energ","can","0.5",False),
    ("NITRO Balance+ Лайм 0.5л","nitro-balance-lajm-0-5l","Тонизирующий напиток NITRO Balance+ со вкусом лайма.","110.00","0.00",150,"energ","can","0.5",False),
    ("NITRO Tropical Energy 0.5л","nitro-tropical-energy-0-5l","Энергетик NITRO Tropical с тропическим вкусом.","115.00","0.00",140,"energ","can","0.5",False),
    ("NITRO Wild Energy 0.5л","nitro-wild-energy-0-5l","Энергетик NITRO Wild с насыщенным ягодным вкусом.","115.00","0.00",140,"energ","can","0.5",False),
    ("NITRO Max Energy 0.25л","nitro-max-energy-0-25l","Компактный энергетик NITRO Max 0.25 л — быстрый заряд бодрости.","85.00","0.00",120,"energ","can","0.25",False),
    ("NITRO Green Energy 0.5л","nitro-green-energy-0-5l","Энергетик NITRO Green со вкусом зелёных фруктов.","115.00","0.00",140,"energ","can","0.5",False),
    ("Живое Светлое разливное 1л","zhivoe-svetloe-razlivnoe-1l","Живое светлое пиво на розлив. Свежее, непастеризованное.","120.00","0.00",100,"razliv","pet","1.0",True),
    ("Живое Нефильтрованное разливное 1л","zhivoe-nefiltrovannoe-razlivnoe-1l","Живое нефильтрованное пиво на розлив. Натуральный вкус.","125.00","0.00",90,"razliv","pet","1.0",True),
    ("Urban 312 разливное 1л","urban-312-razlivnoe-1l","Пшеничное нефильтрованное Urban 312 на розлив.","140.00","0.00",80,"razliv","pet","1.0",True),
    ("Квас Живой Хлебный разливной 1л","kvas-zhivoj-hlebnyj-razlivnoj-1l","Натуральный хлебный квас «Живой» на розлив. Без консервантов.","80.00","0.00",90,"razliv","pet","1.0",False),
    ("Квас Живой Ржаной разливной 1л","kvas-zhivoj-rzhanoj-razlivnoj-1l","Ржаной квас «Живой» на розлив. Домашний вкус.","80.00","0.00",90,"razliv","pet","1.0",False),
    ("Лимонад разливной 1л","limonad-razlivnoj-1l","Домашний лимонад на розлив — лимон, мята, имбирь.","90.00","0.00",80,"razliv","pet","1.0",False),
    ("Растительный напиток Овсяный 1л","rastitelnyj-napitok-ovsyanyj-1l","Овсяный растительный напиток Абдыш-Ата. Без лактозы, подходит для веганов.","220.00","12.00",100,"rast","pet","1.0",False),
    ("Растительный напиток Кокосовый 1л","rastitelnyj-napitok-kokosovyj-1l","Кокосовый растительный напиток Абдыш-Ата. Нежный вкус, без лактозы.","240.00","0.00",90,"rast","pet","1.0",False),
    ("Растительный напиток Овсяный 0.5л","rastitelnyj-napitok-ovsyanyj-0-5l","Овсяный растительный напиток в формате 0.5 л.","130.00","0.00",120,"rast","pet","0.5",False),
    ("Растительный напиток Кокосовый 0.5л","rastitelnyj-napitok-kokosovyj-0-5l","Кокосовый растительный напиток в формате 0.5 л.","140.00","0.00",110,"rast","pet","0.5",False),
    ("Urban 312 Cider Яблоко-Груша 0.5л","urban-312-cider-yabloko-grusha-0-5l","Сидр Urban 312 со вкусом яблока и груши. Лёгкий и освежающий.","150.00","10.00",80,"alko","glass","0.5",True),
    ("Urban 312 Cider Клубника-Лайм-Мята 0.5л","urban-312-cider-klubnika-lajm-myata-0-5l","Сидр Urban 312 со вкусом клубники, лайма и мяты.","155.00","0.00",80,"alko","glass","0.5",True),
    ("Urban 312 Cider Чёрная Смородина-Малина 0.5л","urban-312-cider-chernaya-smorodina-malina-0-5l","Сидр Urban 312 со вкусом чёрной смородины и малины.","155.00","0.00",80,"alko","glass","0.5",True),
    ("Scorpio Классический 0.5л","scorpio-klassicheskij-0-5l","Слабоалкогольный напиток Scorpio, классический вкус.","140.00","0.00",90,"alko","can","0.5",True),
    ("Scorpio Манго-Клубника 0.5л","scorpio-mango-klubnika-0-5l","Слабоалкогольный напиток Scorpio со вкусом манго и клубники.","145.00","0.00",90,"alko","can","0.5",True),
    ("Scorpio Экзотик 0.5л","scorpio-ekzotik-0-5l","Слабоалкогольный напиток Scorpio с экзотическим вкусом.","145.00","0.00",90,"alko","can","0.5",True),
]

VALID_CONT = {"glass","can","pet"}
VALID_VOL = {"0.25","0.5","0.75","1.0","1.5","2.0"}

data, names, slugs = [], set(), set()
for i,(name,slug,desc,price,disc,qty,cat,cont,vol,alco) in enumerate(rows, start=1):
    assert name not in names, "ДУБЛЬ ИМЕНИ: "+name
    assert slug not in slugs, "ДУБЛЬ SLUG: "+slug
    assert cont in VALID_CONT, "НЕВЕРНАЯ ТАРА "+cont
    assert vol in VALID_VOL, "НЕВЕРНЫЙ ОБЪЁМ "+vol
    assert cat in CAT, "НЕВЕРНАЯ КАТЕГОРИЯ "+cat
    names.add(name); slugs.add(slug)
    data.append({"model":"goods.products","pk":i,"fields":{
        "name":name,"slug":slug,"description":desc,"image":None,
        "price":price,"discount":disc,"quantity":qty,
        "category":CAT[cat],"container":cont,"volume":vol,"is_alcoholic":alco}})

path = os.path.join("fixtures","goods","products.json")
with open(path,"w",encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open(path,encoding="utf-8") as f:
    check = json.load(f)
print("Файл записан:", path)
print("Всего товаров:", len(check))
print("По категориям (pk:кол-во):", dict(sorted(Counter(x["fields"]["category"] for x in check).items())))
print("Со скидкой:", [x["pk"] for x in check if x["fields"]["discount"]!="0.00"])
print("Первый:", check[0]["fields"]["name"])
print("Последний:", check[-1]["fields"]["name"])
