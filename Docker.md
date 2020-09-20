Docker Setup
------------
The application needs all the environment variables set at build time, since they're built into the final javascript. Due to this, no golden image can be easily provided on DockerHub. The application can be built with ```docker-compose up --build``` or with ```docker build .```


CouchDB Setup
-------------
CouchDB needs some manual setup after being started with docker. The setup page can be found at ```http://<server>:5984/_utils#setup```. This can be used to do the initial setup for a clustered approach or for a single node.

After the initial setup is done, navigate to the configuration page (the gear icon in the sidebar) and go to the CORS section. CORS needs to be enabled, and for the most basic setup, set to allow requests from all domains (though it is less secure).

Starting
--------
Pull the GIT repository for TinyList. Update the docker-compose.yml file with the values for your setup:

**TinyList Environment:**
  * DB_URL: the public IP/port for the database, this cannot be a docker container only link since your client will need to access it. A fully qualified domain name would be best for outside connections (like a smartphone).
  * DB_PORT: the port for the database (the port being forwarded out of your network or docker host if you're running internally)
  * DB_USER: username for the database user
  * DB_PASS: password for the database user
  * CREATE_DB_URL: This is just the full url to the database

**CouchDB Environment**
  * COUCHDB_USER: Admin user for couchdb
  * COUCHDB_PASSWORD: Admin password for couchdb
  
Setup your CouchDB volumes to ensure data is kept through container rebuilds, and forward all the ports needed. TinyList runs on nginx in its container, but only HTTP is currently setup through it at the moment.
