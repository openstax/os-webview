from selenium import webdriver
import unittest, time

'''
This test
   * Opens the Foundation page
   * Prints out the headers found on the page
   * It should be the list of funders
   * This shows if the API is working and data is available
'''


class TestFunders(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def test_ap(self):
        driver = self.driver
        driver.get(self.base_url + "/foundation")
        time.sleep(7)

        images = driver.find_elements_by_tag_name("h2")
        for image in images:
            print(image.text)

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
