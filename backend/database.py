from flask_pymongo import PyMongo
from utils import prepare_data_for_client, prepare_data_for_db

class Settings:
    def __init__(self, mongo):
        self.mongo = mongo
        if not self.is_exists():
            self.mongo.db.settings.insert_one(
                prepare_data_for_db({
                    "max_energy_limit": 10,
                    "min_energy_limit": 3,
                    "max_energy_minutes": 12,
                    "min_energy_minutes": 5,
                    "default_energy_limit": 3,
                    "default_energy_minutes": 12,
                    "default_energy_value": 3
                }
            ))

    def create(self, max_energy_limit, min_energy_limit, max_energy_minutes, min_energy_minutes, default_energy_limit, default_energy_minutes, default_energy_value):
        if not self.is_exists(self):
            return prepare_data_for_client(
                self.mongo.db.settings.insert_one(
                    prepare_data_for_db({
                        "max_energy_limit": max_energy_limit,
                        "min_energy_limit": min_energy_limit,
                        "max_energy_minutes": max_energy_minutes,
                        "min_energy_minutes": min_energy_minutes,
                        "default_energy_limit": default_energy_limit,
                        "default_energy_minutes": default_energy_minutes,
                        "default_energy_value": default_energy_value,
                    }
                )).inserted_id
            )

    def update(self, id, data):
        self.mongo.db.settings.update_one({"_id": prepare_data_for_db(id)}, data)
    
    def is_exists(self):
        if self.mongo.db.settings.find_one({}):
            return True
        else:
            return False
    
    def get(self):
        return prepare_data_for_client(
            self.mongo.db.settings.find_one({})
        )

class Jackpot:
    def __init__(self, mongo):
        self.mongo = mongo
        if not self.is_exists():
            self.mongo.db.jackpots.insert_one(
                prepare_data_for_db({
                    "link_to_stream": "",
                    "balance": 100000000
                }
            ))

    def update(self, id, data):
        self.mongo.db.jackpots.update_one({"_id": prepare_data_for_db(id)}, data)
    
    def is_exists(self):
        if self.mongo.db.jackpots.find_one({}):
            return True
        else:
            return False
    
    def get(self):
        return prepare_data_for_client(
            self.mongo.db.jackpots.find_one({})
        )

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

    def search(self, data, sort=None):
        return prepare_data_for_client(
            list(self.mongo.db.users.find(prepare_data_for_db(data)).sort(sort, -1))
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

    def create(self, energy_id, end_at, created_at):
        return prepare_data_for_client(
            self.mongo.db.generations.insert_one(
                prepare_data_for_db({
                    "energy_id": energy_id,
                    "end_at": end_at,
                    "created_at": created_at,
                    "ended": False
                })
            ).inserted_id
        )

    def update(self, id, data):
        self.mongo.db.generations.update_one({"_id": prepare_data_for_db(id)}, data)

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
                    "selected_card":  selected_card
                })
            ).inserted_id
        )

class Card:
    def __init__(self, mongo):
        self.mongo = mongo
        if not self.is_exists({}):
            self.mongo.db.cards.insert_many([
                prepare_data_for_db({
                    "sprite": "/cards/card-front1.png",
                    "chance": 0.6,
                    "name": "empty"
                }),
                prepare_data_for_db({
                    "sprite": "/cards/card-front2.png",
                    "chance": 0.3,
                    "name": "game_balance_up:10000"
                }),
                prepare_data_for_db({
                    "sprite": "/cards/card-front3.png",
                    "chance": 0.1,
                    "name": "jackpot:1.5%"
                }),
            ])

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

    def is_exists(self, data):
        if self.mongo.db.cards.find_one(data):
            return True
        else:
            return False

    def search(self, data):
        return prepare_data_for_client(
            list(self.mongo.db.cards.find(prepare_data_for_db(data)))
        )

class Boost:
    def __init__(self, mongo):
        self.mongo = mongo
        if not self.is_exists({}):
            self.mongo.db.boosts.insert_many([
                prepare_data_for_db({
                    "price": 100,
                    "name": "limit:+1"
                }),
                prepare_data_for_db({
                    "price": 100,
                    "name": "minutes:-1"
                })
            ])

    def create(self, price, name):
        return prepare_data_for_client(
            self.mongo.db.boosts.insert_one(
                prepare_data_for_db({
                    "price": price,
                    "name": name
                })
            ).inserted_id
        )
    
    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.boosts.find_one(prepare_data_for_db(data))
        )

    def search(self, data):
        return prepare_data_for_client(
            list(self.mongo.db.boosts.find(prepare_data_for_db(data)))
        )

    def is_exists(self, data):
        if self.mongo.db.boosts.find_one(data):
            return True
        else:
            return False

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
        if not self.is_exists({}):
            self.mongo.db.partners.insert_many(
                prepare_data_for_db(
                    [
                        {
                            "icon": "/partners/HAMC2.svg",
                            "name": "HOH Game",
                            "description": "Играйте и выигрывайте $HAMC или $HOH",
                            "price": 4
                        }
                    ]
                )
            )

    def create(self, icon, name, description, price):
        return prepare_data_for_client(
            self.mongo.db.partners.insert_one(
                prepare_data_for_db({
                    "icon": icon,
                    "name": name,
                    "description": description,
                    "price": price
                })
            ).inserted_id
        )

    def is_exists(self, data):
        if self.mongo.db.partners.find_one(data):
            return True
        else:
            return False

    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.partners.find_one(prepare_data_for_db(data))
        )

    def search(self, data):
        return prepare_data_for_client(
            list(self.mongo.db.partners.find(prepare_data_for_db(data)))
        )

class Task:
    def __init__(self, mongo):
        self.mongo = mongo
        if not self.is_exists({}):
            self.mongo.db.tasks.insert_many(
                prepare_data_for_db(
                    [
                        {
                            "partner_id": self.mongo.db.partners.find_one({})["_id"],
                            "name": "HOH Game",
                            "description": "Follow in Telegram",
                            "upload": False,
                            "link": "https://t.me/botFather"
                        },
                        {
                            "partner_id": self.mongo.db.partners.find_one({})["_id"],
                            "name": "Upload Screenshots",
                            "description": "Загрузите до 10 скриншотов подтверждающие выполненное задание",
                            "upload": True,
                            "link": ""
                        }
                    ]
                )
            )

    def create(self, partner_id, name, description, upload, link):
        return prepare_data_for_client(
            self.mongo.db.tasks.insert_one(
                prepare_data_for_db({
                    "partner_id": partner_id,
                    "name": name,
                    "description": description,
                    "upload": upload,
                    "link": link
                })
            ).inserted_id
        )
    
    def is_exists(self, data):
        if self.mongo.db.tasks.find_one(data):
            return True
        else:
            return False

    def get(self, data):
        return prepare_data_for_client(
            self.mongo.db.tasks.find_one(prepare_data_for_db(data))
        )

    def search(self, data):
        return prepare_data_for_client(
            list(self.mongo.db.tasks.find(prepare_data_for_db(data)))
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
        self.settings = Settings(self.mongo)
        self.jackpot = Jackpot(self.mongo)
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

