# PHP + Next.js Static Site Deployment

This project combines a PHP backend with a static frontend built using Next.js. The PHP code resides in the `deploy/` directory, and the Next.js frontend source is located in the `frontend/` directory.

## Project Structure

```
.
├── deploy/       # PHP backend and built frontend output
├── frontend/     # Next.js static site source code
├── schema.sql    # Schema used to create the database
└── README.md
```

## Build and Deploy Instructions

### 1. Build the Next.js Static Site

Navigate to the `frontend/` directory and build the static site using [Bun](https://bun.sh/):

```bash
cd frontend/
bunx next build
```

> The exported static site will be output to the `frontend/out/` directory.

### 2. Copy Static Site to PHP Deployment Directory

Copy the contents of the built site into the `deploy/` directory alongside your PHP files:

```bash
cp -r out/* ../deploy/
```

### 3. Deploy to Apache Web Server

Copy the entire contents of the `deploy/` directory to your Apache document root (`/var/www/html/`):

```bash
sudo cp -r ../deploy/* /var/www/html/
```

Ensure Apache has permission to serve these files and restart Apache if needed:

```bash
sudo systemctl restart apache2
```

---

## PHP Backend Environment Configuration

When running the PHP backend, ensure the following environment variables are set:

* `TOKEN_KEY` – Secret key used for token signing (e.g., JWT)
* `DBHOST` – Hostname or IP address of your MySQL server
* `DBNAME` – Name of your MySQL database
* `DBUSER` – MySQL username
* `DBPASSWORD` – Password for the above user

You can set these using a `.env` file (if your project supports it), or by exporting them in the shell before starting your PHP server:

```bash
export TOKEN_KEY=your_secret_key
export DBHOST=localhost
export DBNAME=my_database
export DBUSER=my_user
export DBPASSWORD=my_password
```

Alternatively, configure these in your Apache virtual host or PHP-FPM pool configuration, depending on your setup.

---

## Notes

* Make sure your Apache server has PHP and required extensions (e.g., `pdo_mysql`) installed and enabled.
* If you use `.htaccess` for routing or security, include it in the `deploy/` directory before copying to the server.
* Always ensure permissions and ownership of `/var/www/html/` match your web server user (typically `www-data`).