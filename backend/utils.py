import random
from bson import ObjectId
from datetime import datetime

def generate_verification_code():
    return ''.join(str(random.randint(0, 9)) for _ in range(6))

def prepare_data_for_client(data):
    if isinstance(data, list):
        return [prepare_data_for_client(item) for item in data]
    elif isinstance(data, dict):
        return {k: prepare_data_for_client(v) for k, v in data.items()}
    elif isinstance(data, (ObjectId, datetime)):
        return str(data) if isinstance(data, ObjectId) else data.strftime('%Y-%m-%d %H:%M:%S')
    else:
        return data

def prepare_data_for_db(data):
    if isinstance(data, list):
        return [prepare_data_for_db(item) for item in data]
    elif isinstance(data, dict):
        return {k: prepare_data_for_db(v) for k, v in data.items()}
    elif isinstance(data, str):
        try:
            # Пытаемся преобразовать строку в ObjectId
            return ObjectId(data)
        except Exception:
            try:
                # Пытаемся преобразовать строку в datetime
                return datetime.strptime(data, '%Y-%m-%d %H:%M:%S')
            except Exception:
                # Если не удалось преобразовать, возвращаем исходную строку
                return data
    else:
        return data
