from selenium import webdriver
import unittest

'''
This test
   * Opens the home page
   * Verifies the CTA text from the API displays and prints out positive results
   * This shows if the API is working and data is available
'''

class TestHome(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]
    
    def test_home(self):
        driver = self.driver
        driver.get(self.base_url)
        driver.implicitly_wait(7)
        print("=== Running Home Test ===")

        if driver.find_element_by_xpath("//a[contains(text(),'Let us know')]"):
            print('Let us know link found')

        #if driver.find_element_by_xpath("//a[contains(text(),'Higher Education Peer-reviewed textbooks and digital learning tools"):
        #    print('Higher Ed link found')
        if driver.find_element_by_xpath("//a[contains(text(),'See our impact')]"):
            print('See our Impact link found')
        if driver.find_element_by_xpath("//a[contains(text(),'View Partners')]"):
            print('View Partners link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Learn More')]"):
            print('Learn More link found')

        print("=== Home Test Complete ===\n")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
