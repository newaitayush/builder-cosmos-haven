# Generated initial migration

from django.db import migrations, models
import django.core.validators
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('customer_id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('age', models.IntegerField(validators=[django.core.validators.MinValueValidator(18), django.core.validators.MaxValueValidator(100)])),
                ('phone_number', models.CharField(max_length=15)),
                ('monthly_salary', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('approved_limit', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'customers',
            },
        ),
        migrations.CreateModel(
            name='Loan',
            fields=[
                ('loan_id', models.AutoField(primary_key=True, serialize=False)),
                ('loan_amount', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('tenure', models.IntegerField(help_text='Tenure in months', validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(360)])),
                ('interest_rate', models.FloatField(validators=[django.core.validators.MinValueValidator(0.1), django.core.validators.MaxValueValidator(50.0)])),
                ('monthly_payment', models.FloatField()),
                ('emis_paid_on_time', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loans', to='loans.customer')),
            ],
            options={
                'db_table': 'loans',
            },
        ),
    ]
