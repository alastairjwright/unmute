Server Build
============
Basic web server build.

Packages
--------
Leave out MySQL related packages if not needed.  Use version suffix where needed, for example, `yum install php54`.

* `yum install gcc make nginx php-fpm`
* `yum install php-gd php-mbstring php-cli php-devel php-mcrypt php-pecl-apc pcre-devel php-xml php-dom php-xmlrpc`
* `yum install mysql-server mysql`
* `yum install php-pdo php-mysql`

MySQL
-----
Start the MySQL service, then add it to service management and double check it's on the list.

* `service mysqld start`
* `chkconfig mysqld on`
* `chkconfig mysqld --list`

Finish setup `mysql_secure_installation`.

**Quick setup of a database and user:**

* `create database dbname;`
* `grant all privileges on dbname.* to 'user'@'localhost' identified by 'password';`

PHP
---
Edit `/etc/php.ini`:

* Uncomment and set `date.timezone = America/New_York`

PHP-FPM
-------
Start the PHP-FPM service, then add it to service management and double check it's on the list.

* `service php-fpm start`
* `chkconfig php-fpm on`
* `chkconfig php-fpm --list`

Nginx
-----
Add configuration files in /etc/nginx/conf.d/<a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/example.com.conf">example.com.conf</a> and setup necessary configurations for things like password protection, Magento parameters, redirects, etc...

Start the Nginx service, then add it to service management and double check it's on the list.

* `service nginx start`
* `chkconfig nginx on`
* `chkconfig nginx --list`

SSL
---
If SSL is needed, create a directory `/etc/nginx/ssl/` and name files example.com.csr, example.com.key, and example.com.crt.

Make sure proper values are set for hostname (www or non-www consistency), Country Code, State, City, Organization, Unit (or use default IS).

* `openssl req -new -newkey rsa:2048 -nodes -out example.com.csr -keyout example.com.key -subj "/C=US/ST=New York/L=Brooklyn/O=Domani/OU=IS/CN=example.com"`

GoDaddy will usually give you two files in your download, some_unique_id.crt and ga_bundle.crt.  Create a single crt file from these.

* `cat some_unique_id.crt > example.com.crt && cat ga_bundle.crt >> example.com.crt`

Upload example.com.crt to `/etc/nginx/ssl/`.  Uncomment SSL related lines for both servers in <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/example.com.conf">example.com.conf</a>.

Fail2Ban
--------

Install fail2ban with `yum install fail2ban`.  Copy the `jail.conf` file to `jail.local` `cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local`.

Edit `/etc/fail2ban/jail.local`: add the Domani IP to the `ignoreip` variable: `ignoreip = 127.0.0.1/8 38.117.157.146`. Add the get and post rules to the end of the file

	[http-get-dos]
	enabled = true
	port = http,https
	filter = http-get-dos
	logpath = /var/www/logs/access_log
	maxretry = 150
	findtime = 60
	bantime = 600
	action = iptables[name=HTTP, port=http, protocol=tcp]

	[http-post-dos]
	enabled = true
	port = http,https
	filter = http-post-dos
	logpath = /var/www/logs/access_log
	maxretry = 50
	findtime = 60
	bantime = 1800
	action = iptables[name=HTTP, port=http, protocol=tcp]

Add two new files to `/etc/fail2ban/filter.d/`, <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/http-get-dos.conf">http-get-dos.conf</a> and <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/http-post-dos.conf">http-post-dos.conf</a>.

Start the fail2ban service, then add it to service management and double check it's on the list.

* `service fail2ban start`
* `chkconfig fail2ban on`
* `chkconfig fail2ban --list`

Log Rotation
------------

Default should be fine, but it's good to double check the paths in the appropriate conf file for nginx or apache (`/etc/logrotate.d/`).

Basic Authentication
--------------------

Use `htpasswd` to create a flat file for usernames and passwords.  Make sure paths are correct to the `.htpasswd` file.

* `htpasswd -bc /var/www/.htpasswd some_user some_pass`

In Nginx check the <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/example.com.conf">example.com.conf</a> for the basic auth comment.

In Apache use `.htaccess`:

	AuthType Basic
	AuthName "Restricted Files"
	AuthUserFile /var/www/.htpasswd
	Require user some_user

Redis
-----

Before installing see if redis and php-redis are installed:

* `redis-cli ping` will return `PONG`
* `php -m | grep redis` will return `redis`

Check for redis in yum first and install from there if possible `yum search redis`.  At this time the only thing available is the redis php extension.

* `cd ~`
* `wget http://download.redis.io/redis-stable.tar.gz`
* `tar xzf redis-stable.tar.gz`
* `cd redis-stable`
* `make distclean`
* `make`
* `make test` - if you get a tickle warning - `yum install tcl` and re-run `make test`
* `mkdir /etc/redis /var/lib/redis /var/log/redis`
* `cp src/redis-server src/redis-cli /usr/bin`
* `cp redis.conf sentinel.conf /etc/redis`
* `vi /etc/redis/redis.conf`
	* `daemonize yes`
	* `bind 127.0.0.1`
	* `dir /var/lib/redis/`
	* `loglevel notice`
	* `logfile /var/log/redis/redis.log`
* Upload <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/redis-server">redis-server</a> file to /etc/init.d
* `chmod 755 /etc/init.d/redis-server`
* `chkconfig --level 345 redis-server on`
* `service redis-server start`
* `cd ~ && rm -rf redis-stable.tar.gz redis-stable`

**Install redis php extension**

Check yum for corresponding php version, if it's not there, you'll have to use PECL.

Using PECL:

* `pecl install redis`
* update /etc/php.ini and add `extension=redis.so`
* `service php-fpm restart`

**Magento**

Used this site for configuration and setup - <a href="http://inchoo.net/magento/using-redis-cache-backend-and-session-storage-in-magento/" target="_blank">http://inchoo.net/magento/using-redis-cache-backend-and-session-storage-in-magento/</a>.  Basically a cron is recommended for backend and FPC.

Cron Setup - <a href="https://github.com/samm-git/cm_redis_tools" target="_blank">https://github.com/samm-git/cm_redis_tools</a>

* `git clone https://github.com/samm-git/cm_redis_tools.git`
* `cd cm_redis_tools`
* `git submodule update --init --recursive`
* Remove all git related files, .git, .gitignore, .gitmodule, etc...
* Upload to server outside of html
* `crontab -e` and set `0 0 * * * /usr/bin/php /path/to/cm_redis_tools/rediscli.php -s 127.0.0.1 -p 6379 -d 0,1`

Local XML

	<cache>
		<backend>Mage_Cache_Backend_Redis</backend>
			<backend_options>
			<server>127.0.0.1</server>
			<port>6379</port>
			<persistent></persistent>
			<database>0</database>
			<password></password>
			<force_standalone>0</force_standalone>
			<connect_retries>1</connect_retries>
			<read_timeout>10</read_timeout>
			<automatic_cleaning_factor>0</automatic_cleaning_factor>
			<compress_data>1</compress_data>
			<compress_tags>1</compress_tags>
			<compress_threshold>20480</compress_threshold>
			<compression_lib>gzip</compression_lib>
		</backend_options>
	</cache>

	<full_page_cache>
		<backend>Mage_Cache_Backend_Redis</backend>
		<backend_options>
			<server>127.0.0.1</server>
			<port>6379</port>
			<persistent></persistent>
			<database>1</database>
			<password></password>
			<force_standalone>0</force_standalone>
			<connect_retries>1</connect_retries>
			<lifetimelimit>57600</lifetimelimit>
			<compress_data>0</compress_data>
		</backend_options>
	</full_page_cache>

	<session_save><![CDATA[db]]></session_save>

	<redis_session>
		<host>127.0.0.1</host>
		<port>6379</port>
		<password></password>
		<timeout>2.5</timeout>
		<persistent></persistent>
		<db>2</db>
		<compression_threshold>2048</compression_threshold>
		<compression_lib>gzip</compression_lib>
		<log_level>4</log_level>
		<max_concurrency>6</max_concurrency>
		<break_after_frontend>5</break_after_frontend>
		<break_after_adminhtml>30</break_after_adminhtml>
		<bot_lifetime>7200</bot_lifetime>
	</redis_session>