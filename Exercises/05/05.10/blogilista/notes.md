# Notes

Init new project

  npm init

Install dependencies

  npm install <PACKAGE>

Install dev dependencies

  npm install <PACKAGE> --save-dev

Start local mongo container

  docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=<USERNAME> -e MONGO_INITDB_ROOT_PASSWORD=<PASSWORD> --name <NAME> mongo:latest