const maxDays = 30;

async function genReportLog(container, key, url) {
  const response = await fetch("logs/" + key + "_report.log");
  let statusLines = "";
  if (response.ok) {
    statusLines = await response.text();
  }

  const normalized = normalizeData(statusLines);
  const ping = await getPing(url); // Fetch the ping
  const statusStream = constructStatusStream(key, url, normalized, ping);
  container.appendChild(statusStream);
}

function constructStatusStream(key, url, uptimeData, ping) {
  let streamContainer = templatize("statusStreamContainerTemplate");
  for (var ii = maxDays - 1; ii >= 0; ii--) {
    let line = constructStatusLine(key, ii, uptimeData[ii]);
    streamContainer.appendChild(line);
  }

  const lastSet = uptimeData[0];
  const color = getColor(lastSet);

  const container = templatize("statusContainerTemplate", {
    title: key,
    url: url,
    color: color,
    status: getStatusText(color),
    upTime: uptimeData.upTime,
    ping: ping ? ping + ' ms' : 'N/A',  // Display the ping beside the title
  });

  container.appendChild(streamContainer);
  return container;
}

async function getPing(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const response = await fetch("/ping?host=" + hostname);  // You need a backend ping endpoint or service for this
    const ping = await response.text();
    return ping;
  } catch (error) {
    console.error("Ping failed for " + url, error);
    return null;
  }
}

// Other functions remain the same
