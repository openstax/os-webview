import ErrataForm from '~/pages/errata-form/errata-form';
import Form from '~/pages/errata-form/form/form';
import {clickElement} from '../../../test-utils';
import bookPromise from '~/models/book-titles';
import userModel from '~/models/usermodel';

describe('ErrataForm', () => {
    const searchStr = '?book=Biology%202e';

    it('creates', () => {
        window.history.pushState('', '', searchStr);
        expect(window.location.search).toBe(searchStr);
        const p = new ErrataForm();

        return Promise.all([userModel.load(), bookPromise]).then(() => {
            expect(p.el.innerHTML).toBeTruthy();
        });
    });
});

describe('ErrataForm/Form', () => {
    const formModel = {
      "defaultEmail": "gmf3+teacher01@rice.edu",
      "submittedBy": 23,
      "selectedTitle": "Biology 2e",
      "isTutor": false,
      "mode": "form",
      "books": [
        {
          "id": 46,
          "meta": {
            "slug": "prealgebra",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/46/",
            "html_url": "http://openstax.org/subjects/prealgebra/",
            "first_published_at": "2016-03-09T10:00:11.787802-06:00"
          },
          "title": "Prealgebra"
        },
        {
          "id": 130,
          "meta": {
            "slug": "elementary-algebra",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/130/",
            "html_url": "http://openstax.org/subjects/elementary-algebra/",
            "first_published_at": "2017-02-13T15:16:38.440710-06:00"
          },
          "title": "Elementary Algebra"
        },
        {
          "id": 131,
          "meta": {
            "slug": "intermediate-algebra",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/131/",
            "html_url": "http://openstax.org/subjects/intermediate-algebra/",
            "first_published_at": "2017-02-17T15:15:54.212862-06:00"
          },
          "title": "Intermediate Algebra"
        },
        {
          "id": 39,
          "meta": {
            "slug": "college-algebra",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/39/",
            "html_url": "http://openstax.org/subjects/college-algebra/",
            "first_published_at": "2016-03-09T09:54:06.207750-06:00"
          },
          "title": "College Algebra"
        },
        {
          "id": 38,
          "meta": {
            "slug": "algebra-and-trigonometry",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/38/",
            "html_url": "http://openstax.org/subjects/algebra-and-trigonometry/",
            "first_published_at": "2016-03-09T09:53:01.890636-06:00"
          },
          "title": "Algebra and Trigonometry"
        },
        {
          "id": 37,
          "meta": {
            "slug": "precalculus",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/37/",
            "html_url": "http://openstax.org/subjects/precalculus/",
            "first_published_at": "2016-03-09T09:50:20.975884-06:00"
          },
          "title": "Precalculus"
        },
        {
          "id": 74,
          "meta": {
            "slug": "calculus-volume-1",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/74/",
            "html_url": "http://openstax.org/subjects/calculus-volume-1/",
            "first_published_at": "2016-03-10T14:37:26.063299-06:00"
          },
          "title": "Calculus Volume 1"
        },
        {
          "id": 75,
          "meta": {
            "slug": "calculus-volume-2",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/75/",
            "html_url": "http://openstax.org/subjects/calculus-volume-2/",
            "first_published_at": "2016-03-10T14:37:26.063299-06:00"
          },
          "title": "Calculus Volume 2"
        },
        {
          "id": 76,
          "meta": {
            "slug": "calculus-volume-3",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/76/",
            "html_url": "http://openstax.org/subjects/calculus-volume-3/",
            "first_published_at": "2016-03-10T14:37:26.063299-06:00"
          },
          "title": "Calculus Volume 3"
        },
        {
          "id": 36,
          "meta": {
            "slug": "introductory-statistics",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/36/",
            "html_url": "http://openstax.org/subjects/introductory-statistics/",
            "first_published_at": "2016-03-09T09:49:10.790493-06:00"
          },
          "title": "Introductory Statistics"
        },
        {
          "id": 189,
          "meta": {
            "slug": "introductory-business-statistics",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/189/",
            "html_url": "http://openstax.org/subjects/introductory-business-statistics/",
            "first_published_at": "2017-11-30T11:15:17.997949-06:00"
          },
          "title": "Introductory Business Statistics"
        },
        {
          "id": 35,
          "meta": {
            "slug": "anatomy-and-physiology",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/35/",
            "html_url": "http://openstax.org/subjects/anatomy-and-physiology/",
            "first_published_at": "2016-03-09T09:48:12.654796-06:00"
          },
          "title": "Anatomy and Physiology"
        },
        {
          "id": 81,
          "meta": {
            "slug": "astronomy",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/81/",
            "html_url": "http://openstax.org/subjects/astronomy/",
            "first_published_at": "2016-04-22T12:11:50.319882-05:00"
          },
          "title": "Astronomy"
        },
        {
          "id": 121,
          "meta": {
            "slug": "biology",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/121/",
            "html_url": "http://openstax.org/subjects/biology/",
            "first_published_at": "2016-12-16T09:52:20.369252-06:00"
          },
          "title": "Biology"
        },
        {
          "id": 207,
          "meta": {
            "slug": "biology-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/207/",
            "html_url": "http://openstax.org/subjects/biology-2e/",
            "first_published_at": "2018-03-09T15:44:46.846024-06:00"
          },
          "title": "Biology 2e"
        },
        {
          "id": 34,
          "meta": {
            "slug": "concepts-biology",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/34/",
            "html_url": "http://openstax.org/subjects/concepts-biology/",
            "first_published_at": "2016-03-09T09:47:29.653246-06:00"
          },
          "title": "Concepts of Biology"
        },
        {
          "id": 83,
          "meta": {
            "slug": "microbiology",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/83/",
            "html_url": "http://openstax.org/subjects/microbiology/",
            "first_published_at": "2016-04-26T10:41:48.505644-05:00"
          },
          "title": "Microbiology"
        },
        {
          "id": 43,
          "meta": {
            "slug": "chemistry",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/43/",
            "html_url": "http://openstax.org/subjects/chemistry/",
            "first_published_at": "2016-03-09T09:57:39.246931-06:00"
          },
          "title": "Chemistry"
        },
        {
          "id": 93,
          "meta": {
            "slug": "chemistry-atoms-first",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/93/",
            "html_url": "http://openstax.org/subjects/chemistry-atoms-first/",
            "first_published_at": "2016-07-19T11:18:52.182148-05:00"
          },
          "title": "Chemistry: Atoms First"
        },
        {
          "id": 31,
          "meta": {
            "slug": "college-physics",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/31/",
            "html_url": "http://openstax.org/subjects/college-physics/",
            "first_published_at": "2016-03-09T09:05:28.982257-06:00"
          },
          "title": "College Physics"
        },
        {
          "id": 82,
          "meta": {
            "slug": "university-physics-volume-1",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/82/",
            "html_url": "http://openstax.org/subjects/university-physics-volume-1/",
            "first_published_at": "2016-04-22T12:13:54.743756-05:00"
          },
          "title": "University Physics Volume 1"
        },
        {
          "id": 94,
          "meta": {
            "slug": "university-physics-volume-2",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/94/",
            "html_url": "http://openstax.org/subjects/university-physics-volume-2/",
            "first_published_at": "2016-04-22T12:13:54.743756-05:00"
          },
          "title": "University Physics Volume 2"
        },
        {
          "id": 95,
          "meta": {
            "slug": "university-physics-volume-3",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/95/",
            "html_url": "http://openstax.org/subjects/university-physics-volume-3/",
            "first_published_at": "2016-04-22T12:13:54.743756-05:00"
          },
          "title": "University Physics Volume 3"
        },
        {
          "id": 162,
          "meta": {
            "slug": "biology-ap-courses",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/162/",
            "html_url": "http://openstax.org/subjects/biology-ap-courses/",
            "first_published_at": "2017-07-27T09:56:13.901502-05:00"
          },
          "title": "Biology for AP® Courses"
        },
        {
          "id": 47,
          "meta": {
            "slug": "college-physics-ap-courses",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/47/",
            "html_url": "http://openstax.org/subjects/college-physics-ap-courses/",
            "first_published_at": "2016-03-09T10:01:26.391128-06:00"
          },
          "title": "The AP Physics Collection"
        },
        {
          "id": 190,
          "meta": {
            "slug": "fizyka-dla-szkół-wyższych-tom-1",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/190/",
            "html_url": "http://openstax.org/subjects/fizyka-dla-szk%C3%B3%C5%82-wy%C5%BCszych-tom-1/",
            "first_published_at": "2017-12-05T14:46:42.214564-06:00"
          },
          "title": "Fizyka dla szkół wyższych. Tom 1"
        },
        {
          "id": 219,
          "meta": {
            "slug": "fizyka-dla-szkół-wyższych-tom-2",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/219/",
            "html_url": "http://openstax.org/subjects/fizyka-dla-szk%C3%B3%C5%82-wy%C5%BCszych-tom-2/",
            "first_published_at": "2018-06-18T12:34:42.916050-05:00"
          },
          "title": "Fizyka dla szkół wyższych. Tom 2"
        },
        {
          "id": 245,
          "meta": {
            "slug": "fizyka-dla-szkół-wyższych-tom-3",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/245/",
            "html_url": "http://openstax.org/subjects/fizyka-dla-szk%C3%B3%C5%82-wy%C5%BCszych-tom-3/",
            "first_published_at": "2018-08-09T10:57:12.454940-05:00"
          },
          "title": "Fizyka dla szkół wyższych. Tom 3"
        },
        {
          "id": 84,
          "meta": {
            "slug": "american-government",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/84/",
            "html_url": "http://openstax.org/subjects/american-government/",
            "first_published_at": "2016-05-13T16:29:19.973695-05:00"
          },
          "title": "American Government"
        },
        {
          "id": 177,
          "meta": {
            "slug": "principles-economics-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/177/",
            "html_url": "http://openstax.org/subjects/principles-economics-2e/",
            "first_published_at": "2017-11-01T11:54:44.174463-05:00"
          },
          "title": "Principles of Economics 2e"
        },
        {
          "id": 178,
          "meta": {
            "slug": "principles-macroeconomics-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/178/",
            "html_url": "http://openstax.org/subjects/principles-macroeconomics-2e/",
            "first_published_at": "2017-11-08T12:14:11.093682-06:00"
          },
          "title": "Principles of Macroeconomics 2e"
        },
        {
          "id": 155,
          "meta": {
            "slug": "principles-microeconomics-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/155/",
            "html_url": "http://openstax.org/subjects/principles-microeconomics-2e/",
            "first_published_at": "2017-06-28T11:30:43.785365-05:00"
          },
          "title": "Principles of Microeconomics 2e"
        },
        {
          "id": 45,
          "meta": {
            "slug": "psychology",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/45/",
            "html_url": "http://openstax.org/subjects/psychology/",
            "first_published_at": "2016-03-09T09:58:52.534763-06:00"
          },
          "title": "Psychology"
        },
        {
          "id": 32,
          "meta": {
            "slug": "introduction-sociology-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/32/",
            "html_url": "http://openstax.org/subjects/introduction-sociology-2e/",
            "first_published_at": "2016-03-09T09:45:10.681907-06:00"
          },
          "title": "Introduction to Sociology 2e"
        },
        {
          "id": 186,
          "meta": {
            "slug": "principles-macroeconomics-ap-courses-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/186/",
            "html_url": "http://openstax.org/subjects/principles-macroeconomics-ap-courses-2e/",
            "first_published_at": "2017-11-29T11:53:53.654175-06:00"
          },
          "title": "Principles of Macroeconomics for AP® Courses 2e"
        },
        {
          "id": 188,
          "meta": {
            "slug": "principles-microeconomics-ap-courses-2e",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/188/",
            "html_url": "http://openstax.org/subjects/principles-microeconomics-ap-courses-2e/",
            "first_published_at": "2017-11-29T11:55:46.299107-06:00"
          },
          "title": "Principles of Microeconomics for AP® Courses 2e"
        },
        {
          "id": 44,
          "meta": {
            "slug": "us-history",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/44/",
            "html_url": "http://openstax.org/subjects/us-history/",
            "first_published_at": "2016-03-09T09:58:20.010727-06:00"
          },
          "title": "U.S. History"
        },
        {
          "id": 259,
          "meta": {
            "slug": "introduction-business",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/259/",
            "html_url": "http://openstax.org/subjects/introduction-business/",
            "first_published_at": "2018-09-18T05:37:19.622356-05:00"
          },
          "title": "Introduction to Business"
        },
        {
          "id": 261,
          "meta": {
            "slug": "business-ethics",
            "type": "books.Book",
            "detail_url": "https://cms-dev.openstax.org/api/v2/pages/261/",
            "html_url": "http://openstax.org/subjects/business-ethics/",
            "first_published_at": "2018-09-24T11:43:19.961933-05:00"
          },
          "title": "Business Ethics"
        }
      ]
  };

  const p = new Form(formModel);
  it('changes selected error', () => {
      const errorRadios = Array.from(p.el.querySelectorAll('[name="error_type"]:not(:checked)'));

      expect(p.el).toBeTruthy();
      expect(p.model.selectedError).toBeFalsy();
      errorRadios.forEach((el) => {
         clickElement(el);
         expect(p.model.selectedError).toBe(el.value);
      });
  });
  it('changes source', () => {
      const sourceRadios = Array.from(p.el.querySelectorAll('[name="resource"]:not(:checked)'));
      const resourceOther = () => p.el.querySelector('[name="resource_other"]');

      expect(sourceRadios).toBeTruthy();
      expect(p.model.selectedSource).toBeFalsy();
      expect(resourceOther()).toBeFalsy();
      sourceRadios.forEach((el) => {
         clickElement(el);
         expect(p.model.selectedSource).toBe(el.value);
      });
      const lastRadio = sourceRadios.pop();

      expect(lastRadio.value).toBe('Other');
      expect(resourceOther()).toBeTruthy();
  });
  it('denies invalid submit', () => {
     const submitBtn = p.el.querySelector('[type="submit"]');

     expect(p.hasBeenSubmitted).toBeFalsy();
     clickElement(submitBtn);
     expect(p.hasBeenSubmitted).toBeTruthy();
  });

});
