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
            'updated_at': datetime.utcnow(),
            # Extended for profile fields
            'age': None,
            'gender': None,
            'height': None,
            'currentWeight': None,
            'targetWeight': None,
            'fitnessGoal': None,
        }

        # Insert data user to database
        try:
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
        
        except Exception as e:
            return {'success': False, 'message': 'Terjadi kesalahan saat registrasi', 'error': str(e)}
    
    def login_user(self, email, password):
        # Login user
        try:

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
    
        except Exception as e:
            return {'success': False, 'message': 'Terjadi kesalahan saat login', 'error': str(e)}
    
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
        except Exception as e:
            return {'success': False, 'message': 'Terjadi kesalahan saat mengambil data user', 'error': str(e)}
    
    # Get full user profile
    def get_user_profile(self, user_id):
        try:
            from bson import ObjectId
            user_data = self.collection.find_one({'_id': ObjectId(user_id)})
            
            if user_data:
                # Calculate BMI if height and weight exist
                bmi = None
                bmi_status = None
                
                current_height = user_data.get('height')
                current_weight = user_data.get('currentWeight')
                
                if current_height and current_weight:
                    height_m = current_height / 100  # convert cm to m
                    bmi = current_weight / (height_m ** 2)
                    
                    # BMI categories
                    if bmi < 18.5:
                        bmi_status = 'Kurang'
                    elif bmi < 25:
                        bmi_status = 'Normal'
                    elif bmi < 30:
                        bmi_status = 'Berlebih'
                    else:
                        bmi_status = 'Obesitas'
                
                return {
                    'success': True,
                    'user': {
                        'id': str(user_data['_id']),
                        'name': user_data.get('name', ''),
                        'email': user_data.get('email', ''),
                        'age': user_data.get('age'),
                        'gender': user_data.get('gender'),
                        'height': user_data.get('height'),
                        'currentWeight': user_data.get('currentWeight'),
                        'targetWeight': user_data.get('targetWeight'),
                        'fitnessGoal': user_data.get('fitnessGoal'),
                        'bmi': round(bmi, 1) if bmi else None,
                        'bmi_status': bmi_status,
                        'joinDate': user_data.get('created_at').isoformat() if user_data.get('created_at') else None, 
        'created_at': user_data.get('created_at').isoformat() if user_data.get('created_at') else None, 
        'updated_at': user_data.get('updated_at').isoformat() if user_data.get('updated_at') else None 
                    }
                }
            else:
                return {'success': False, 'message': 'User tidak ditemukan'}
                
        except Exception as e:
            print(f"Get user profile error: {str(e)}")
            return {'success': False, 'message': f'Error: {str(e)}'}

    # Update user profile
    def update_user_profile(self, user_id, profile_data):
        try:
            from bson import ObjectId

            # Allowed fields to update
            allowed_fields = ['name', 'age', 'gender', 'height', 'currentWeight', 'targetWeight', 'fitnessGoal']

            update_data = {
                'updated_at': datetime.utcnow()
            }

            # Ony update allowed fields that are provided
            for field in allowed_fields:
                if field in profile_data:
                    update_data[field] = profile_data[field]
            
            # Perform the update
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )

            if result.modified_count > 0 or result.matched_count > 0:
                # Get updated user profile
                updated_profile = self.get_user_profile(user_id)
                if updated_profile['success']:
                    return {
                        'success': True,
                        'message': 'Profil berhasil diupdate',
                        'user': updated_profile['user']
                    }
                else:
                    return updated_profile
            else:
                return {'success': False, 'message': 'User tidak ditemukan'}
                
        except Exception as e:
            print(f"Update profile error: {str(e)}")
            return {'success': False, 'message': f'Error: {str(e)}'}
