from flask import Flask
from flask_pymongo import PyMongo
from models.bmi import BMI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/7sehat_fitamin')

mongo = PyMongo(app)
bmi_model = BMI(mongo)

def test_bmi_calculation():
    """Test BMI calculation"""
    print("=== Test BMI Calculation ===")
    
    test_cases = [
        (70, 170),  # Normal
        (45, 160),  # Kurus
        (85, 170),  # Kelebihan Berat
        (100, 170)  # Obesitas
    ]
    
    for weight, height in test_cases:
        bmi, status = bmi_model.calculate_bmi(weight, height)
        print(f"Weight: {weight}kg, Height: {height}cm -> BMI: {bmi}, Status: {status}")

def test_save_bmi():
    """Test saving BMI to database"""
    print("\n=== Test Save BMI ===")
    
    # Test user ID (ganti dengan ID user yang ada di database Anda)
    test_user_id = "test_user_123"
    
    result = bmi_model.save_bmi(
        user_id=test_user_id,
        weight=70,
        height=170,
        notes="Test BMI entry"
    )
    
    print(f"Save Result: {result}")
    
    # Test get history
    history = bmi_model.get_user_bmi_history(test_user_id)
    print(f"History: {history}")

if __name__ == "__main__":
    with app.app_context():
        test_bmi_calculation()
        test_save_bmi()