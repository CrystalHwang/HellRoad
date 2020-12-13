import axios from 'axios';
import cheerio from 'cheerio';

const getCovidStatusData = async () => {
  try {
    const html = await axios.get('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%BD%94%EB%A1%9C%EB%82%9819');
    const $ = cheerio.load(html.data);
    const crawledData = $('div.status_info').children('ul').text();

    const arrOfCrawledData = crawledData.split(' ');

    const covidStatusData = [];

    for (let i = 0; i < arrOfCrawledData.length; i++) {
      const index = Math.floor(i / 5);

      if (index >= 4) break;

      if (arrOfCrawledData[i]) {
        if (i % 5 === 2) {
          covidStatusData[index] = { 'title': arrOfCrawledData[i] };
        } else if (i % 5 === 3) {
          covidStatusData[index] = { ...covidStatusData[index], 'total': arrOfCrawledData[i] };
        } else if (i % 5 === 4) {
          covidStatusData[index] = { ...covidStatusData[index], 'variation': arrOfCrawledData[i] };
        }
      }
    }

    return covidStatusData;
  } catch (err) {
    console.error(err);
  }
};

export default getCovidStatusData;
