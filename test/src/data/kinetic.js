export default `
<html><head>

    <title>Kinetic by OpenStax</title>
    <meta name="description" content="This should be a description for the page in the heading for the browser">
    <link rel="canonical" href="https://dev.openstax.org/general/kinetic/">
    <meta http-equiv="refresh">

    <meta property="og:url" content="https://dev.openstax.org/general/kinetic/">
    <meta property="og:type" content="article">
    <meta property="og:title" content="OpenStax Kinetic (promo)">
    <meta property="og:description" content="This should be a description for the page in the heading for the browser">
    <meta property="og:image" content="https://assets.openstax.org/oscms-dev/media/images/kinetic-full-black-logo.original.webp">
    <meta property="og:image:alt" content="OpenStax: OpenStax Kinetic (promo)">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@OpenStax">
    <meta name="twitter:title" content="OpenStax Kinetic (promo)">
    <meta name="twitter:description" content="This should be a description for the page in the heading for the browser">
    <meta name="twitter:image" content="https://assets.openstax.org/oscms-dev/media/images/kinetic-full-black-logo.original.webp">
    <meta name="twitter:image:alt" content="OpenStax">
</head>
<body>


    
        <section class="block-html">
            <script type="application/javascript">
      window.KINETIC = (window.KINETIC || {});
      if (!window.KINETIC.preScriptRan) {
          
          var URLS = {};
          if (window.location.host == 'openstax.org') {
              URLS = {
                  ACCOUNTS: 'https://openstax.org/accounts',
                  WHOAMI: 'https://openstax.org/accounts/api/user',
                  KINETIC: 'https://kinetic.openstax.org/',
              };
          } else {
              URLS = {
                  ACCOUNTS: 'https://staging.openstax.org/accounts',
                  WHOAMI: 'https://staging.openstax.org/accounts/api/user',
                  KINETIC: 'https://staging.kinetic.openstax.org/',
              }
          }
          var favIcon = document.querySelector('[rel="shortcut icon"]');
          var previousFavIcon; 
          if (favIcon) {
              previousFavIcon = { href: favIcon.href, el: favIcon }; 
              favIcon.href =  'https://assets.openstax.org/oscms-prodcms/media/images/kinetic-favicon-32x32.original.webp';
          }
          document.title = "Kinetic by OpenStax";
          window.KINETIC.preScriptRan = true;
      }
    </script>
    <style>
      .general.page {
        padding-bottom: 0;
      }
      .general.page > section:not(.block-heading) {
        max-width: 100vw;
        padding: 0;
        margin-bottom: 0;
      }
      .block-image {
        display: none;
      }
      .block-html > *:not(.full-width) {
        max-width: 1170px;
        margin: auto;
      }

      #kinetic-homepage {
        box-sizing: border-box;
        width: 100%;
        font-family: 'Neue Helvetica W01', 'Helvetica Neue', sans-serif;
      }

      #kinetic-homepage > * {
        overflow: auto;
      }

      #kinetic-homepage *, #kinetic-homepage *:before, #kinetic-homepage *:after {
        box-sizing: border-box;
      }

      #kinetic-homepage .general.page > section:not(.block-heading) {
        max-width: 100vw;
        padding: 0;
      }

      #kinetic-homepage h2 {
        font-size: 50px;
        line-height: 120%;
        font-weight: normal;
      }
      #kinetic-homepage .actions-block {
        margin-top: 20px;
      }
      #kinetic-homepage .actions-block .buttons {
        display: flex;
        align-items: center;
        min-height: 40px;
      }
      #kinetic-homepage .actions-block a {
        color: white;
        text-decoration: none;
        font-size: 18px;
        display: flex;
        align-items: center;
      }

      #kinetic-homepage .actions-block p {
        font-size: 16px;
        line-height: 160%;
        color: #898989;
      }
      #kinetic-homepage .link {
        font-weight: 700;
        border-radius: 4px;
        padding: 10px;
        border: 1px solid #6821ea;
        transition: all 0.3s;
        letter-spacing: normal;
      }
      #kinetic-homepage .link:hover {
        color: #a7a7a7;
      }
      #kinetic-homepage .link.signup,
      #kinetic-homepage .link.start {
        background-color: #6821ea;
      }
      #kinetic-homepage .link.login {
        margin-left: 20px;
      }

      #kinetic-homepage .hero {
        padding: 0;
        text-align: left;
        display: flex;
        min-height: 400px;
        background: url(https://assets.openstax.org/oscms-prod/media/images/kinetic-ppl-at-tbl.original.png);
        background-position: right 30%;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        color: white;
      }

      #kinetic-homepage .hero > * {
        flex: 1;
      }

      #kinetic-homepage .hero-left {
        position: relative;
        max-width: calc(50% - 150px);
        padding-bottom: 40px;
      }

      #kinetic-homepage .hero .logo {
        width: 200px;
      }

      #kinetic-homepage .hero .content {
        z-index: 2;
        position: relative;
        color: white;
        margin-top: 50px;
        padding-left: 100px;
        font-size: 30px;
        letter-spacing: 2px;
        font-weight: 300;
        margin-right: -200px;
      }

      #kinetic-homepage .hero h1 {
        font-weight: lighter;
        margin: 30px 0;
        font-size: 6rem;
        letter-spacing: 0.2rem;
        line-height: 6.5rem;
      }

      #kinetic-homepage .hero p {
        font-style: normal;
        font-size: 18px;
        line-height: 160%;
      }

      #kinetic-homepage .black-ellipsis {
        background-color: black;
        width: 100%;
        height: 100%;
        z-index: 1;
        position: absolute;
      }

      #kinetic-homepage .black-ellipsis::after {
        position: absolute;
        content: " ";
        display: block;
        width: 300px;
        height: 150%;
        background-color: black;
        border-radius: 0% 100% 47% 53% / 100% 56% 44% 0%;
        right: -300px;
        z-index: 2;
        top: -19%;
      }

      #kinetic-homepage .center-band {
        background: #6922EA;
        color: white;
        font-size: 27px;
        line-height: 120%;
        padding: 40px 0;
      }
      #kinetic-homepage .center-band p {
        max-width: 40%;
        margin: 40px auto;
      }
      #kinetic-homepage .center-band p:last-child {
        font-size: 18px;
        padding-left: 150px;
        max-width: calc(40% + 150px);
      }

      #kinetic-homepage .why-use {
        display: flex;
        flex-wrap: wrap;
        overflow: inherit;
        margin: 80px auto;
      }
      #kinetic-homepage .why-use .col {
        width: 33%;
      }
      #kinetic-homepage .why-use .banner {
        position: sticky;
        top: 80px;
        font-size: 50px;
        line-height: 120%;
        font-weight: normal;
        margin: 20px;
      }
      #kinetic-homepage .why-use .block {
        min-height: 450px;
        padding: 40px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin: 20px;
        height: 50%;
        position: relative;
      }

      #kinetic-homepage .why-use .bg {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        width: 100%;
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
      }
      #kinetic-homepage .why-use p {
        z-index: 2;
      }
      #kinetic-homepage .why-use .lead {
        font-size: 22px;
        margin-bottom: 5px;
      }

      #kinetic-homepage .why-use .explain {
        display: none;
      }
      #kinetic-homepage .why-use .block:hover .explain {
        display: block;
      }

      #kinetic-homepage .journey .bg {
        background-image: linear-gradient(2.02deg, #151B2C 1.7%, rgba(21, 27, 44, 0) 98.3%), url(https://assets.openstax.org/oscms-prod/media/images/kinetic-block-bg-journey.original.png);
      }

      #kinetic-homepage .lifetime .bg {
        background-image: linear-gradient(2.02deg, #151B2C 1.7%, rgba(21, 27, 44, 0) 98.3%), url(https://assets.openstax.org/oscms-prod/media/images/kinetic-block-bg-lifetime.original.png);
      }

      #kinetic-homepage .movement .bg {
        background-image: linear-gradient(2.02deg, #151B2C 1.7%, rgba(21, 27, 44, 0) 98.3%), url(https://assets.openstax.org/oscms-prod/media/images/kinetic-block-bg-movement.original.png);
      }

      #kinetic-homepage .analysis .bg {
        background-image: linear-gradient(2.02deg, #151B2C 1.7%, rgba(21, 27, 44, 0) 98.3%), url(https://assets.openstax.org/oscms-prod/media/images/kinetic-ppl-at-tbl.original.png);
        background-position: right center;
      }


      #kinetic-homepage .how-work {
        background: #e9e9e9;
        color: #151B2C;
        margin: 40px 0;
        padding: 40px 0;
      }
      #kinetic-homepage .how-work h2 {
        margin: 0 20px;
      }
      #kinetic-homepage .how-work p {
        margin: 20px auto;
        max-width: 650px;
        padding: 0 20px;
      }


      #kinetic-homepage .examples {
        max-width: 1100px;
        margin: 20px auto 100px auto;
        padding: 0 20px;
      }
      #kinetic-homepage .examples h2 {
        margin-bottom: 6rem;
      }
      #kinetic-homepage .examples .cards {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
      #kinetic-homepage .examples .card {
        background-color: #f8f7f9;
        padding: 30px;
        flex: 1 0 calc(33% - 20px);
        flex-wrap: wrap;
      }
      #kinetic-homepage .examples .card .lead {
        font-size: 26px;
        color: #6922EA;
      }


      #kinetic-homepage .footer {
        background: black;
        color: white;
        display: flex;
        min-height: 300px;
        padding-right: 40px;
      }

      #kinetic-homepage .footer > * {
        flex: 1;
      }
      #kinetic-homepage .footer .stripes {
        background: url(https://assets.openstax.org/oscms-prod/media/documents/kinetic-stripes.svg);
        background-repeat: no-repeat;
        background-position: left top;
        background-size: 100% 100%;
      }

      @media only screen and (max-width: 768px) {
        #kinetic-homepage .hero {
          flex-direction: column;
          padding-bottom: 70%;
          background-position: right bottom;
          background-size: 100%;
        }
        #kinetic-homepage .hero-left {
          padding-bottom: 0px;
          max-width: 100%;
        }
        #kinetic-homepage .hero-left .content {
          padding: 20px;
          margin-top: 10px;
          margin-right: 0;
        }
        #kinetic-homepage .black-ellipsis::after {
          width: 120%;
          left: -2%;
          bottom: -70px;
          height: 170px;
          z-index: 3;
          top: auto;
          border-radius: 0% 100% 64% 36% / 74% 0% 100% 26%;
        }
        #kinetic-homepage .how-work h2 {
          padding-right: 0;
          margin: 20px;
        }
        #kinetic-homepage .why-use .col,
        #kinetic-homepage .examples .card {
          flex-basis: 100%;
        }

        #kinetic-homepage .footer {
          padding: 40px;
        }
        #kinetic-homepage .footer .stripes {
          display: none;
        }
        #kinetic-homepage .why-use .block {
          padding: 0;
          color: black;
          margin-bottom: 50px;
          height: inherit;
        }
        #kinetic-homepage .why-use p {
          margin: 10px 20px;
        }
        #kinetic-homepage .why-use .lead {
          margin-top: 20px;
          color: #6922EA;
        }
        #kinetic-homepage .why-use .explain {
          display: block;
        }
        #kinetic-homepage .why-use .bg {
          position: relative;
          min-height: 450px;
        }
        #kinetic-homepage .center-band p,
        #kinetic-homepage .center-band p:last-child {
          max-width: 100%;
          margin: 40px 20px;
          padding-left: 0;
        }
      }

    </style>

    <div id="kinetic-homepage" class="full-width">

      <div class="hero">

        <div class="hero-left">
          <div class="black-ellipsis"></div>
          <div class="content">
            <img class="logo" src="https://assets.openstax.org/oscms-prodcms/media/images/kinetic-full-black-logo.max-800x600.webp">
            <h1>Maximize your learning potential</h1>
            <p>
              Kinetic by OpenStax brings innovative study tools designed
              to help you discover more about yourself and how you learn best.
            </p>

            <div class="actions-block login-signup" style="display: block;">
              <div class="buttons">
                <a class="signup link" data-local="true" href="https://staging.openstax.org/accounts/i/signup?r=https://staging.kinetic.openstax.org/">
                  Sign up
                </a>
                <a class="login link" data-local="true" href="https://staging.openstax.org/accounts/i/login?r=https://staging.kinetic.openstax.org/">
                  Log in
                </a>
              </div>
              <p>
                Sign in using your OpenStax credentials, or open an account for free to get started.
              </p>
            </div>

            <div class="actions-block start-using" style="display: none;">
              <div class="buttons">
                <a class="start link" data-local="true" href="https://staging.kinetic.openstax.org/">
                  View available studies
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="center-band">
        <p>
          Learners have been forced to quickly adapt to online
          education platforms — now it's time for the platforms to adapt to them.
        </p>
        <p>
          Enter Kinetic by OpenStax, a dynamic digital learning space designed to
          generate positive change in online education. Whether you’re a learner
          using Kinetic to gain an edge or a researcher working to build more effective
          learning tools, Kinetic will be a resource for all.
        </p>
      </div>

      <div class="why-use">
        <div class="col">
          <h3 class="banner">
            Why use Kinetic by OpenStax?
          </h3>
        </div>

        <div class="col">

          <div class="block journey">
            <div class="bg"></div>
            <p class="lead">
              Kinetic is here to support you on your unique learning journey.
            </p>
            <p class="explain">
              Every learner discovers their own educational path, but you don’t have
              to travel yours alone. Kinetic by OpenStax brings innovative study
              tools designed to help you discover more about yourself and maximize
              your learning potential in the process.
            </p>
          </div>

          <div class="block lifetime">
            <div class="bg"></div>
            <p class="lead">
              Kinetic empowers a lifetime of learning.
            </p>
            <p class="explain">
              The benefits of developing effective learning strategies last a lifetime. Using
              Kinetic to understand how you learn best will help you advance wherever life takes you.
            </p>
          </div>

        </div>


        <div class="col">

          <div class="block movement">
            <div class="bg"></div>
            <p class="lead">
              Kinetic is a movement.
            </p>
            <p class="explain">
              Help us build a brighter future for digital education. By using Kinetic, you’re
              helping researchers create better learning tools optimized to help everyone grow
              academically and professionally.
            </p>
          </div>

          <div class="block analysis">
            <div class="bg"></div>
            <p class="lead">
              Kinetic enables meaningful analysis and measurable change.
            </p>
            <p class="explain">
              Kinetic aims to strengthen OpenStax’s mission of improving educational
              access and learning for everyone. The research conducted on Kinetic will
              be used to better understand what works, what doesn't, and why, so that we
              can improve your learning experience.
            </p>
          </div>
        </div>

      </div>



      <div class="how-work">

        <h2>How does Kinetic work?</h2>

        <p>
          Kinetic has two primary user groups: learners who want to
          develop better study practices and researchers who want to
          build more effective online learning tools.
        </p>

        <p>
          As a learner using Kinetic, you gain access to researcher-crafted
          assessments designed to help you better understand the factors
          that influence your learning. The results of these assessments
          will be collected and analyzed by OpenStax researchers and trusted
          peers working to improve digital education for all learners.
        </p>

        <p>
          This built-in research capability will enable a community of researchers
          to investigate how real students like you learn in your authentic digital
          learning environments.
        </p>

      </div>


      <div class="examples">
        <h2>Example activities</h2>
        <div class="cards">
          <div class="card">
            <p class="lead">
              Biology Educational Video
            </p>
            <p>
              You will be shown an educational video relevant to Chapter 14 (“DNA Structure and Function”) that might help you in your current biology class. How you watch the videos and perform on a brief assessment will be used for future research on video training.
            </p>
          </div>
          <div class="card">
            <p class="lead">
              Physics Math Anxiety Lesson
            </p>
            <p>
              Have you ever thought of writing and physics going together? Try our writing exercise after a brief physics math lesson on scientific units. How you perform on a short assessment will be used for further research on how to reduce students’ anxiety about math.
            </p>
          </div>
          <div class="card">
            <p class="lead">
              Science Basics
            </p>
            <p>
              How much do you remember from your middle school and high school science classes? Take this brief quiz and find out which topics you’ve retained the most from… and where you might have forgotten a thing or two.
            </p>
          </div>

          <div class="card">
            <p class="lead">
              Future Career Quiz
            </p>
            <p>
              Which careers would you be most fulfilled in? You will take a vocational interest survey that will provide you ideas of which jobs might be a good fit for you based on your interests.
            </p>
          </div>
          <div class="card">
            <p class="lead">
              How Much Control Do You Feel Over Your Life?
            </p>
            <p>
              Feeling a sense of control over your actions and your future is a mindset you choose. Find out where you stand right now, plus how you can improve.
            </p>
          </div>
        </div>
      </div>


      <div class="footer">
        <div class="stripes">
        </div>
        <div class="actions">
          <h2>
            Start using Kinetic
          </h2>

          <div class="actions-block login-signup" style="display: block;">
            <p>
              Sign in using your OpenStax credentials, or open an account for free to get started.
            </p>
            <div class="buttons">
              <a class="signup link" data-local="true" href="https://staging.openstax.org/accounts/i/signup?r=https://staging.kinetic.openstax.org/">
                Sign up
              </a>
              <a class="login link" data-local="true" href="https://staging.openstax.org/accounts/i/login?r=https://staging.kinetic.openstax.org/">
                Log in
              </a>
            </div>
          </div>

          <div class="actions-block start-using" style="display: none;">
            <div class="buttons">
              <a class="start link" data-local="true" href="https://staging.kinetic.openstax.org/">
                View available studies
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>

    <script type="application/javascript">
      if (!window.KINETIC.postScriptRan) {
          
          function revealElements(klass) {
              var links = document.querySelectorAll('.' + klass);
              for (var i = 0; i < links.length; i++) {
                  links[i].style.display = "block";
              }
          }

          function setUserState() {
              if (!window.fetch) {
                  revealElements('login-signup');
                  return;
              }
              window.fetch(URLS.WHOAMI, {
                  method: 'GET',
                  credentials: 'include'
              }).then(function(resp) {
                  resp.json().then(function(user) {
                      if (user.id) {
                          revealElements('start-using');
                      } else {
                          revealElements('login-signup');
                      }
                  });
              }).catch(function() {
                  revealElements('login-signup');
              });
          }

          function rewriteLinks(klass, href) {
              var links = document.querySelectorAll('.link.' + klass);
              for (var i = 0; i < links.length; i++) {
                  links[i].href = href;
              }
          }

          rewriteLinks('login', URLS.ACCOUNTS + '/i/login?r=' + URLS.KINETIC);
          rewriteLinks('signup', URLS.ACCOUNTS + '/i/signup?r=' + URLS.KINETIC);
          rewriteLinks('start', URLS.KINETIC);
          setUserState();

          function onPageUnload() {
              if (previousFavIcon) {
                  previousFavIcon.el.href = previousFavIcon.href; 
              }
              delete window.KINETIC;
          }

          var observer = new MutationObserver(function(mutations_list) {
              mutations_list.forEach(function(mutation) {
                  mutation.removedNodes.forEach(function(removed_node) {
                      if(removed_node.className == 'general page') {
                          onPageUnload();
                          observer.disconnect();
                      }
                  });
              });
          });
          observer.observe(document, { subtree: true, childList: true });

          window.KINETIC.postScriptRan = true;
      }
    </script>
        </section>
    
        <section class="block-image">
            <img alt="labs-splash.png" height="666" src="https://assets.openstax.org/oscms-dev/media/images/labs-splash.original.png" width="1440">
        </section>
    
</body></html>
`;
