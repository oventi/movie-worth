import axios from 'axios'
import {DOMParser} from 'xmldom'
import microdata from 'microdata-node'
import xpath from 'xpath'

const BASE_URL = 'https://www.imdb.com'

const get_user_rating = html => {
  const rating_data = microdata.toJson(html, {base: BASE_URL})

  return parseFloat(rating_data.items[0].properties.ratingValue[0])
}

const get_critic_rating = (dom_document, user_rating) => {
  const nodes = xpath.select('//*[contains(@class, "metacriticScore")]/span[1]', dom_document)
  let critic_rating = null

  if(nodes.length > 0) {
    critic_rating = parseFloat(nodes[0].childNodes[0].nodeValue)
  }

  return critic_rating || user_rating * 10
}

const get_json_ld = dom_document => {
  const json_ld_nodes = xpath.select('//script[@type="application/ld+json"]', dom_document)
  return JSON.parse(json_ld_nodes[0].firstChild.data)
}

/*
 * user rating is on a scale of 10
 * critic rating is on a scale of 100
 */
const calculate_rating = (user_rating, critic_rating) => {
  const average = ((user_rating + (critic_rating / 10)) / 2).toPrecision(2)

  return average.indexOf('.0') !== -1 ? parseInt(average) : average
}

export async function advise({imdb_url}) {
  if(!imdb_url) {
    return {}
  }

  const {status, data} = await axios.get(imdb_url)
  if(status !== 200) {
    console.error(status, data)

    return []
  }

  const document = new DOMParser({
    errorHandler: () => {}
  }).parseFromString(data)
  const user_rating = get_user_rating(data)
  const critic_rating = get_critic_rating(document, user_rating)
  const rating = calculate_rating(user_rating, critic_rating)
  const {image: poster, name: title, description} = get_json_ld(document)

  let result = {title, rating}
  if(rating > 5) {
    result = {...result, poster, description}
  }

  return result
}
