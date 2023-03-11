# project-pepper
We'll get back to this


run npm install

Make sure mysql is installed locally or remotely on port 3306 and you have a user login credential.

Then create db if it doesn't exist yest by running
./createdb.sh -h <mysql_host> -u <mysql_user> --password <mysql_password>

from the root of the project

copy the .env.example int .env and update the different values
where johndoe = username and randompassword = password

run `npx prisma db push` to create the tables
and `npx prisma db seed` to seed the db with some data

run `npm run start-server` to start the server in dev mode
