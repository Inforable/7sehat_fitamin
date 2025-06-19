from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta

class User:
    def __init__(self, mongo):
        self.mongo = mongo
        self.collection = mongo.db.users

    def create_user(self, name, email, password):
        # Register new user

        # Check email already exist
        if self.collection.find_one({'email': email}):
            return {'success': False, 'message': 'Email sudah terdaftar'}
        
        # Hash password
        hashed_password = generate_password_hash(password)

        # Data user
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # Insert data user to database
        result = self.collection.insert_one(user_data)

        if result.inserted_id:
            # Generate token
            token = create_access_token(identity=str(result.inserted_id), expires_delta=timedelta(days=7))
            return {
                'success': True,
                'message': 'Registrasi berhasil',
                'user': {
                    'id': str(result.inserted_id),
                    'name': name,
                    'email': email
                },
                'token': token
            }
        
        return {'success': False, 'message': 'Gagal melakukan registrasi'}
    
    def login_user(self, email, password):
        # Login user

        # Check email
        user = self.collection.find_one({'email': email})

        if not user:
            return {'success': False, 'message': 'Email tidak terdaftar'}
        
        if not check_password_hash(user['password'], password):
            return {'success': False, 'message': 'Password salah'}
        
        # Generate token
        token = create_access_token(identity=str(user['_id']), expires_delta=timedelta(days=7))

        return {
            'success': True,
            'message': 'Login berhasil',
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            },
            'token': token
        }
    
    # Get user by ID
    def get_user_by_id(self, user_id):
        try:
            from bson import ObjectId
            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if user:
                return {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'created_at': user['created_at'],
                }
            return None
        except:
            return None
    
