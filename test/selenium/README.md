## Python Selenium Tests

### Setup

To run these tests a properties.ini file needs to be created in the same directory as this README file.
The file should contain 1 line: the base URL for the tests
 
**DO NOT CHECK THIS FILE INTO GITHUB** Use .gitignore to prevent it.
 
**Example**
 
    http://mydomain.com
 

### Running Tests

#### Mac OSX

 * Download the [geckodriver](https://github.com/mozilla/geckodriver/releases)
 * Unzip the file and place it is /usr/bin. You will be asked for your password to copy it.
 * Install Selenium 3
     pip install selenium==3.0.0b3


Make sure the python Selenium package is installed

    pip install selenium

The tests can be run on the command line

Run a single Test

    cd location/of/tests
    python <test name>.py
    
Run Test Suite (all tests)

    cd location/of/tests
    python osweb-test-suite.py


License
-------

This software is subject to the provisions of the GNU Affero General Public License Version 3.0 (AGPL). See license.txt for details. Copyright (c) 2016 Rice University.
