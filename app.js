const URL_AR = "https://www.ikd.sadearge.com/Firma/tablo.php";
const URL_GR = 'https://finanswebde.com/altin/gram-altin';
const URL_CR = 'https://finanswebde.com/altin/ceyrek-altin';
const URL_YR = 'https://finanswebde.com/altin/yarim-altin';

let data = {};

function AddScript(src, callback) {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  s.onload = callback;
  document.body.appendChild(s);
}

function MatchAll(str, regex) {
  let m;
  let ret = {};
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      ret[groupIndex] = match;
    });
  }
  return ret;
}

function striptags(a) {
  return a.replace(/<\/?[^>]+(>|$)/g, "");
}

function Checker() {
  if (
    typeof data["GR_status"] === "undefined" ||
    typeof data["CR_status"] === "undefined" ||
    typeof data["YR_status"] === "undefined"
  )
    setTimeout(Checker, 100);
  else
    Writer();
}

function Writer() {
  let str = `<pre style="font-size: 1.5em;">

  Tarih: ${data.last}

   Gram: ${data["GR_FYT"]}TL
         ${data.GR_vote} Oyla
         ${data.GR_status}

 Çeyrek: ${data["CR_FYT"]}TL
         ${data.CR_vote} Oyla
         ${data.CR_status}

  Yarım: ${data["YR_FYT"]}TL
         ${data.YR_vote} Oyla
         ${data.YR_status}</pre>
`;
  document.write(str);
}

function main() {
  AddScript("jquery.min.js", function () {
    AddScript("jquery.ajax-cross-origin.min.js", function () {
      /**/
      document.write('<meta name="viewport" content="width=device-width, initial-scale=1"><style>*{background: #000; color: #fff;}</style>');
      /**/
      // jQuery.ajaxPrefilter(function (options) {
      //   if (options.crossDomain && jQuery.support.cors) {
      //     options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
      //   }
      // });
      /**/
      $.ajax({
        url: URL_AR,
        crossOrigin: true,
        success: function (b) {
          let gram = MatchAll(b, /row6_satis(.*?)>(.*?)<\/td>/gmi);
          let ceyrek = MatchAll(b, /row11_satis(.*?)>(.*?)<\/td>/gmi);
          let yarim = MatchAll(b, /row12_satis(.*?)>(.*?)<\/td>/gmi);
          let last = MatchAll(b, /tarih(.*?)>(.*?)<\/span>/gmi);
          if (gram[2] != undefined && ceyrek[2] != undefined && yarim[2] != undefined) {
            data["last"] = last[2].trim()
              .replace(/Son Güncellenme Tarihi : /ig, "")
              .replace(/SonDeğişiklik/ig, "")
              .trim();
            data["GR_FYT"] = gram[2].trim();
            data["CR_FYT"] = ceyrek[2].trim();
            data["YR_FYT"] = yarim[2].trim();
          }
        }
      });
      /**/
      $.ajax({
        url: URL_GR,
        crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["GR_status"] = striptags(status[2]).trim();
          data["GR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      $.ajax({
        url: URL_CR,
        crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["CR_status"] = striptags(status[2]).trim();
          data["CR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      $.ajax({
        url: URL_YR,
        crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["YR_status"] = striptags(status[2]).trim();
          data["YR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      Checker();
      /**/
    });
  });
}

window.addEventListener("load", main);