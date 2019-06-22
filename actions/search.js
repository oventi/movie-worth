import axios from 'axios'
import xpath from 'xpath'
import {DOMParser} from 'xmldom'

const BASE_URL = 'https://www.imdb.com'

export async function search({query}) {
  if(!query) {
    return []
  }

  const {status, data} = await axios.get(`${BASE_URL}/find?q=${query}&s=tt`)
  if(status !== 200) {
    console.error(status, data)

    return []
  }

  const document = new DOMParser({
    errorHandler: () => {}
  }).parseFromString(data.trim())
  const nodes = xpath.select('//*[@id="main"]/div/div[2]/table/tr//td[2]', document)
  const results = []

  for(const node of nodes) {
    const title_href = node.childNodes[1]
    const title = title_href.childNodes[0].nodeValue.trim()
    const path = title_href.attributes.getNamedItem('href').nodeValue
    const year = node.childNodes[2].nodeValue.trim()

    results.push({
      text: `${title} ${year}`,
      url: `${BASE_URL}${path}`
    })

    if(results.length >= 5) break
  }

  return results
}
