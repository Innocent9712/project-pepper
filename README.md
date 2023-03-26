# project-pepper

## **For Devs**
run npm install

Make sure mysql is installed locally or remotely on port 3306 and you have a user login credential.

Then create db if it doesn't exist yet by running
./createdb.sh -h <mysql_host> -u <mysql_user> --password <mysql_password>

from the root of the project

copy the .env.example int .env and update the different values
where johndoe = username and randompassword = password

if there are no migration files, run `npx prisma migrate dev` to create the migration files

if there are migration files, run `npx prisma migrate deploy` to apply the migration files

run `npx prisma db push` to create the tables
and `npx prisma db seed` to seed the db with some data

run `npm run dev` to start the server in dev mode

run `npm run build` to build the server

run `npm run start` to start the server in prod mode

## Console Usage

To use the console, ensure you have python venv installed.

run `python3 -m venv venv` to create a virtual environment

then run `source venv/bin/activate` to activate the virtual environment

then run `pip install -r requirements.txt` to install the dependencies

then run `python console.py` to start the console for local API server
or `API=<API url> PORT=<port> python console.py` to start the console for remote API server

### Docs

visit http://localhost:5000/docs to see the documentation

## **For General Use**

You can checkout the deployed API on [pepper.codekami.tech](pepper.codekami.tech)


### Deploying in Production
clone the codebase in a docker enabled environment.

cd into the codebase root directory.

copy **.env.prod.example** to **.env.prod** and make necessary changes to the placeholder values

run `docker compose --env-file .env.prod up -d` to start the server in production mode

run `docker-compose --env-file .env.prod down` to stop the server

run `docker-compose --env-file.env.prod logs -f` to see the logs of the server

run `docker exec -it  project-pepper-app-1 npx prisma db seed` to seed the db with some required data

And you're all set to go. Your deployed API can now be accessed at `http://<host>/api/v1`
