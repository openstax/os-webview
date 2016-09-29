## Python Selenium Tests

### Setup

To run these tests a properties.ini file needs to be created in the same directory as this README file.
The file should contain 1 line: the base URL for the tests
 
**DO NOT CHECK THIS FILE INTO GITHUB** Use .gitignore to prevent it.
 
**Example**
 
    http://mydomain.com
 

### Running Tests

Make sure the python Selenium package is installed

    pip install selenium

The tests can be run on the command line

    cd location/of/tests
    python <test name>.py

License
-------

This software is subject to the provisions of the GNU Affero General Public License Version 3.0 (AGPL). See license.txt for details. Copyright (c) 2016 Rice University.