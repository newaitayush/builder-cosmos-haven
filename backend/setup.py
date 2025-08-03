#!/usr/bin/env python3
"""
Setup script for Credit Approval System Django Backend
"""

import os
import sys
import subprocess


def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during {description}:")
        print(f"Command: {command}")
        print(f"Error: {e.stderr}")
        return None


def main():
    print("🚀 Setting up Credit Approval System Django Backend\n")
    
    # Check if virtual environment exists
    if 'VIRTUAL_ENV' not in os.environ:
        print("⚠️  Warning: No virtual environment detected.")
        print("It's recommended to run this in a virtual environment.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            sys.exit(1)
    
    # Install requirements
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        sys.exit(1)
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        print("\n📝 Creating .env file...")
        import shutil
        shutil.copy('.env.example', '.env')
        print("✅ Created .env file from template")
        print("⚠️  Please update the database credentials in .env file")
    
    # Run migrations
    if not run_command("python manage.py makemigrations", "Creating database migrations"):
        sys.exit(1)
    
    if not run_command("python manage.py migrate", "Applying database migrations"):
        print("❌ Migration failed. Please check your database configuration in .env file")
        sys.exit(1)
    
    # Create superuser (optional)
    print("\n👤 Create Django admin superuser? (y/N): ", end="")
    if input().lower() == 'y':
        run_command("python manage.py createsuperuser", "Creating superuser")
    
    # Collect static files (for production)
    run_command("python manage.py collectstatic --noinput", "Collecting static files")
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Update database credentials in .env file if needed")
    print("2. Run the development server: python manage.py runserver 8000")
    print("3. Access admin panel: http://localhost:8000/admin/")
    print("4. API endpoints available at: http://localhost:8000/api/")
    print("\n📚 API Documentation:")
    print("- POST /api/register - Register new customer")
    print("- POST /api/check-eligibility - Check loan eligibility")
    print("- POST /api/create-loan - Create new loan")
    print("- GET /api/view-loan/<loan_id> - View loan details")
    print("- GET /api/view-loans/<customer_id> - View customer loans")
    print("- POST /api/upload-excel - Upload Excel data")


if __name__ == "__main__":
    main()
