from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
import os

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

if __name__ == '__main__':
    app.run(debug=True)