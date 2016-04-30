Readme

Purpose

This project is a simple web-coding interface for reddit threads. It was built with a very short lead-time to support research, and thus should be considered extremely pre-alpha. (This means it's hideous, both in terms of appearance and very likely programming design. )


Development deployment

1. Create virtualenv
	a. Using virtualenvhelper, type `mkvirtualenv reddit_coding`
2. Install required python packages. For development environment, this means: ```pip install -r requirements/dev.txt``` . If you get errors in this step, make sure your system is set up with all the required system packages. 
3. Create a `dev.py` file in `reddit_coding/settings/`
	a. The first line should be: ```from base import *```
	b. Add custom settings for dev environment in here. These include
		i. SECRET_KEY
		ii. DEBUG = TRUE
		iii. DATABASES = { ... }
	   You can generate a new secret key with a oneliner like this: 
	   	```python -c "import random,string;print 'SECRET_KEY=\"%s\"'%''.join([random.SystemRandom().choice(\"{}{}{}\".format(string.ascii_letters, string.digits, string.punctuation)) for i in range(63)])"

4. Add this environment to the `postactivate` file in your virtual env. If your virtualenv is active, you can find the file in the same directory as the python binary using `which python`. It's probably something like `~/envs/reddit_coding/bin/postactivate`. The line should be ```export DJANGO_SETTINGS_MODULE="reddit_coding.settings.dev"```. After you do this, you'll need to reactivate your virtualenv by typing `deactivate` and `workong reddit_coding` again. 
5. Install node, bower, and gulp.
	a. On Ubuntu type, follow [these instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions). Also, you'll probably want to also install nodejs-legacy. ```sudo apt-get install nodejs-legacy``` so that the symlink to `node` is installed.
	b. Install bower. ```sudo npm install -g bower```
	c. Install gulp. ```sudo npm install -g gulp```
5. Install all the bower files. ```bower install```
6. Use gulp to copy distribution files over. ```gulp```



Resuming work

1. Activate the virtualenv. Type `workon reddit_coding`
2. `cd` into project directory
3. 