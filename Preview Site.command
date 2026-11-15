#!/bin/bash
# Double-click to preview the website on your Mac.
# (First time: right-click this file > Open, then click Open.)
# Close this window to stop the preview.
cd "$(dirname "$0")" || exit 1
PORT=8000
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done
URL="http://localhost:$PORT"
echo "Previewing the DSP website at $URL"
echo "Close this window when you're done."
(sleep 1; open "$URL") &
if command -v python3 >/dev/null 2>&1 && python3 -c "" >/dev/null 2>&1; then
  python3 -m http.server $PORT
elif command -v ruby >/dev/null 2>&1; then
  ruby -run -e httpd . -p $PORT
else
  echo "Couldn't find Python or Ruby to run the preview."
  echo "Install Python from https://www.python.org/downloads/ and try again."
  read -r -p "Press Enter to close."
fi
