from selenium import webdriver
import unittest, time

'''
This test
   * reads pages from properties.ini and adds them to sitemap
   * Opens Subjects page, finds book links and adds to sitemap
   * Saves sitemap as sitemap.xml
   * Prints sitemap to console for review
'''


class TestSitemap(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.output = ''
        propfile = open('properties.ini')
        self.items = [line.rstrip('\n') for line in propfile]
        self.base_url = 'https://openstax.org'
        self.readProperties(self.items)

    def test_sitemap(self):
        driver = self.driver
        driver.get(self.base_url + "/subjects")
        time.sleep(10)
        print("=== Running Sitemap Gen ===")

        images = driver.find_elements_by_tag_name("a")
        for image in images:
            #print(image.text)
            if 'details/books' in image.get_attribute('href'):
                self.addLink(image.get_attribute('href'))

        print("=== Sitemap Gen Complete ===\n")

    def tearDown(self):
        self.driver.quit()
        self.output += '</urlset>'
        print(self.output)
        text_file = open("sitemap.xml", "w")
        text_file.write(self.output)
        text_file.close()

    def readProperties(self, items):
        self.output += '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

        for item in items:
            self.output += '  <url>\n    <loc>'
            self.output += self.base_url
            self.output += '/'
            self.output += item
            self.output += '</loc>\n    <lastmod>2016-11-11</lastmod>  \n  </url>\n'

    def addLink(self,path):
        self.output += '  <url>\n    <loc>'
        self.output += path
        self.output += '</loc>\n    <lastmod>2016-11-11</lastmod>  \n  </url>\n'


if __name__ == "__main__":
    unittest.main()