import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

DB_URL = f'dbname=pokemon user=postgres password={os.getenv('SQL_PASSWORD')}'

def connectToDB():
    return psycopg.connect(DB_URL)

# already ran this once, just for initial setup 
def setup():
    with connectToDB() as conn:
        with conn.cursor() as cur:
            # cur.execute(open('db.sql', 'r').read())
            # cur.execute("CREATE EXTENSION pgcrypto") # whoops already exists -> make sure to use it though!

            cur.execute("SELECT gen_salt('md5')") # use the md5 algorithm for salt

            cur.execute("""
                CREATE TABLE IF NOT EXISTS cards(
                    id VARCHAR(200) PRIMARY KEY,
                    pokeName VARCHAR(200),
                    img VARCHAR(200)
            )""")
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users(
                    id VARCHAR(200) PRIMARY KEY,
                    username VARCHAR(200) UNIQUE,
                    email VARCHAR(200) UNIQUE
                )""")
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS user_cards (
                    user_id VARCHAR(200),
                    card_id VARCHAR(200),
                    PRIMARY KEY (user_id, card_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
                )
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS wishlist (
                    user_id VARCHAR(200),
                    card_id VARCHAR(200),
                    PRIMARY KEY (user_id, card_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
                )
            """)
            
            cur.execute("INSERT INTO users (id, username) VALUES (%s, %s) ON CONFLICT DO NOTHING", ('guest-mode', 'Guest')) # %s = param of string type

            # TESTING PURPOSES
            # cur.execute("INSERT INTO cards (id, pokeName, img) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING", ('c123', 'Pikachu', 'testurl'))
            # cur.execute("INSERT INTO user_cards (user_id, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", ('g123', 'c123'))

            # cur.execute("DELETE FROM users WHERE id = %s", ('g123',)) # %s = param of string type
            # cur.execute("DELETE FROM cards WHERE id = %s", ('c123',))
            # cur.execute("DELETE FROM user_cards WHERE user_id = %s", ('g123',))
            # cur.execute("DELETE FROM cards")

            cur.execute("SELECT * FROM user_cards")
            print(cur.fetchall())

            conn.commit() # persist in db

def add_card(id, name, image, list_name):
    with connectToDB() as conn:
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO cards (id, pokeName, img) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING""", (id, name, image))

            if list_name == 'collection':
                cur.execute("""INSERT INTO user_cards (user_id, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", ('guest-mode', id))
                cur.execute("SELECT * FROM user_cards")

            elif list_name == 'wishlist':
                cur.execute("""INSERT INTO wishlist (user_id, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", ('guest-mode', id))
                cur.execute("SELECT * FROM wishlist")

            print(cur.fetchall())

            conn.commit()

def remove_card(id):
    with connectToDB() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM cards WHERE id=%s",  (id,))
            cur.execute("DELETE FROM user_cards WHERE user_id=%s AND card_id=%s",  ("guest-mode", id,)) 

            cur.execute("SELECT * FROM user_cards")
            print(cur.fetchall())

            conn.commit()

def pull_cards():
    with connectToDB() as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT cards.id, cards.pokeName, cards.img 
                        FROM cards
                        JOIN user_cards ON user_cards.card_id = cards.id 
                        WHERE user_cards.user_id=%s
                        """, ('guest-mode',)) # use 'on' b/c diff attribute names
        
            collection_cards = cur.fetchall()

            cur.execute("""SELECT cards.id, cards.pokeName, cards.img 
                        FROM cards
                        JOIN wishlist ON wishlist.card_id = cards.id 
                        WHERE wishlist.user_id=%s
                        """, ('guest-mode',)) # use 'on' b/c diff attribute names

            wishlist_cards = cur.fetchall()

            return collection_cards, wishlist_cards

setup()