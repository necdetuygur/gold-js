const URL_AR = "https://www.ikd.sadearge.com/Firma/tablo.php";
const URL_GR = 'https://finanswebde.com/altin/gram-altin';
const URL_CR = 'https://finanswebde.com/altin/ceyrek-altin';
const URL_YR = 'https://finanswebde.com/altin/yarim-altin';
const URL_TM = 'https://finanswebde.com/altin/tam-altin';

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
    typeof data["YR_status"] === "undefined" ||
    typeof data["TM_status"] === "undefined"
  ) {
    setTimeout(Checker, 100);
    Writer();
  } else {
    Writer();
    $('#loading').remove();
  }
}

function Writer() {
  $('#content').remove();

  let last = data.last === undefined ? "00-00-0000 00:00:00" : data.last;
  let GR_FYT = data.GR_FYT === undefined ? "000,00" : data.GR_FYT;
  let GR_vote = data.GR_vote === undefined ? "000" : data.GR_vote;
  let GR_status = data.GR_status === undefined ? "%00 XXXXX" : data.GR_status;
  let CR_FYT = data.CR_FYT === undefined ? "000,00" : data.CR_FYT;
  let CR_vote = data.CR_vote === undefined ? "000" : data.CR_vote;
  let CR_status = data.CR_status === undefined ? "%00 XXXXX" : data.CR_status;
  let YR_FYT = data.YR_FYT === undefined ? "000,00" : data.YR_FYT;
  let YR_vote = data.YR_vote === undefined ? "000" : data.YR_vote;
  let YR_status = data.YR_status === undefined ? "%00 XXXXX" : data.YR_status;
  let TM_FYT = data.TM_FYT === undefined ? "000,00" : data.TM_FYT;
  let TM_vote = data.TM_vote === undefined ? "000" : data.TM_vote;
  let TM_status = data.TM_status === undefined ? "%00 XXXXX" : data.TM_status;

  let str = `<pre id="content" style="font-size: 1.5em;">

  Tarih: ${last}

   Gram: ${GR_FYT}TL
         ${GR_vote} Oyla
         ${GR_status}

 Çeyrek: ${CR_FYT}TL
         ${CR_vote} Oyla
         ${CR_status}

  Yarım: ${YR_FYT}TL
         ${YR_vote} Oyla
         ${YR_status}

    Tam: ${TM_FYT}TL
         ${TM_vote} Oyla
         ${TM_status}</pre>
`;
  document.write(str);
}

function main() {
  AddScript("jquery.min.js", function () {
    AddScript("jquery.ajax-cross-origin.min.js", function () {
      /**/
      document.write('<meta name="viewport" content="width=device-width, initial-scale=1"><style>*{background: #112233; color: #efefef;}</style><center id="loading" style="position: fixed; top: 5%; right: 5%;"><img src="loading.gif" /></center>');
      /**/
      jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
          options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
      });
      /**/
      $.ajax({
        url: URL_AR,
        // crossOrigin: true,
        success: function (b) {
          let gram = MatchAll(b, /row6_satis(.*?)>(.*?)<\/td>/gmi);
          let ceyrek = MatchAll(b, /row11_satis(.*?)>(.*?)<\/td>/gmi);
          let yarim = MatchAll(b, /row12_satis(.*?)>(.*?)<\/td>/gmi);
          let tam = MatchAll(b, /row13_satis(.*?)>(.*?)<\/td>/gmi);
          let last = MatchAll(b, /tarih(.*?)>(.*?)<\/span>/gmi);
          if (gram[2] != undefined && ceyrek[2] != undefined && yarim[2] != undefined && tam[2] != undefined) {
            data["last"] = last[2].trim()
              .replace(/Son Güncellenme Tarihi : /ig, "")
              .replace(/SonDeğişiklik/ig, "")
              .trim();
            data["GR_FYT"] = gram[2].trim();
            data["CR_FYT"] = ceyrek[2].trim();
            data["YR_FYT"] = yarim[2].trim();
            data["TM_FYT"] = tam[2].trim();
          }
        }
      });
      /**/
      $.ajax({
        url: URL_GR,
        // crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["GR_status"] = striptags(status[2]).trim();
          data["GR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      $.ajax({
        url: URL_CR,
        // crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["CR_status"] = striptags(status[2]).trim();
          data["CR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      $.ajax({
        url: URL_YR,
        // crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["YR_status"] = striptags(status[2]).trim();
          data["YR_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      $.ajax({
        url: URL_TM,
        // crossOrigin: true,
        success: function (b) {
          let status = MatchAll(b, /<div class="col-md-6"><span class="detail-change(.*?)>(.*?)<!--(.*?)<\/span>(.*?)<span(.*?)class=\"detail-title-sm\">(.*?)<span>(.*?)<\/span>(.*?)<\/span>(.*?)/gmi);
          data["TM_status"] = striptags(status[2]).trim();
          data["TM_vote"] = striptags(status[7]).trim();
        }
      });
      /**/
      Checker();
      /**/
    });
  });
}

window.addEventListener("load", main);
