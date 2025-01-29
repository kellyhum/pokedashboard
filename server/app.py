from flask import Flask, jsonify, request
from flask_cors import CORS
from pokemontcgsdk import Card, RestClient
import os
from dotenv import load_dotenv
import start_db

load_dotenv()

app = Flask(__name__)
CORS(app)

RestClient.configure(os.getenv('POKEMONTCG_IO_API_KEY'))

# ROUTES
# search cards
@app.route('/search', methods=['GET','POST'])
def search():
    query = request.get_json()
    data = query.get('query', '') # get the query otherwise default to empty
    
    cards = Card.where(q=f'name:{data}*')

    min_attribute_cards = []
    
    # select certain attributes
    for card in cards:
        min_attribute_cards.append({
            "id": card.id,
            "name": card.name,
            "image": card.images.large,
            "price": card.tcgplayer
        })

    return jsonify({'cards': min_attribute_cards})

# add card to user entity 
@app.route('/add', methods=['GET','POST'])
def addCardtoDB():
    query = request.get_json()
    cardValue = query.get('cardValue', '')
    id, name, image, _ = cardValue # destructure while ignoring price
    # print(cardValue[id])

    start_db.add_card(cardValue[id], cardValue[name], cardValue[image])

    return jsonify({'msg':'added to database'})

# get cards
@app.route('/getCard')
def getCardfromDB():
    cards = start_db.pull_cards()
    formatted_cards = []

    for card in cards:
        formatted_cards.append({
            "id": card[0],
            "name": card[1],
            "image": card[2],
        })
        print(card)

    return jsonify({"cards": formatted_cards})

# delete card

# set default card
@app.route('/')
def main():
    cards = Card.find('sv8-203')

    return jsonify({'imgURL': cards.images.large})

if __name__ == '__main__':
    app.run(debug = True, port = 8000) # switch port b/c mac alr uses 5000