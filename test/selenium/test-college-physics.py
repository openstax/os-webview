from selenium import webdriver
import unittest, time

'''
This test
   * Opens the College Physics book page
   * Prints out the links found on the page
   * Some of the links should be from Cloudfront
   * This shows if the API is working and data is available
'''


class TestCollegePhysics(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def test_ap(self):
        driver = self.driver
        driver.get(self.base_url + "/details/books/college-physics")
        time.sleep(10)

        links = driver.find_elements_by_tag_name("a")
        for link in links:
            print(link.get_attribute("href"))

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
