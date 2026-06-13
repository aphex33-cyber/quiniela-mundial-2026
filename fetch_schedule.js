async function getSchedule() {
  const url = "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup&prop=text&format=json";
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'MyApp/1.0 (test@example.com)'
      }
    });
    const data = await res.json();
    const html = data.parse.text['*'];
    
    // Quick regex to find all dates like "11 June 2026" or similar in the match tables.
    const matches = [...html.matchAll(/(\d{1,2} June 2026|\d{1,2} July 2026)/g)];
    const dateCounts = {};
    matches.forEach(m => {
      const date = m[1];
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    console.log(dateCounts);
  } catch (e) {
    console.error(e);
  }
}
getSchedule();
