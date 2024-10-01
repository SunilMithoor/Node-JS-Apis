# Sample api using Node and Express Js.

<!-- create .env file add these fields -->

<!-- environment -->
NODE_ENV = development
<!-- NODE_ENV = stage -->
<!-- NODE_ENV = production -->

<!-- cookie -->
COOKIE_SESSION_NAME = session name
COOKIE_SESSION_SECRET = secret

<!-- database -->
<!-- development -->
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = password@123
DATABASE = app_db
DB_PORT = 3001

<!-- stage -->
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = password@123
DATABASE = app_db
DB_PORT = 3001

<!-- production -->
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = password@123
DATABASE = app_db
DB_PORT = 3001

<!-- jwt -->
JWT_SECRET_KEY = secret_key
JWT_EXPIRE = 1d
JWT_ALGORITHM = HS256

<!-- firebase datastore -->
<!-- add your firebase details -->
FIREBASE_API_KEY = 
FIREBASE_AUTH_DOMAIN = 
FIREBASE_PROJECT_ID = 
FIREBASE_STORAGE_BUCKET = 
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

<!-- firebase service account -->
<!-- create firebase folder and create serviceAccountkey.json file and add your account json data. -->
FIREBASE_SERVICE_ACCOUNT_CREDENTIALS=firebase/serviceAccountkey.json
