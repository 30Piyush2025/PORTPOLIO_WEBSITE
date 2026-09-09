#!/bin/bash
PORT=${1:-8000}
echo "=========================================================="
echo " Starting Confidential Dossier / Archive Portfolio"
echo " Serving at: http://localhost:$PORT"
echo " 3D Interactive Archive: http://localhost:$PORT/"
echo " Flat Dossier View:     http://localhost:$PORT/portfolio/"
echo "=========================================================="
python3 -m http.server $PORT --directory /root/archive-portfolio
