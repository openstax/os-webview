// import cmsFetch from '~/helpers/cms-fetch';

export default function setPreviewPage() {
    const slackTitle = document.querySelector('meta[property="og:title"]');

    slackTitle.setAttribute("content", "This is what you should see");
}

/* <html>
<head>

    <title>{{ page.seo_title }}</title>
    <meta name="description" content="{{ page.search_description }}">
    <link rel="canonical" href="{{page.get_full_url}}" />
    <meta http-equiv="refresh">

    <meta property="og:url" content="{{page.get_full_url}}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{{ page.seo_title }}" />
    <meta property="og:description" content="{{ page.search_description }}" />
    <meta property="og:image" content="{{ promote_image.url }}" />
    <meta property="og:image:alt" content="OpenStax: {{ page.seo_title }}" />

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@OpenStax">
    <meta name="twitter:title" content="{{ page.seo_title }}">
    <meta name="twitter:description" content="{{ page.search_description }}">
    <meta name="twitter:image" content="{{ promote_image.url }}">
    <meta name="twitter:image:alt" content="OpenStax">
</head>
<body>
{% block content %}{% endblock %}
</body>
</html> */
