# Credit Approval System - Django Backend

A comprehensive Django REST API backend for the Credit Approval System with PostgreSQL database.

## 🏗️ Architecture

- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django built-in (can be extended)
- **API Documentation**: RESTful endpoints

## 📋 Models

### Customer Model
- `customer_id` (AutoField, Primary Key)
- `first_name` (CharField)
- `last_name` (CharField) 
- `age` (IntegerField, 18-100)
- `phone_number` (CharField)
- `monthly_salary` (IntegerField)
- `approved_limit` (IntegerField) → auto-calculated as monthly_salary × 36

### Loan Model
- `loan_id` (AutoField, Primary Key)
- `customer` (ForeignKey to Customer)
- `loan_amount` (IntegerField)
- `tenure` (IntegerField, in months, 1-360)
- `interest_rate` (FloatField, 0.1-50%)
- `monthly_payment` (FloatField, auto-calculated EMI)
- `emis_paid_on_time` (IntegerField)
- `start_date` (DateField)
- `end_date` (DateField, auto-calculated)

## 🚀 Quick Setup

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- pip

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Run setup script**
   ```bash
   python setup.py
   ```

4. **Configure database in .env**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

5. **Start development server**
   ```bash
   python manage.py runserver 8000
   ```

The API will be available at `http://localhost:8000/api/`

## 🔗 API Endpoints

### Customer Management
- `POST /api/register` - Register new customer
- `GET /api/customers/` - List all customers (paginated)

### Loan Processing  
- `POST /api/check-eligibility` - Check loan eligibility
- `POST /api/create-loan` - Create new loan
- `GET /api/view-loan/<loan_id>` - Get loan by ID
- `GET /api/view-loans/<customer_id>` - Get customer's loans
- `GET /api/loans/` - List all loans (paginated)

### Data Import
- `POST /api/upload-excel` - Upload customer/loan data from Excel

## 📊 Credit Scoring Logic

Credit scores are calculated based on EMI payment history:

- **90-100% EMIs paid on time**: Score = 10
- **80-89%**: Score = 9  
- **70-79%**: Score = 8
- **60-69%**: Score = 7
- **50-59%**: Score = 6
- **40-49%**: Score = 5
- **30-39%**: Score = 4
- **20-29%**: Score = 3
- **10-19%**: Score = 2
- **0-9%**: Score = 1

## 💰 EMI Calculation

Uses the standard EMI formula:
```
EMI = [P × R × (1+R)^N] / [(1+R)^N-1]
```
Where:
- P = Principal loan amount
- R = Monthly interest rate (annual rate / 12 / 100)
- N = Number of months (tenure)

## 🔧 Configuration

### Environment Variables (.env)
```bash
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_NAME=credit_approval_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:8080` (React dev server)
- Your production frontend URL

## 📁 Project Structure

```
backend/
├── credit_approval/          # Django project settings
│   ├── settings.py          # Main configuration
│   ├── urls.py              # Root URL patterns
│   └── wsgi.py              # WSGI application
├── loans/                   # Main app
│   ├── models.py            # Customer & Loan models
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # App URL patterns
│   └── admin.py             # Admin configuration
├── requirements.txt         # Python dependencies
├── setup.py                # Setup script
└── README.md               # This file
```

## 🧪 Testing

Run Django tests:
```bash
python manage.py test
```

## 📱 Frontend Integration

This backend is designed to work with the existing React frontend. The API endpoints match exactly what the React app expects:

- All currency values are in Indian Rupees (₹)
- Response formats match frontend expectations
- CORS is configured for frontend development server

## 🛠️ Production Deployment

1. **Update settings for production**
   - Set `DEBUG=False`
   - Configure `ALLOWED_HOSTS`
   - Use environment variables for secrets

2. **Database setup**
   - Create PostgreSQL database
   - Run migrations: `python manage.py migrate`

3. **Static files**
   - Run: `python manage.py collectstatic`

4. **Web server**
   - Use Gunicorn or uWSGI
   - Configure Nginx for static files

## 📈 Sample Data

The system supports importing data from Excel files with the following formats:

### Customer Data (customer_data.xlsx)
| first_name | last_name | age | phone_number | monthly_salary |
|------------|-----------|-----|--------------|----------------|
| John       | Doe       | 30  | +91-9876543210 | 75000         |

### Loan Data (loan_data.xlsx)  
| customer_id | loan_amount | tenure | interest_rate | emis_paid_on_time | start_date |
|-------------|-------------|--------|---------------|-------------------|------------|
| 1           | 500000      | 24     | 12.5         | 18               | 2023-01-15 |

## 🔐 Admin Panel

Access the Django admin at `http://localhost:8000/admin/` to:
- View and manage customers
- Monitor loans
- Review payment history
- Import/export data

## 🤝 Contributing

1. Follow Django coding standards
2. Add tests for new features
3. Update API documentation
4. Use meaningful commit messages

## 📞 Support

For issues or questions:
1. Check the logs: `python manage.py runserver --verbosity=2`
2. Verify database connection
3. Ensure all migrations are applied
4. Check CORS settings for frontend integration
