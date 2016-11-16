## OS Web Sitemap Generator

### Setup

To run these tests a properties.ini file needs to be created in the same directory as this README file.
It should contain the list of pages, not including books, for the site.
 
### Running Tests

#### Mac OSX

 * Download the [geckodriver](https://github.com/mozilla/geckodriver/releases)
 * Unzip the file and place it is /usr/bin. You will be asked for your password to copy it.
 * Install Selenium 3
     pip install selenium==3.0.0b3


Make sure the python Selenium package is installed

    pip install selenium

The generator can be run on the command line

    cd location/of/code
    python sitemap.py

The sitemap will be printed to the console and saved in a sitemap.xml file.

License
-------

This software is subject to the provisions of the GNU Affero General Public License Version 3.0 (AGPL). See license.txt for details. Copyright (c) 2016 Rice University.
