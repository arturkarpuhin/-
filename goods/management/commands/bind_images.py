from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from pathlib import Path
from goods.models import Products


class Command(BaseCommand):
    help = "Bind PNG/JPG images from media/imports/ to Products by slug"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Только показать, что будет сделано, без записи в БД",
        )
        parser.add_argument(
            "--source",
            default="imports",
            help="Подпапка внутри MEDIA_ROOT для сканирования (default: imports)",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        source_dir = Path(settings.MEDIA_ROOT) / options["source"]

        if not source_dir.exists():
            self.stderr.write(f"Папка не найдена: {source_dir}")
            return

        # 1. Собираем все картинки рекурсивно
        image_extensions = {".png", ".jpg", ".jpeg", ".webp"}
        all_images = [
            p for p in source_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in image_extensions
        ]
        self.stdout.write(f"Найдено картинок: {len(all_images)}")

        # 2. Для каждой картинки ищем товар по slug = имя файла
        bound = 0
        skipped_no_product = []
        skipped_already_has = []

        for img_path in all_images:
            slug = img_path.stem  # имя файла без расширения
            try:
                product = Products.objects.get(slug=slug)
            except Products.DoesNotExist:
                skipped_no_product.append(img_path.name)
                continue

            if product.image and product.image.name and not dry_run:
                skipped_already_has.append(f"{slug} (уже есть картинка)")
                continue

            if dry_run:
                self.stdout.write(f"  [dry] {img_path.name} -> {product.name}")
                bound += 1
                continue

            with open(img_path, "rb") as f:
                product.image.save(img_path.name, File(f), save=True)
            bound += 1
            self.stdout.write(f"  [OK] {img_path.name} -> {product.name}")

        # 3. Итог
        self.stdout.write("")
        self.stdout.write("=" * 50)
        self.stdout.write(f"Привязано:               {bound}")
        self.stdout.write(f"Картинок без товара:     {len(skipped_no_product)}")
        if skipped_no_product:
            self.stdout.write("  Файлы без соответствующего товара:")
            for name in skipped_no_product:
                self.stdout.write(f"    - {name}")
        self.stdout.write(f"Пропущено (уже есть):    {len(skipped_already_has)}")

        # 4. Товары БЕЗ картинок
        products_without_image = Products.objects.filter(image="")
        self.stdout.write(
            f"Товары без картинки:     {products_without_image.count()}"
        )
        if products_without_image.exists():
            self.stdout.write("  Slug'и товаров, для которых нет картинок:")
            for p in products_without_image:
                self.stdout.write(f"    - {p.slug}  ({p.name})")

        if dry_run:
            self.stdout.write("")
            self.stdout.write("DRY-RUN — изменений в БД не сделано.")
