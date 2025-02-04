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
def searchCards():
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
        })

    return jsonify({'cards': min_attribute_cards})

# add card to user entity 
@app.route('/add', methods=['GET','POST'])
def addCard():
    query = request.get_json()
    cardValue = query.get('cardValue', '')
    id, name, image = cardValue # destructure

    whichlist = query.get('whichList', '')

    start_db.add_card(cardValue[id], cardValue[name], cardValue[image], whichlist)

    return jsonify({'msg':'added to database'})

# get cards
@app.route('/getCard')
def getCard():
    unformatted_collection_cards, unformatted_wishlist_cards = start_db.pull_cards()
    collection_cards = []
    wishlist_cards = []

    for card in unformatted_collection_cards:
        collection_cards.append({
            "id": card[0],
            "name": card[1],
            "image": card[2],
        })
        print(card)
    
    for card in unformatted_wishlist_cards:
        wishlist_cards.append({
            "id": card[0],
            "name": card[1],
            "image": card[2],
        })
        print("wishlist")
        print(card)

    return jsonify({"collection": collection_cards, 
                    "wishlist": wishlist_cards})

# delete card
@app.route('/remove', methods = ['GET', 'POST'])
def remove():
    query = request.get_json()
    cardValue = query.get('cardValue', '')
    id, _, _ = cardValue # destructure -> ignore everything except id

    print("Cardvalue = " + cardValue[id])

    try:
        start_db.remove_card(cardValue[id])
        print('removed')
        return 'card removed successfully'
    except Exception as e:
        print(e)

        return 'error in removing card'

# set default card
@app.route('/')
def main():
    cards = Card.find('sv8-203')

    return jsonify({'imgURL': cards.images.large})

if __name__ == '__main__':
    app.run(debug = True, port = 8000) # switch port b/c mac alr uses 5000