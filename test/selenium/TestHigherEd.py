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

    def test_higher_ed(self):
        driver = self.driver
        driver.get(self.base_url + "/higher-ed")
        driver.implicitly_wait(7)
        print("=== Running Higher Ed Test ===")

        if driver.find_element_by_xpath("//a[contains(text(),'Subscribe')]"):
            print('Subscribe link found')

        if driver.find_element_by_xpath("//a[contains(text(),'View Books')]"):
            print('View Books link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Create Account')]"):
            print('See our Impact link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Adopt')]"):
            print('Adopt link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Contact Us')]"):
            print('Contact Us link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Explore Our Subjects')]"):
            print('Explore Our Subjects link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Give')]"):
            print('Give link found')
        if driver.find_element_by_xpath("//a[contains(text(),'Discover Free Content')]"):
            print('Discover Free Content link found')

        print("=== Higher Ed Test Complete ===\n")

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
