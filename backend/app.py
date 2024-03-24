import os
import json
import random
import base64
from bson import ObjectId
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_socketio import SocketIO, emit, disconnect
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64decode
from jwt import ExpiredSignatureError
from datetime import timedelta, datetime
import uuid
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/hoh')
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024  # 16 megabytes
app.config["JWT_SECRET_KEY"] = base64.b64encode(os.urandom(32)).decode('utf-8')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=60)
CORS(app, resources={r"/*": {"origins": "*"}})
mongo = PyMongo(app)
socketio = SocketIO(app, cors_allowed_origins="*", max_http_buffer_size=1024 * 1024 * 1024)
jwt = JWTManager(app)

def send_email(to, subject, message):
    msg = MIMEMultipart()
    msg['From'] = 'agafonov.egorushka@gmail.com'
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(message))

    mailserver = smtplib.SMTP('smtp.gmail.com', 587)
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login('agafonov.egorushka@gmail.com', 'tnqj nlsw dmtg kejl')
    mailserver.sendmail('agafonov.egorushka@gmail.com', to, msg.as_string())
    mailserver.quit()

def generate_verification_code():
    return ''.join(str(random.randint(0, 9)) for _ in range(6))

def prepare_data(data):
    return {k: v if not isinstance(v, (ObjectId, datetime)) else str(v) if isinstance(v, ObjectId) else v.strftime('%Y-%m-%d %H:%M:%S') for k, v in data.items()}

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = mongo.db.users.find_one({"email": email})
    if user:
        if check_password_hash(user['password'], password):
            if user["email_verified"] == True:
                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                return jsonify(access_token=access_token, refresh_token=refresh_token, follow={"link": "/crypto", "replace": True}), 200
            else:
                verify_code = generate_verification_code()
                mongo.db.codes.delete_many({"user_id": user["_id"]})
                code_id = mongo.db.codes.insert_one({
                    "user_id": user["_id"],
                    "verify_code": verify_code,
                    "created_at": datetime.now()
                }).inserted_id
                send_email(email, f'Your verify code - {verify_code}', 'Paste this code to HOH.')
                return jsonify(code_id=str(code_id), verify_type="email", follow={"link": "/verify", "replace": False}), 200
        else:
            return jsonify(error="Неверный E-mail или пароль"), 200
    else:
        return jsonify(error="Неверный E-mail или пароль"), 200

@app.route('/signup', methods=['POST'])
def signup():
    # mongo.db.users.delete_many({})
    # mongo.db.energies.delete_many({})
    # mongo.db.generations.delete_many({})
    email = request.json.get('email', None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    inviteCode = request.json.get('inviteCode', None)
    if mongo.db.users.find_one({"username": username}):
        return jsonify(error="Пользователь с таким именем уже существует"), 200
    elif mongo.db.users.find_one({"email": email}):
        return jsonify(error="Пользователь с таким E-mail уже существует"), 200
    else:
        hashed_password = generate_password_hash(password)
        verify_code = generate_verification_code()
        user_id = mongo.db.users.insert_one({
            "email": email,
            "username": username,
            "password": hashed_password,
            "invite_code": inviteCode,
            "email_verified": False,
            "balance": 2000,
            "created_at": datetime.now(),
        }).inserted_id
        code_id = mongo.db.codes.insert_one({
            "user_id": user_id,
            "verify_code": verify_code,
            "created_at": datetime.now()
        }).inserted_id
        send_email(email, f'Your verify code - {verify_code}', 'Paste this code to HOH.')
        return jsonify(code_id=str(code_id), verify_type="email", follow={"link": "/verify", "replace": False}), 200

@app.route('/verify', methods=['POST'])
def verify():
    code_id = request.json.get('code_id', None)
    verify_type = request.json.get('verify_type', None)
    code = request.json.get('code', None)
    result = mongo.db.codes.find_one({"_id": ObjectId(code_id)})
    if not result:
        return jsonify(error="\'code_id\' not found"), 200
    elif int(result['verify_code']) != int(code):
        return jsonify(error="\'verify_code\' is incorrect"), 200
    else:
        user = mongo.db.users.find_one({"_id": ObjectId(result["user_id"])})
        if not user:
            return jsonify(error="\'user\' not found"), 200
        else:
            access_token = create_access_token(identity=user["email"])
            refresh_token = create_refresh_token(identity=user["email"])
            mongo.db.codes.delete_one({"_id": result["_id"]})
            if verify_type == "email":
                mongo.db.energies.insert_one({
                    "user_id": ObjectId(result["user_id"]),
                    "limit": 3,
                    "value": 3,
                    "minutes": 12
                })
                mongo.db.users.update_one({"_id": ObjectId(result["user_id"])}, {"$set": {"email_verified": True}})
                return jsonify(access_token=access_token, refresh_token=refresh_token, follow={"link": "/crypto", "replace": True}), 200
            elif verify_type == "create_wallet" or verify_type == "import_wallet":
                mongo.db.users.update_one({"_id": ObjectId(result["user_id"])}, {"$set": {"wallet_verified": True}})
                return jsonify(wallet=user["wallet"], follow={"link": "/game", "replace": True}), 200

@app.route('/resend-code', methods=['POST'])
def resend_code():
    code_id = request.json.get('code_id', None)
    result = mongo.db.codes.find_one({"_id": ObjectId(code_id)})
    if not result:
        return jsonify(error="\'code_id\' not found"), 200
    else:
        user = mongo.db.users.find_one({"_id": ObjectId(result["user_id"])})
        if not user:
            return jsonify(error="\'user\' not found"), 200
        else:
            verify_code = generate_verification_code()
            mongo.db.codes.update_one({"_id": result["_id"]}, {"$set": {"verify_code": verify_code}})
            send_email(user["email"], f'Your verify code - {verify_code}', 'Paste this code to HOH.')
            return jsonify(code_id=str(code_id)), 200

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    refresh_token = get_jwt()['jti']
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@socketio.on('connect')
@jwt_required()
def handle_connect():
    print('A user connected')

@socketio.on('disconnect')
@jwt_required()
def handle_disconnect():
    print('A user disconnected')

@socketio.on('message')
@jwt_required()
def handle_message(message):
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({"email": current_user})
    message = json.loads(message)
    print(message)
    if message[0] == 'user':
        if message[1] == 'get':
            emit('message', json.dumps([message[0], message[1], prepare_data(user)]))
        elif message[1] == 'add_wallet':
            if "wallet_verified" in user:
                if user["wallet_verified"]:
                    emit('message', json.dumps([message[0], message[1], {"follow": {"link": "/game", "replace": True}}]))
                    return
            verify_code = generate_verification_code()
            mongo.db.users.update_one({"_id": user["_id"]}, {"$set": {"wallet": message[2], "wallet_verified": False}})
            code_id = mongo.db.codes.insert_one({
                "user_id": user["_id"],
                "verify_code": verify_code,
                "created_at": datetime.now()
            }).inserted_id
            send_email(user["email"], f'Your verify code - {verify_code}', 'Paste this code to HOH.')
            emit('message', json.dumps([message[0], message[1], {"code_id": str(code_id), "verify_type": message[3], "follow": {"link": "/verify", "replace": True}}]))
    elif message[0] == 'energy':
        if message[1] == 'get':
            energy = mongo.db.energies.find_one({"user_id": user["_id"]})
            if energy:
                emit('message', json.dumps([message[0], message[1], prepare_data(energy)]))
            else:
                energy_id = mongo.db.energies.insert_one({
                    "user_id": user["_id"],
                    "limit": 3,
                    "value": 3,
                    "minutes": 12
                }).inserted_id
                emit('message', json.dumps([message[0], message[1], prepare_data({
                    "_id": energy_id,
                    "user_id": user["_id"],
                    "limit": 3,
                    "value": 3,
                    "minutes": 12
                })]))
    elif message[0] == 'generation':
        if message[1] == 'get':
            energy = mongo.db.energies.find_one({"_id": ObjectId(message[2])})
            if energy:
                generation = mongo.db.generations.find_one({"energy_id": energy["_id"], "status": "pending"})
                if generation:
                    if datetime.now() >= generation["end"]:
                        mongo.db.generations.update_one({"_id": generation["_id"]}, {"$set": {"status": "done"}})
                        if energy["value"] < energy["limit"]:
                            mongo.db.energies.update_one({"_id": energy["_id"]}, {"$set": {"value": energy["value"] + 1}})
                        emit('message', json.dumps([message[0], message[1], message[2], None]))
                        energy = mongo.db.energies.find_one({"_id": energy["_id"]})
                        emit('message', json.dumps(["energy", "get", prepare_data(energy)]))
                    else:
                        emit('message', json.dumps([message[0], message[1], message[2], prepare_data(generation)]))
                else:
                    emit('message', json.dumps([message[0], message[1], message[2], None]))
        elif message[1] == 'add':
            energy = mongo.db.energies.find_one({"_id": ObjectId(message[2])})
            if energy:
                generation = mongo.db.generations.find_one({"energy_id": energy["_id"], "status": "pending"})
                if generation:
                    if datetime.now() >= generation["end"]:
                        mongo.db.generations.update_one({"_id": generation["_id"]}, {"$set": {"status": "done"}})
                        if energy["value"] < energy["limit"]:
                            mongo.db.energies.update_one({"_id": energy["_id"]}, {"$set": {"value": energy["value"] + 1}})
                        now = datetime.now()
                        generation_id = mongo.db.generations.insert_one({
                            "energy_id": energy["_id"],
                            "end": now + timedelta(minutes=energy["minutes"]),
                            "status": "pending",
                            "created_at": now
                        }).inserted_id
                        emit('message', json.dumps([message[0], message[1], message[2], prepare_data({
                            "_id": generation_id,
                            "end": now + timedelta(minutes=energy["minutes"]),
                            "status": "pending",
                            "created_at": now
                        })]))
                        energy = mongo.db.energies.find_one({"_id": energy["_id"]})
                        emit('message', json.dumps(["energy", "get", prepare_data(energy)]))
                    else:
                        emit('message', json.dumps([message[0], message[1], message[2], prepare_data(generation)]))
                else:
                    if energy["value"] < energy["limit"]:
                        now = datetime.now()
                        generation_id = mongo.db.generations.insert_one({
                            "energy_id": energy["_id"],
                            "end": now + timedelta(minutes=energy["minutes"]),
                            "status": "pending",
                            "created_at": now
                        }).inserted_id
                        emit('message', json.dumps([message[0], message[1], message[2], prepare_data({
                            "_id": generation_id,
                            "end": now + timedelta(minutes=energy["minutes"]),
                            "status": "pending",
                            "created_at": now
                        })]))
    elif message[0] == 'boost':
        energy = mongo.db.energies.find_one({"_id": ObjectId(message[2])})
        balance = user["balance"]
        if energy:
            if message[1] == 1:
                if energy["minutes"] > 5:
                    if user["balance"] >= 100 + 100 * (12 - energy["minutes"]):
                        mongo.db.users.update_one({"_id": user["_id"]}, {"$set": {"balance": user["balance"] - (100 + 100 * (12 - energy["minutes"]))}})
                        mongo.db.energies.update_one({"_id": energy["_id"]}, {"$set": {"minutes": energy["minutes"] - 1}})
                        emit('message', json.dumps([message[0], message[1], message[2], balance - (100 + 100 * (12 - energy["minutes"]))]))
                        energy = mongo.db.energies.find_one({"_id": energy["_id"]})
                        emit('message', json.dumps(["energy", "get", prepare_data(energy)]))
            elif message[1] == 2:
                if energy["limit"] < 10:
                    if user["balance"] >= 100 + 100 * (energy["limit"] - 3):
                        mongo.db.users.update_one({"_id": user["_id"]}, {"$set": {"balance": user["balance"] - (100 + 100 * (energy["limit"] - 3))}})
                        mongo.db.energies.update_one({"_id": energy["_id"]}, {"$set": {"limit": energy["limit"] + 1}})
                        emit('message', json.dumps([message[0], message[1], message[2], balance - (100 + 100 * (energy["limit"] - 3))]))
                        energy = mongo.db.energies.find_one({"_id": energy["_id"]})
                        emit('message', json.dumps(["energy", "get", prepare_data(energy)]))

    elif message[0] == 'game':
        energy = mongo.db.energies.find_one({"_id": ObjectId(message[1])})
        if energy:
            if energy["value"] > 0:
                # Список чисел, из которых будет создан рандомный список
                numbers = [1, 2, 3]
                # Веса для каждого числа
                weights = [0.8, 0.15, 0.05]  # Сумма весов должна быть равна 1
                # Количество элементов в рандомном списке
                list_length = 3
                # Создаем рандомный список с весами
                random_list = random.choices(numbers, weights, k=list_length)

                mongo.db.energies.update_one({"_id": energy["_id"]}, {"$set": {"value": energy["value"] - 1}})

                balance = user["balance"]

                if random_list[message[2]] == 2:
                    mongo.db.users.update_one({"_id": user["_id"]}, {"$set": {"balance": user["balance"] + 10000}})
                    balance += 10000

                emit('message', json.dumps([message[0], message[1], message[2], random_list, balance]))

@socketio.on_error_default
def default_error_handler(e):
    if isinstance(e, ExpiredSignatureError):
        emit('message', json.dumps(["error", "Token has expired"]))
    elif 'Signature verification failed' in str(e):
        emit('message', json.dumps(["error", "Token has expired"]))
    else:
        print(str(e))

if __name__ == '__main__':
    socketio.run(app)
