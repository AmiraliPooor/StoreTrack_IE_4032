###### THE STORETRACK PROJECT #########

### REPO_URL = https://github.com/AmiraliPooor/StoreTrack_IE_4032.git #####

###### THE FRONTEND OF THIS PROJECT WAS DEVELOPED USING REACT.JS AND THE BACKEND IS DEVELOPED USING NODE.JS + PRISMA ORM #####

###### THESE ARE THE STEPS TO FULLY RUN THE PROJECT #######

1. Install Node.js (includes npm)

# For Linux (Debian/Ubuntu)
sudo apt update
sudo apt install -y nodejs npm

# For macOS (using Homebrew)
brew install node

# For Windows
# Download and install from: https://nodejs.org

Check version:
node -v
npm -v

2. Install Yarn (optional but recommended)

# Using npm
npm install --global yarn

Check version:  
yarn -v

3. Install Git
# For Linux (Debian/Ubuntu)
sudo apt install -y git

# For macOS
brew install git

# For Windows
# Download from: https://git-scm.com/downloads


Check version:  
git --version

Install PostgreSQL

# For Linux (Debian/Ubuntu)
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# For macOS
brew install postgresql

# For Windows
# Download from: https://www.postgresql.org/download/windows/

Start PostgreSQL service:

# Linux
sudo service postgresql start

# macOS
brew services start postgresql

Check version:
psql --version

Create a database (replace mydb and myuser as needed):
sudo -u postgres psql
CREATE DATABASE mydb;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\q

5. Install Prisma CLI

npm install -g prisma

Check version:
prisma -v


############# Project Setup (Local, No Docker) ########################
1. clone the porject:

git clone https://github.com/AmiraliPooor/StoreTrack_IE_4032.git

2. setup backend:

cd backend
npm install


3. Create .env file

Inside backend/, create a file named .env with your database URL:
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

Run database migrations

npx prisma migrate dev --name init

4. Start backend server:
npm run dev

Backend should now run at: http://localhost:5000 (or whatever port you use)



5. Setup Frontend

cd ..
npm install
npm run dev

Frontend should now run at: http://localhost:3000



#### SCREENSHOTS FROM THE PROJECT ####

The screen shots can be viewed at this google drive folder:

https://drive.google.com/drive/folders/1UhvjyFpNCPgiKMw-mNm9n2nT9qV5H0MV?usp=sharing







