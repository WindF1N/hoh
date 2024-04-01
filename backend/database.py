from flask_pymongo import PyMongo
from utils import prepare_data_for_client, prepare_data_for_db

class User:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, referral_id, avatar, username, email, email_verified, wallet, wallet_verified, game_balance, balance, password):
        return prepare_data_for_client(
            self.mongo.db.users.insert_one(
                prepare_data_for_db({
                    "referral_id": referral_id,
                    "avatar": avatar,
                    "username": username,
                    "email": email,
                    "email_verified": email_verified,
                    "wallet": wallet,
                    "wallet_verified": wallet_verified,
                    "game_balance": game_balance,
                    "balance": balance,
                    "password": password
                }
            )).inserted_id
        )

    def update(self, id, data):
        self.mongo.db.users.update_one({"_id": prepare_data_for_db(id)}, data)
    
    def is_exists(self, data):
        if self.mongo.db.users.find_one(data):
            return True
        else:
            return False
    
    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.users.find_one(prepare_data_for_db(data))
        )

    def search(self, data):
        return prepare_data_for_client(
            list(self.mongo.db.users.find_one(prepare_data_for_db(data)))
        )

class Hamster:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, user_id, sprite):
        return prepare_data_for_client(
            self.mongo.db.hamsters.insert_one(
                prepare_data_for_db({
                    "user_id": user_id,
                    "sprite": sprite
                })
            ).inserted_id
        )

class Energy:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, user_id, limit, value, minutes):
        return prepare_data_for_client(
            self.mongo.db.energies.insert_one(
                prepare_data_for_db({
                    "user_id": user_id,
                    "limit": limit,
                    "value": value,
                    "minutes": minutes
                })
            ).inserted_id
        )

    def update(self, id, data):
        self.mongo.db.energies.update_one({"_id": prepare_data_for_db(id)}, data)

    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.energies.find_one(prepare_data_for_db(data))
        )

class Generation:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, energy_id, end, created_at):
        return prepare_data_for_client(
            self.mongo.db.generations.insert_one(
                prepare_data_for_db({
                    "energy_id": energy_id,
                    "end": end,
                    "created_at": created_at
                })
            ).inserted_id
        )

    def update(self, id, data):
        self.mongo.db.generations.update_one({"_id": prepare_data_for_db(id)}, data)

    def remove(self, data):
        self.mongo.db.generations.delete_many(prepare_data_for_db(data))

    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.generations.find_one(prepare_data_for_db(data))
        )

class Game:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, user_id, created_at):
        return prepare_data_for_client(
            self.mongo.db.games.insert_one(
                prepare_data_for_db({
                    "user_id": user_id,
                    "created_at": created_at
                })
            ).inserted_id
        )

class Deck:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, game_id, cards_list, selected_card):
        return prepare_data_for_client(
            self.mongo.db.decks.insert_one(
                prepare_data_for_db({
                    "game_id": game_id,
                    "cards_list": cards_list,
                    "selected_card": selected_card
                })
            ).inserted_id
        )

class Card:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, sprite, chance, name):
        return prepare_data_for_client(
            self.mongo.db.cards.insert_one(
                prepare_data_for_db({
                    "sprite": sprite,
                    "chance": chance,
                    "name": name
                })
            ).inserted_id
        )

class Boost:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, price, name):
        return prepare_data_for_client(
            self.mongo.db.boosts.insert_one(
                prepare_data_for_db({
                    "price": price,
                    "name": name
                })
            ).inserted_id
        )

class UserBoost:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, boost_id, balance, energy_limit, energy_minutes, created_at):
        return prepare_data_for_client(
            self.mongo.db.user_boosts.insert_one(
                prepare_data_for_db({
                    "boost_id": boost_id,
                    "balance": balance,
                    "energy_limit": energy_limit,
                    "energy_minutes": energy_minutes,
                    "created_at": created_at
                })
            ).inserted_id
        )

class Partner:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, icon, name, price):
        return prepare_data_for_client(
            self.mongo.db.partners.insert_one(
                prepare_data_for_db({
                    "icon": icon,
                    "name": name,
                    "price": price
                })
            ).inserted_id
        )

class Task:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, partner_id, text):
        return prepare_data_for_client(
            self.mongo.db.tasks.insert_one(
                prepare_data_for_db({
                    "partner_id": partner_id,
                    "text": text
                })
            ).inserted_id
        )

class CompletedPartnerTask:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, partner_id, user_id, status, created_at):
        return prepare_data_for_client(
            self.mongo.db.completed_partner_tasks.insert_one(
                prepare_data_for_db({
                    "partner_id": partner_id,
                    "user_id": user_id,
                    "status": status,
                    "created_at": created_at
                })
            ).inserted_id
        )

class Code:
    def __init__(self, mongo):
        self.mongo = mongo

    def create(self, user_id, verify_code, created_at):
        self.mongo.db.codes.delete_many({
            "user_id": prepare_data_for_db(user_id)
        })
        return prepare_data_for_client(
            self.mongo.db.codes.insert_one(
                prepare_data_for_db({
                    "user_id": user_id,
                    "verify_code": verify_code,
                    "created_at": created_at
                })
            ).inserted_id
        )

    def update(self, id, data):
        self.mongo.db.codes.update_one({"_id": prepare_data_for_db(id)}, data)
    
    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.codes.find_one(prepare_data_for_db(data))
        )

    def remove(self, data):
        self.mongo.db.codes.delete_many(prepare_data_for_db(data))

class Database:
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.user = User(self.mongo)
        self.hamster = Hamster(self.mongo)
        self.energy = Energy(self.mongo)
        self.generation = Generation(self.mongo)
        self.game = Game(self.mongo)
        self.deck = Deck(self.mongo)
        self.card = Card(self.mongo)
        self.boost = Boost(self.mongo)
        self.user_boost = UserBoost(self.mongo)
        self.partner = Partner(self.mongo)
        self.task = Task(self.mongo)
        self.completed_partner_task = CompletedPartnerTask(self.mongo)
        self.code = Code(self.mongo)