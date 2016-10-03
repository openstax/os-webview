from selenium import webdriver
import unittest

'''
This test
   * Opens the AP page
   * Verifies the CTA text from the API displays and prints out positive results
   * This shows if the API is working and data is available
'''


class TestAP(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def test_ap(self):
        driver = self.driver
        driver.get(self.base_url + "/ap")
        driver.implicitly_wait(7)
        print("=== Running AP Test ===")

        if driver.find_element_by_xpath("//a[contains(text(),'Explore Our Subjects')]"):
            print('Explore Our Subjects link found')
        if driver.find_element_by_xpath("//a[contains(text(),'View Partners')]"):
            print('View partners link found')

        print("=== AP Test Complete ===\n")

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
