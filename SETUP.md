# Step 1: Initial Server Setup
1. Update and upgrade packages:
```bash
sudo apt update && sudo apt upgrade -y
```
2. Install necessary packages:
```bash
sudo apt install build-essential nginx curl git gnupg ca-certificates certbot python3-certbot-nginx -y
```

# Step 2: Install Node.js using nvm
1. Install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
2. Load nvm:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```
3. Install Node.js:
```bash
nvm install node
```
4. Verify installation:
```bash
node -v
npm -v
```

# Step 3: Install Docker
```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

# Step 4: Setup PostgreSQL
1. Create a new PostgreSQL container:
```bash
sudo docker run --name <postgres-container> -e POSTGRES_USER=<postgres-user> -e POSTGRES_PASSWORD=<postgres-password> -e POSTGRES_DB=<postgres-db> -d -p 5432:5432 --restart=on-failure postgres
```
2. Install Postgres Shell
```bash
sudo apt install postgresql -y
```
3. Postgres Connection String:
```bash
psql postgres://<postgres-user>:<postgres-password>@localhost:5432/<postgres-db>
```

# Step 5: Setup Next.js Application
1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```
2. Install dependencies:
```bash
npm install
```
3. Build the application:
```bash
npm run build
```
4. Start the application using PM2:
```bash
npm install pm2 -g
pm2 start npm --name "<app-domain>" -- start
```
5. Save the PM2 process list and startup script:
```bash
pm2 save
pm2 startup systemd
```
6. Copy the generated command from the output of pm2 startup systemd and run it. It looks something like this:
```bash
sudo env PATH=$PATH:/home/<your-user>/.nvm/versions/node/<node-version>/bin pm2 startup systemd -u <your-user> --hp /home/<your-user>
```

# Step 6: Setup Nginx Reverse Proxy for Next.js Application
1. Remove the default Nginx configuration:
```bash
sudo rm /etc/nginx/sites-enabled/default
```
2. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/<app-domain>
```
3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name <app-domain>;

    location / {
        proxy_pass http://localhost:<port>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
4. Create a symbolic link to enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/<app-domain> /etc/nginx/sites-enabled/
```
5. Test the Nginx configuration:
```bash
sudo nginx -t
```
6. Restart Nginx:
```bash
sudo systemctl restart nginx
```
7. Enable Nginx to start on boot:
```bash
sudo systemctl enable nginx
```

# Step 7: Secure domain with SSL certificate for Next.js Application
2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d <app-domain>
```
3. Verify SSL certificate renewal:
```bash
sudo certbot renew --dry-run
```
4. Test the Nginx configuration:
```bash
sudo nginx -t
```
5. Restart Nginx:
```bash
sudo systemctl restart nginx
```


# Step 8: Setup Jenkins
1. Install Jenkins:
```bash
sudo docker run --name myjenkins -d -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 --restart=on-failure jenkins/jenkins:lts-jdk17
```
2. Get the initial admin password:
```bash
sudo docker exec -it myjenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
3. Access Jenkins at `http://<server-ip>:8080` and enter the initial admin password.
4. Install suggested plugins and create an admin user.
5. Configure Jenkins and install the Blue Ocean plugin.

# Step 9: Setup Nginx Reverse Proxy for Jenkins
1. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/<jenkins-domain>
```
2. Add the following configuration:
```nginx
upstream jenkins {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name <jenkins-domain>;

    access_log /var/log/nginx/jenkins.access.log;
    error_log /var/log/nginx/jenkins.error.log;

    proxy_buffers 16 64k;
    proxy_buffer_size 128k;

    location / {
        proxy_pass http://jenkins;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_redirect off;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
3. Create a symbolic link to enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/<jenkins-domain> /etc/nginx/sites-enabled/
```
4. Test the Nginx configuration:
```bash
sudo nginx -t
```
5. Restart Nginx:
```bash
sudo systemctl restart nginx
```
6. Setup SSL for Jenkins domain:
```bash
sudo certbot --nginx -d <jenkins-domain>
```
7. Verify SSL certificate renewal:
```bash
sudo certbot renew --dry-run
```
8. Test the Nginx configuration:
```bash
sudo nginx -t
```
9. Restart Nginx:
```bash
sudo systemctl restart nginx
```
