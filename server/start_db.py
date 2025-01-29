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
            
            cur.execute("INSERT INTO users (id, username) VALUES (%s, %s) ON CONFLICT DO NOTHING", ('g123', 'Guest')) # %s = param of string type
            cur.execute("INSERT INTO cards (id, pokeName, img) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING", ('c123', 'Pikachu', 'testurl'))
            cur.execute("INSERT INTO user_cards (user_id, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING", ('g123', 'c123'))

            cur.execute("SELECT * FROM user_cards")
            print(cur.fetchall())

            conn.commit() # persist in db

def add_card(id, name, image):
    with connectToDB() as conn:
        with conn.cursor() as cur:
            cur.execute("""INSERT INTO cards (id, pokeName, img) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING""", (id, name, image))
            cur.execute("""INSERT INTO user_cards (user_id, card_id) VALUES (%s, %s) ON CONFLICT DO NOTHING""", ('g123', id))
            
            cur.execute("SELECT * FROM user_cards")
            print(cur.fetchall())

            conn.commit()

def pull_cards():
    with connectToDB() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, pokeName, img FROM cards")

            return cur.fetchall()

