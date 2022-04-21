(function () {
    const w = window; const d = document;

    w.pi=function () {
        w.pi.commands = w.pi.commands || [];
        w.pi.commands.push(arguments);
    };
    const s = d.createElement('script');

    s.async = 1;
    s.src = '//js.pulseinsights.com/surveys.js';
    const f = d.getElementsByTagName('script')[0];

    f.parentNode.insertBefore(s, f);

    pi('identify', 'PI-16384954');
    pi('get', 'surveys');
})();
