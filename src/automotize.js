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
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
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

let items = new Set(["Earth"]);

async function combineStep() {
    items.forEach();
}

items.forEach()