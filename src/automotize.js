/*

Open https://neal.fun/infinite-craft/
Open the browser console.
Allow text insertion (if the browser prohibits it).
Paste the script.
Run.
Make a coffee.
Explore.
Meditate.

*/

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function pair(a, b) {
  if (typeof a === "object") {
    a = a["result"];
  }

  if (typeof b === "object") {
    b = b["result"];
  }

  const response = await fetch("https://neal.fun/api/infinite-craft/pair?first=" + a + "&second=" + b, {
    "credentials": "omit",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0", //Your user agent
      "Accept": "*/*",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://neal.fun/infinite-craft/",
    "method": "GET",
    "mode": "cors"
  });

  const result = await response.json();
  console.log(a + " + " + b + " -> " + ((result["emoji"] == undefined) ? "" : (result["emoji"] + " ")) + result["result"]);

  return result;
}

async function combine() {
  if (arguments.length == 0) {
    return {
      "result": ""
    };
  }

  let result = arguments[0];

  if (arguments.length == 1) {
    if (typeof result === "string") {
      return {
        "result": result
      };
    } else {
      return result;
    }
  }

  for (let i = 1; i < arguments.length; i++) {
    result = await pair(result, arguments[i]);
  }

  return result;
}

//console.log(await combine("Glass", "Glass", "Glass", "Glass", "Glass", "Glass"));
//console.log(await combine("Earth", "Earth", "Earth", "Earth", "Earth", "Earth", "Earth"));

function makePair(a, b) {
  return {
    first: a,
    second: b
  };
}

function makePairStr(a, b) {
  return JSON.stringify(makePair(a, b));
}

async function combineStep(items, receipts, combines, currentIndex) {
  let itemsToAdd = [];

  for (let index = 0; index <= currentIndex; index++) {
    const result = await pair(items[index], items[currentIndex]);
    const itemName = result["result"];
    const itemEmoji = result["emoji"];

    if (receipts[itemName] === undefined || !(receipts[itemName] instanceof Array)) {
      receipts[itemName] = [];

      itemsToAdd.push(itemName);
    }

    let receipt = makePairStr(items[items.length - 1], items[currentIndex]);
    let reverseReceipt = makePairStr(items[currentIndex], items[items.length - 1]);

    if (!combines.hasOwnProperty(receipt)) {
      combines[receipt] = itemName;
      receipts[itemName].push(receipt);
    }

    if (!combines.hasOwnProperty(reverseReceipt)) {
      combines[reverseReceipt] = itemName;
      receipts[itemName].push(reverseReceipt);
    }
    
    await sleep(500);
  }

  return itemsToAdd;
}

let items = ["Earth"];
let receipts = {}; // {Item.Name -> ["{first: SourceItem1.Name, second : SourceItem2.Name}", "{first: SourceItem2.Name, second : SourceItem1.Name}", ...], ...}
let combines = {}; // {"{first: SourceItem1.Name, second : SourceItem2.Name}" -> Item.Name, "{first: SourceItem2.Name, second : SourceItem1.Name}" -> Item.Name, ...}

(async () => {
  for (let index = 0; index < 1000; index++) {
    items = items.concat(await combineStep(items, receipts, combines, index));
  }
  
  console.log(200, items);
  console.log(201, receipts);
  console.log(202, combines);
})();