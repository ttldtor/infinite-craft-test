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

async function combineStep(items, itemEmojis, itemToRecipes, recipeToItem, currentIndex, sleepFor = 500, storeNothing = false) {
  console.log("[" + currentIndex + "]: ", itemEmojis[currentIndex] + " " + items[currentIndex]);

  let itemsToAdd = [];
  let emojisToAdd = []

  for (let index = 0; index <= currentIndex; index++) {
    const result = await pair(items[index], items[currentIndex]);
    const itemName = result["result"];
    const itemEmoji = result["emoji"];
    let recipe = makePairStr(items[index], items[currentIndex]);
    let reverseRecipe = makePairStr(items[currentIndex], items[index]);

    if (itemName === "Nothing" && storeNothing === false) {
      recipeToItem[recipe] = itemName;
      recipeToItem[reverseRecipe] = itemName;

      await sleep(sleepFor);

      continue;
    }

    if (itemToRecipes[itemName] === undefined || !(itemToRecipes[itemName] instanceof Array)) {
      itemToRecipes[itemName] = [];

      itemsToAdd.push(itemName);
      emojisToAdd.push((itemEmoji === undefined) ? "" : itemEmoji);
    }

    recipeToItem[recipe] = itemName;
    recipeToItem[reverseRecipe] = itemName;
    itemToRecipes[itemName].push(recipe);
    itemToRecipes[itemName].push(reverseRecipe);
    
    await sleep(sleepFor);
  }

  return [itemsToAdd, emojisToAdd];
}

let items = ["Earth"];
let itemEmojis = ["🌏"];
let itemToRecipes = {}; // {Item.Name -> ["{first: SourceItem1.Name, second : SourceItem2.Name}", "{first: SourceItem2.Name, second : SourceItem1.Name}", ...], ...}
let recipeToItem = {}; // {"{first: SourceItem1.Name, second : SourceItem2.Name}" -> Item.Name, "{first: SourceItem2.Name, second : SourceItem1.Name}" -> Item.Name, ...}
let numberOfSteps = 1000;

(async () => {
  for (let index = 0; index < numberOfSteps; index++) {
    [itemsToAdd, emojisToAdd] = await combineStep(items, itemEmojis, itemToRecipes, recipeToItem, index, 500, false);
    items = items.concat(itemsToAdd);
    itemEmojis = itemEmojis.concat(emojisToAdd);

    if (index > 0 && index % 10 == 0) {
      console.log("items: ", items);
      console.log("itemToRecipes: ", itemToRecipes);
      console.log("recipeToItem: ", recipeToItem);
    }
  }

  console.log("items: ", items);
  console.log("itemToRecipes: ", itemToRecipes);
  console.log("recipeToItem: ", recipeToItem);
})();


/*

((Earth + (Earth + (Earth + Earth))) +
 ((Earth + (Earth + (Earth + Earth))) +
  ((Earth + (Earth + Earth)) + ((Earth + (Earth + Earth)) + ((Earth + Earth) + (Earth + Earth)))))) +
  ((Earth + (Earth + (Earth + (Earth + Earth)))) +
   ((Earth + (Earth + (Earth + (Earth + Earth)))) +
    ((Earth + (Earth + (Earth + Earth))) + (Earth + (Earth + (Earth + (Earth + Earth)))))))
    -> 🔥 Fire

*/