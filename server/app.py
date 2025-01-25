from flask import Flask, jsonify
from flask_cors import CORS
from pokemontcgsdk import RestClient
import os
from dotenv import load_dotenv
from pokemontcgsdk import Card, Set

load_dotenv()

app = Flask(__name__)
CORS(app)

RestClient.configure(os.getenv('POKEMONTCG_IO_API_KEY'))

@app.route('/')
def main():
    # cards = Card.where(q='name:latios set.id:sv8 number:203')
    cards = Card.find('sv8-203')
    sets = Set.all()

    return jsonify({'imgURL': cards.images.large})

if __name__ == '__main__':
    app.run(debug = True, port = 8000) # switch port b/c mac alr uses 5000