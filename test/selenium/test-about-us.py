from selenium import webdriver
import unittest, time

'''
This test
   * Opens the About Us page
   * Prints out the links to the images files
   * This shows if the API is working and data is available
'''


class TestAboutUs(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def test_ap(self):
        driver = self.driver
        driver.get(self.base_url + "/about")
        time.sleep(10)

        images = driver.find_elements_by_tag_name("img")
        for image in images:
            print(image.get_attribute("src"))

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
