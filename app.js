const GlobalUrl = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent("http://www.ikd.sadearge.com/Firma/tablo.php") + '&callback=?';
const GlobalGram = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://finanswebde.com/altin/gram-altin') + '&callback=?';
const GlobalCeyrek = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://finanswebde.com/altin/ceyrek-altin') + '&callback=?';
const GlobalYarim = 'http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://finanswebde.com/altin/yarim-altin') + '&callback=?';

let data = {};

function AddScript(src, callback) {
  var s = document.createElement('script');
  s.setAttribute('src', src);
  s.onload = callback;
  document.body.appendChild(s);
}

const MatchAll = function (str, regex) {
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

const striptags = function (a) {
  return a.replace(/<\/?[^>]+(>|$)/g, "");
}

const Checker = function () {
  if (
    typeof data["GR_status"] === "undefined" ||
    typeof data["CR_status"] === "undefined" ||
    typeof data["YR_status"] === "undefined"
  )
    setTimeout(Checker, 100);
  else
    // console.log('data: ' + JSON.stringify(data, 2, 2));
    Writer();
}

const Writer = function () {
  let str = `<meta name="viewport" content="width=device-width, initial-scale=1"><style>*{background: #000; color: #fff;}</style><pre style="font-size: 1.5em;">

  Tarih: ${data.last}

   Gram: ${data["Gram"]}TL
         ${data.GR_vote} Oyla
         ${data.GR_status}

 Çeyrek: ${data["Çeyrek"]}TL
         ${data.CR_vote} Oyla
         ${data.CR_status}

  Yarım: ${data["Yarım"]}TL
         ${data.YR_vote} Oyla
         ${data.YR_status}</pre>
`;
  document.write(str);
}

window.addEventListener("load", function () {
  AddScript("jquery.min.js", function () {
    /**/
    $.ajax({
      url: GlobalUrl,
      async: false,
      dataType: 'json',
      success: function (json) {
        b = json.contents;
        let gram = MatchAll(b, /row6_satis(.*?)>(.*?)<\/td>/gmi);
        let ceyrek = MatchAll(b, /row11_satis(.*?)>(.*?)<\/td>/gmi);
        let yarim = MatchAll(b, /row12_satis(.*?)>(.*?)<\/td>/gmi);
        let last = MatchAll(b, /tarih(.*?)>(.*?)<\/span>/gmi);
        if (gram[2] != undefined && ceyrek[2] != undefined && yarim[2] != undefined) {
          data["last"] = last[2].trim()
            .replace(/Son Güncellenme Tarihi : /ig, "")
            .replace(/SonDeğişiklik/ig, "")
            .trim();
          data["Gram"] = gram[2].trim();
          data["Çeyrek"] = ceyrek[2].trim();
          data["Yarım"] = yarim[2].trim();
        }
      }
    });
    /**/
    $.ajax({
      url: GlobalGram,
      async: false,
      dataType: 'json',
      success: function (json) {
        b = json.contents;
        let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
        data["GR_status"] = striptags(status[2]).trim();
        data["GR_vote"] = striptags(status[7]).trim();
      }
    });
    /**/
    $.ajax({
      url: GlobalCeyrek,
      async: false,
      dataType: 'json',
      success: function (json) {
        b = json.contents;
        let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
        data["CR_status"] = striptags(status[2]).trim();
        data["CR_vote"] = striptags(status[7]).trim();
      }
    });
    /**/
    $.ajax({
      url: GlobalYarim,
      async: false,
      dataType: 'json',
      success: function (json) {
        b = json.contents;
        let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
        data["YR_status"] = striptags(status[2]).trim();
        data["YR_vote"] = striptags(status[7]).trim();
      }
    });
    /**/
    Checker();
  });
});