from selenium import webdriver
import unittest, time

'''
This test
   * Opens the FAQ page
   * Prints out the questions found on the page
   * This shows if the API is working and data is available
'''


class TestFAQ(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        propfile = open('properties.ini')
        items = [line.rstrip('\n') for line in propfile]
        self.base_url = items[0]

    def test_faq(self):
        driver = self.driver
        driver.get(self.base_url + "/faq")
        time.sleep(10)
        print("=== Running FAQ Test ===")

        divs = driver.find_elements_by_tag_name("div")
        for div in divs:
            if div.get_attribute("class") == 'question':
                print(div.text)

        print("=== FAQ Test Complete ===\n")

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()