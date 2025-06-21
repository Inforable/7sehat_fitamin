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

# Get profile user
@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = user_model.get_user_by_id(current_user_id)

        if user:
            return jsonify({'success': True, 'user': user}), 200
        else:
            return jsonify({'success': False, 'message': 'User tidak ditemukan'}), 404
    
    except Exception as e:
        return jsonify({'success': False, 'message': 'Terjadi kesalahan server'}), 500

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

if __name__ == '__main__':
    app.run(debug=True)