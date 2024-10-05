const maxDays = 30;

async function genReportLog(container, key, url) {
  const response = await fetch("logs/" + key + "_report.log");
  let statusLines = "";
  if (response.ok) {
    statusLines = await response.text();
  }

  const normalized = normalizeData(statusLines);
  const lastPing = getLastPing(statusLines); // Get last ping from log
  const statusStream = constructStatusStream(key, url, normalized, lastPing);
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
    ping: ping ? ping + ' ms' : 'N/A',  // Ensure the ping is displayed
  });

  container.appendChild(streamContainer);
  return container;
}

// This function extracts the ping from the last log entry
function getLastPing(statusLines) {
  const lines = statusLines.trim().split('\n');
  if (lines.length > 0) {
    const lastLine = lines[lines.length - 1];
    const pingMatch = lastLine.match(/ping:\s([0-9.]+)\sms/);
    if (pingMatch) {
      return pingMatch[1];
    }
  }
  return null;
}

// Other functions remain unchanged
