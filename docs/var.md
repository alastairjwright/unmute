Environment Variables
---------------------

Environment variables are set in server configuration files.

* 0 - Production
* 1 - Staging
* 2 - Development
* 3 - Local

###Accessing Variables

`<?php define('ENVIRONMENT',getenv('ENVIRONMENT')); ?>`

`ENVIRONMENT` should be used as a constant for any conditional logic throughout the application.

###Setting Variables

**.htaccess**

`SetEnv ENVIRONMENT 0`

**nginx conf**

Check the <a href="https://domani.beanstalkapp.com/ds-bootstrap-repository/browse/git/docs/server/example.com.conf">example.com.conf</a> for more information.

	location ~ \.php$
	{
		# Domani Environment Variable
		fastcgi_param ENVIRONMENT 0;
	}