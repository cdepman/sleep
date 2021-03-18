const fetch = require('node-fetch');
const each = require('lodash/each');
const trim = require('lodash/trim');
const mean = require('lodash/mean');

const AUTH_TOKEN = process.env.OURA_AUTH_TOKEN
const DATA_START_DATE = '2020-01-15'

const getCountOfOccurences = (arr) => {
  const dict = {}
  each(arr, (item) => {
    if (!dict[item]){
      dict[item] = 0
    }
    dict[item] += 1
  })
  return dict
}


const getOuraData = async () => {
  const response = await fetch(`https://api.ouraring.com/v1/sleep?start=${DATA_START_DATE}`, {
    method: 'get',
    headers: {'Authorization': `Bearer ${AUTH_TOKEN}`}
  });
  const collector = []
  const data = await response.json();
  each(data.sleep, (sleepData) => {
    const hypnogram = sleepData.hypnogram_5min
    // remove falling asleep and waking up
    const trimmedHypnogram = trim(hypnogram, '4')
    // get runs of awakeness
    const countOfAwakeSequences = (trimmedHypnogram.match(/4+/g) || []).length;
    collector.push(countOfAwakeSequences)
  })
  console.log(`Mean wake count over ${collector.length} nights:  ${mean(collector)} times`)
  console.log(getCountOfOccurences(collector))
}

getOuraData()
