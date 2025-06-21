from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import model
from models.user import User

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Initialize extensions
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Initialize user model
user_model = User(mongo)

# Test route
@app.route('/')
def hello():
    return {'message': 'Flask Backend 7sehat_fitamin with MongoDB is running!'}

# Test MongoDB connection
@app.route('/test-db')
def test_db():
    try:
        # Test insert
        result = mongo.db.test.insert_one({'message': 'MongoDB connected!'})
        return {'success': True, 'message': 'MongoDB connected successfully!'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

# Register user
@app.route('/api/auth/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return jsonify({'message': 'Register endpoint ready', 'method': 'POST'})
    
    try:
        data = request.get_json()

        # Validate input
        if not data or not data.get('name') or not data.get('email') or not data.get('password'):
            return jsonify({'success': False, 'message': 'Invalid input'}), 400
        
        # Register user
        result = user_model.create_user(
            name=data['name'],
            email=data['email'],
            password=data['password']
        )

        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': 'Terjadi kesalahan server'}), 500
    
# Login user
@app.route('/api/auth/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return jsonify({'message': 'Login endpoint ready', 'method': 'POST'})
    
    try:
        data = request.get_json()

        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'success': False, 'message': 'Email atau password tidak valid'}), 400

        # Login user
        result = user_model.login_user(
            email=data['email'],
            password=data['password']
        )

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': 'Terjadi kesalahan server'}), 500

# Get full user profile
@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_full_profile():
    try:
        current_user_id = get_jwt_identity()
        user = user_model.get_full_user_profile(current_user_id)

        if user:
            return jsonify({'success': True, 'user': user}), 200
        else:
            return jsonify({'success': False, 'message': 'User tidak ditemukan'}), 404
    
    except Exception as e:
        return jsonify({'success': False, 'message': 'Terjadi kesalahan server'}), 500

# Update user profile
@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'Data tidak valid'}), 400
        
        # Basic validation
        if 'name' in data and not data['name'].strip():
            return jsonify({'success': False, 'message': 'Nama tidak boleh kosong'}), 400
            
        if 'age' in data and (not isinstance(data['age'], int) or data['age'] < 1 or data['age'] > 150):
            return jsonify({'success': False, 'message': 'Umur tidak valid (1-150 tahun)'}), 400
            
        if 'height' in data and (not isinstance(data['height'], (int, float)) or data['height'] < 100 or data['height'] > 250):
            return jsonify({'success': False, 'message': 'Tinggi badan tidak valid (100-250 cm)'}), 400
            
        if 'currentWeight' in data and (not isinstance(data['currentWeight'], (int, float)) or data['currentWeight'] < 30 or data['currentWeight'] > 300):
            return jsonify({'success': False, 'message': 'Berat badan tidak valid (30-300 kg)'}), 400
            
        if 'targetWeight' in data and (not isinstance(data['targetWeight'], (int, float)) or data['targetWeight'] < 30 or data['targetWeight'] > 300):
            return jsonify({'success': False, 'message': 'Target berat tidak valid (30-300 kg)'}), 400
        
        result = user_model.update_profile(current_user_id, data)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'message': 'Terjadi kesalahan server'}), 500

# ====================== TEST SECTION ======================

# Test Register
@app.route('/test-register')
def test_register():
    try:
        # Data dummy untuk test
        result = user_model.create_user(
            name="Test User",
            email="test@example.com", 
            password="password123"
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Test Login 
@app.route('/test-login')
def test_login():
    try:
        # Login dengan data dummy
        result = user_model.login_user(
            email="test@example.com",
            password="password123"
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Test Profile Routes (no auth)
@app.route('/test-profile')
def test_profile():
    try:
        # Ambil user pertama dari database untuk test
        test_user = mongo.db.users.find_one()
        if not test_user:
            return jsonify({'success': False, 'message': 'No users found. Register first.'})
        
        user_id = str(test_user['_id'])
        result = user_model.get_user_profile(user_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Test Update Profile (no auth)
@app.route('/test-update-profile')
def test_update_profile_no_auth():
    try:
        # Ambil user pertama dari database untuk test
        test_user = mongo.db.users.find_one()
        if not test_user:
            return jsonify({'success': False, 'message': 'No users found. Register first.'})
        
        user_id = str(test_user['_id'])
        
        # Test data
        test_data = {
            'name': 'John Doe Updated',
            'age': 25,
            'gender': 'Pria',
            'height': 175,
            'currentWeight': 70.5,
            'targetWeight': 65.0,
            'fitnessGoal': 'Menurunkan Berat'
        }
        
        result = user_model.update_profile(user_id, test_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# Test List Users
@app.route('/test-list-users')
def test_list_users():
    try:
        users = list(mongo.db.users.find({}, {'password': 0}))  # Exclude password
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify({'success': True, 'users': users})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)