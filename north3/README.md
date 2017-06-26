# Northen SK Project v3 (JS Workflow)

## Description
This project intends to rewrite the original Northern Project with JS workflow.

## User Needs Analysis
- Multi-variable analysis
- Play through different years

## Design
### UX
![](UX/north_ui.png)
### UML
* Color code:
	* Yellow: events
	* Blue: brokers
	* Green: classes
	* Dark Green: Major Classes in this project
* Original: https://www.dropbox.com/s/r0k3jywegoaydr2/north3_framework.xml?dl=0
	* Download the xml from my dropbox
	* Open it using http://draw.io
	* *Note*: I cannot think of any other convenient way of sharing this draw.io diagram. If you know there is, go ahead change this document with your desired setting to better facilitate our team's development.
* PNG:

![](UX/north_framework.png)

#### Philosophy
* `Node` is only for data and other purposes other than presentation. All its presentation should be exclusively implemented within its `LayerManager` object it's associated with.
* Include external js libraries into this project: first check if it is availalbe as a [npm plugin](https://www.npmjs.com/), if not then copy it to the `components\js` folder **and** put an underscore `_` in front of its name, e.g. `somelib.js` becomes `_somlib.js`;

### Setup Develop Environment
#### Recommended Editor
Previously I use Sublime but now I'ved turned to Atom. Both are free of charge but Atom is truly open source. Download Atom at [here](https://atom.io).
#### Compilation
* Install [GitHub Desktop](https://desktop.github.com/) (which comes with `git`)
* Install [`NodeJS`](https://nodejs.org/en/)
* Install `gulp`: `npm install -g gulp`
* Compiling
	* for debugging & development: `npm run compile`
	* for deployment: `npm run deploy`
* Font Glyphs
	* All glyphs are from fontello.com, benefit: cherry-picking what's necessary
	* To update fonts
		* throw `builds\components\fonts\config.json` inside the webpage of fontello.com
		* download the `zip` package and unzip it.
		* in the unzipped folder
			* copy all files in the `font` folder to `builds\components\fonts\`
			* copy `config.json` to `builds\components\fonts\`
			* copy `fontello.css`, `fontello-ie7.css`, `animation.css` to `builds\components\fonts\`
* Directory Setting
	* make sure `lib/cache/` directory is writable, all set 'writable' for all directories & files

		``` bash
		sudo find builds -type d -exec chmod 777 {} \;
		sudo find builds -type f -exec chmod 666 {} \;
		```

* DB Connection `/development/lib/connect.php`: 2 setup options:
	* on campus development (with PSQL DB Server on gistest.usask.ca)
	* off-campus development (with PSQL DB Server on my Mac Book Pro)
	  * alternative: remotely connect to gistest server (no need to change the connection parameters in `connect.php`)
	    * this will not work if the server doesn't allow itself to connect to its PSQL DB Server. To solve this problem, do this:
	    * Open `C:/Program Files/PostgreSQL/9.3/data/pg_hba.conf` as 'Administrator' and add a new rule `host    all             all             128.233.203.169/8        md5` before all `sspi` rules.
	    * Restart PSQL DB Server: `C:/Program Files/PostgreSQL/9.3/scripts/serverctl.vbs restart`
	* When the project is depolyed in a new dev environment, make sure all data tables exist (imported from gistest server) in this new server which also has `PostGIS` extension enabled ([`CREATE EXTENSION postgis;`](http://postgis.net/install/)).
	  * alternative: remotely connect to gistest's PSQL DB Server. (see above)
* PHP Setting:
	* on campus development (PHP on Lenovo server IP:10.80.90.92)
	* off-campus development (PHP on Mac Book Pro)
	    + **PHP Setup Guidelines**
	        + Check your PHP Version
	            - Your PHP Version should be >= PHP 5.6.26
	            + **How to get Latest PHP?**
	                - `curl -O http://us.php.net/distributions/php-5.6.26.tar.gz`
	                - `tar -xzvf php-5.6.26.tar.gz`
	                - `cd php-5.6.26/ext/pgsql/`
	                - `phpize`
	                - `./configure`
	                - `make`
	                - `sudo make install`
	                -  Now check your PHP Version `php --version`
	        + Update the `gulpfile.js`
	            + Type in the command `which php`
	                - Put that output into your bin under off-campus dev setup. For ex: `/usr/local/bin/php`
	            + Type `php -i | grep php.ini`
	                - Look for the line starting with `Loaded Configuration File => ...` and get that file path. For Example: `/usr/local/etc/php/5.6/php.ini` and paste in `ini: ...` under the off-campus dev in your `gulpfile.js`
	* When the project is deployed to a new dev environment, make sure PHP's PDO for PSQL is enabled.
	
	

## Historic Versions

- http://gistest.usask.ca/north (archived)
  - Not functioning any more, due to db tables dropped later in this project.

- http://gistest.usask.ca/north2 (archived)
  - Still functioning

- http://gistest.usask.ca/git/north (archived)
  - This is a rebuild from scratch since April 2016.
  - not maintained anymore
- http://gistest.usask.ca/north3 (current, active)
  - This is a reduild from scratch since Aug 16, 2016.

## Implementation
### `meta.js`
The file `meta.json`is used to define configurations for the online WebGIS framework to retrieve data from the db server and make charts for the front-end user consumption.

Note: Everytime `meta.js` is updated, follow these steps to actually see the update at the front-end:
- **backend**: a php call `%web_root%/north/lib/get_meta.php?f=meta&verb=update` is required to compile `lib/cache/meta.json` again.
  - if the editing is merely appending new variables, that's all you need to do at the server's end.
  - if previous variables are being changed in `meta.js` and they have been cached by the system (`.query` files generated), you need to:
    - delete their `.query` files manually, **or**
    - pass `arg=dump` to your update call: eg. `%web_root%/north/lib/get_meta.php?f=meta&verb=update&arg=dump`, note that this will delete all cached queries, not specific ones.
- **front-end**: front-end users need to delete all caches of our website from their browser. A version control can be implemented in the future to solve the front-end hassle.

This is `meta.js`'s syntax:

```js
/* content of meta.js */

{
	/* the config starts with the 'root' element */
  "id": "root",
  "children": [ {
		/* this is the spatial layer used to link with stats layers */
		"id": "config",
		"table2": "north_points_benben",
		"table2_id": "uid_join",
		"table2_fk": "uid_join",
		"table2_name": "place_and_region"
	},
	{
		"id": "lyr_var",
		"text":"Stats Layers",
    		"children":

			/* square brackets indicate that the root element of this config-
				uration is an array */
			[
				{ /* this is the the 1st child of the root element, it has
					children of its own */

					/* all elements has an unique id, required by the framework,
					    as long as each one is different that's fine */
					"id":"dwell",

					/* [text] defines the label shown in the tree-view nav panel,
						it should be human friendly */
					"text":"Dwelling",

					/* [type] can be 2 values, 'cat' will be rendered in the tree-
						view as folder (since it has children), 'item' will be render-
						ed as a box (since it's a leaf node with no children) */
					"type":"cat",

					/* for [state], if opened = 1 then by default this node will be
					expanded in the tree-view to show its children */
					"state": { "opened":1 },

					/* this node has children elements */
					"children":[
						{
							/* ID of the 1st child element */
							"id":"dwell_prvt",

							/* its label */
							"text":"No. of Private Dwellings",

							/* its type */
							"type":"item",

							/* [server] section registers the db table to map this child
								variable in the online WebGIS system */
							"server":{
								/* table's name in the psql db server */
								"table1": "north_dwelling_private_household",

								/* the table's id used to join to the spatial layer,
								    should be 'uid_join' by default */
							    "table1_id": "uid_join",

							    /*** for a bar chart ***/
							    /* [table1_fields]: 1st field is used for making
							        bar chart, last 2 fields for QC ("color", "comments"
							        by default) */
							    "table1_fields": ["private","color","comments"],

								/* [table1_fieldNames]: human-friendly field names
			                       of those fields, html is supported */
							    "table1_fieldNames": ["Households #", "Color", "Comments"],

							    /* chart type is 'bar' */
							    "chart": "bar"
							},
							"desc": "" // any comments / description goes here.
						},
						{
							"id":"dwell_fam_lone", // ID of the 2nd child
							"text":"No. of Lone Parent Families", // its label
							"type":"item", // its type
							"server":{ // its registration info
								"table1": "north_dwelling_lone_parent_families",
							    "table1_id": "uid_join",

							    /*** for a pie chart ***/
							    /* [table1_fields]: the last 2 fields are QC fields,
							       all fields preceding those 2 are used for making
							       the pie chart */
							    "table1_fields": ["male","female","color","comments"],

							    /* [table1_fieldNames]: human-friendly field names
							       of those fields, html is supported */
							    "table1_fieldNames": ["Male", "Female", "Color", "Comments"],

							    /* chart type is 'pie' */
							    "chart": "pie"
							},
							"desc": "Description for Band Housing"
						}
					]
				},
				{ //  ths is the 2nd child
					"id":"pop",
					"text":"Population",
					"type":"cat",
					"state": { "opened":1 },
					"children":[...]
				},
				{ // this is the 3rd child
					"id":"emp",
					"text":"Empolyment",
					"type":"cat",
					"state": { "opened":1 },
					"children":[...]
				}
			]
	}]
}
```
