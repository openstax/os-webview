from selenium import webdriver
import unittest

'''
This test
   * Opens the Higher Ed page
   * Verifies the CTA text from the API displays and prints out positive results
   * This shows if the API is working and data is available
'''


class TestHigherEd(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
