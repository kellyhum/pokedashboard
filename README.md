# pokedash

A way to track your card collection, add to a wishlist, and get recommendations

## Tech Stack:
- Frontend: Typescript, React, shadcn
- Backend: Flask
- Database: PostgresSQL

## MVP Features:
- [X] Add card to collection
- [X] Add card to wishlist
- [X] Delete cards from collection
- [X] Delete cards from wishlist

## Currently Implementing:
- [ ] User authentication w/ hashing
- [ ] Getting recommendations working
- [ ] Offline sync via service workers -> converting to a PWA
- [ ] Fix the deployment

## Prerequisites
- Node.js
- npm or yarn

## Installation
1. Clone the repo
``` 
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

2. Install client and server dependencies
 ```
cd client
npm install  # or yarn install

cd server
npm install  # or yarn install
 ```
3. Add the .env file to the server
```
cd server
touch .env
```
Add your environment variables: the PokemonTCG API and the SQL Database password.
```
POKEMONTCG_IO_API_KEY = your api key
SQL_PASSWORD = your password
```
   
5. Run client and server
```
cd client
npm run dev

cd server
python app.py
```
   
