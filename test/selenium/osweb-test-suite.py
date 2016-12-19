import unittest
from TestAboutUs import TestAboutUs
from TestBiology import TestBiology
from TestCollegePhysics import TestCollegePhysics
from TestFunders import TestFunders
from TestHigherEd import TestHigherEd
from TestHome import TestHome
from TestImpact import TestImpact
from TestPartners import TestPartners
from TestSubjects import TestSubjects
from TestBlog import TestBlog
from TestFAQ import TestFAQ


class Test_Suite(unittest.TestCase):
    def test_main(self):
        self.suite = unittest.TestSuite()
        self.suite.addTests([
            unittest.defaultTestLoader.loadTestsFromTestCase(TestAboutUs),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestBiology),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestCollegePhysics),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestFunders),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestHigherEd),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestHome),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestImpact),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestPartners),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestSubjects),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestBlog),
            unittest.defaultTestLoader.loadTestsFromTestCase(TestFAQ),

        ])
        runner = unittest.TextTestRunner()
        runner.run(self.suite)


import unittest

if __name__ == "__main__":
    unittest.main()
