from datetime import datetime
from bson import ObjectId
import pymongo

class BMI:
    def __init__(self, mongo):
        self.mongo = mongo
        self.collection = mongo.db.bmi_history
    
    def calculate_bmi(self, weight, height):
        """Calculate BMI and return BMI value and status"""
        try:
            weight = float(weight)
            height = float(height)

            height_m = height / 100  # convert cm to m
            bmi = weight / (height_m ** 2)
            bmi = round(bmi, 1)

            # Determine BMI category
            if bmi < 18.5:
                status = 'Kurus'
            elif bmi < 25:
                status = 'Normal'
            elif bmi < 30:
                status = 'Kelebihan Berat'
            else:
                status = 'Obesitas'
            
            return bmi, status
        
        except Exception as e:
            print(f"Error calculating BMI: {str(e)}")
            return None, None
    
    def save_bmi(self, user_id, weight, height, notes=''):
        """Save BMI to database"""
        try:
            bmi, status = self.calculate_bmi(weight, height)
            
            if bmi is None or status is None:
                return {'success': False, 'message': 'Error menghitung BMI'}

            bmi_data = {
                'user_id': user_id,
                'weight': float(weight),
                'height': float(height),
                'bmi': bmi,
                'bmi_status': status,
                'notes': notes,
                'created_at': datetime.utcnow()
            }

            result = self.collection.insert_one(bmi_data)

            if result.inserted_id:
                return {
                    'success': True,
                    'message': 'BMI berhasil disimpan',
                    'data': {
                        'id': str(result.inserted_id),
                        'bmi': bmi,
                        'bmi_status': status,
                        'weight': float(weight),
                        'height': float(height),
                        'created_at': bmi_data['created_at'].isoformat(),
                    }
                }
            
            return {'success': False, 'message': 'Gagal menyimpan BMI'}
        
        except Exception as e:
            print(f"Error saving BMI: {str(e)}")
            return {'success': False, 'message': 'Error saving BMI', 'error': str(e)}
    
    def get_user_bmi_history(self, user_id):
        """Get user BMI history"""
        try:
            history = list(self.collection.find({'user_id': user_id}).sort('created_at', pymongo.DESCENDING))

            # Convert ObjectId to string and format dates
            for record in history:
                record['id'] = str(record['_id'])
                del record['_id']
                record['date'] = record['created_at'].isoformat()

            return {
                'success': True,
                'data': history
            }
    
        except Exception as e:
            print(f"Error getting BMI history: {str(e)}")
            return {'success': False, 'message': 'Gagal mengambil riwayat BMI', 'error': str(e)}
    
    def get_latest_bmi(self, user_id):
        """Get latest BMI record for user"""
        try:
            latest_record = self.collection.find_one(
                {'user_id': user_id},
                sort=[('created_at', pymongo.DESCENDING)]
            )

            if latest_record:
                latest_record['id'] = str(latest_record['_id'])
                del latest_record['_id']
                latest_record['date'] = latest_record['created_at'].isoformat()
                
                return {
                    'success': True,
                    'data': latest_record
                }
            else:
                return {'success': False, 'message': 'Tidak ada data BMI ditemukan untuk pengguna ini'}
        
        except Exception as e:
            print(f"Error getting latest BMI: {str(e)}")
            return {'success': False, 'message': 'Gagal mengambil data BMI terbaru', 'error': str(e)}