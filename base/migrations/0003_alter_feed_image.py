# Generated by Django 4.0.3 on 2022-04-09 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_feed_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feed',
            name='image',
            field=models.ImageField(null=True, upload_to='images'),
        ),
    ]
