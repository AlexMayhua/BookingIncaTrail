// lib/facebookPixel.js
export const initFacebookPixel = () => {
    if (typeof window !== 'undefined') {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
  
      // Inicializar el pixel con tu ID
      fbq('init', '644192924927169');
      fbq('track', 'PageView');
    }
  };
  
  export const trackCustomEvent = (event, data = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      fbq('track', event, data);
    }
  };