import { downloadText } from 'download.js';

let outputData = [];

export async function downloadData(body) {
  outputData = [];
  let resp = await fetch('api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'any'
    },
    body: JSON.stringify(body)
  })

  let data = await resp.json()
  let scrollId = data["_scroll_id"]
  console.log("Total results: " + data["hits"]["total"])
  console.log("Batch0 size: " + data["hits"]["hits"].length)
  if (data["hits"]["hits"].length == 0) {
    return alert("No results in the response")
  }
  outputData = outputData.concat(outputPrepare(data))
  getScrollBatch(scrollId).then(result => {
    let output = JSON.stringify(result)
    console.log("Result size: in chars: " + output.length + "(" + output.length / 1000 / 1000 + "MB)")
    downloadText('response.txt', JSON.stringify(result))
  }).catch((err) => {
    console.error(err);
  })
}


function outputPrepare(data) {
  return data.hits.hits.map(x => x._source);
}

async function getScrollBatch(scrollId, i=1) {
  let resp = await fetch('api/download/scroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'kbn-xsrf': 'any'
    },
    body: JSON.stringify({
      scroll: "5m",
      scroll_id: scrollId
    })
  })
  let data = await resp.json()
  let scrollId1 = data._scroll_id
  if (data.hits.hits.length == 0) {
    return outputData
  }

  console.log("Batch" + i + " size: " + data.hits.hits.length)
  outputData = outputData.concat(outputPrepare(data))
  return await getScrollBatch(scrollId1, i+1)
}
