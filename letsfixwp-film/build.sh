#!/bin/sh
# One command: Back Online Today, the LetsFixWP brand film (Tabletop App Flythrough).
#   sh build.sh            full build: fonts, voice (checked), score, foley, mix, picture, master, checks, poster
#   N=8 WORKERS=3 sh build.sh   fewer sub-frames per frame (faster software rendering, a little less anti-aliasing)
# Fonts come from github.com/google/fonts (OFL); samples from the library's fetch (CC0). The voice (edge-tts) needs the internet.
set -e
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
HERE=$(cd "$(dirname "$0")" && pwd)
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the Lemo-Opuscar library folder"; exit 1; }
PY="$LIB/.venv/bin/python"
NAME=letsfixwp-film
FPS=30
N=${N:-10}
WORKERS=${WORKERS:-2}
POSTER=44.0                                          # the closing wide view: title landed, the customers back
cd "$LIB"
mkdir -p "$HERE/out" "$HERE/fonts"
"$PY" core/audio/sampler.py --need "$HERE/audio/compose.py"

# fonts (OFL)
GF=https://github.com/google/fonts/raw/main/ofl
[ -f "$HERE/fonts/Manrope.ttf" ] || curl -sfL -o "$HERE/fonts/Manrope.ttf" "$GF/manrope/Manrope%5Bwght%5D.ttf"
[ -f "$HERE/fonts/JetBrainsMono.ttf" ] || curl -sfL -o "$HERE/fonts/JetBrainsMono.ttf" "$GF/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"

# voice: Microsoft edge-tts, Indian English; every line checked back with Whisper (small.en)
"$PY" core/tts/tts_zh.py "$HERE/vo/lines.json" "$HERE/vo" --voice en-IN-NeerjaNeural
WHISPER_MODEL=small.en "$PY" core/tts/asr_check.py "$HERE/vo/lines.json" "$HERE/vo" --lang en
python3 "$HERE/audio/vo_timeline.py"
DUR=$(python3 -c "import json;print(json.load(open('$HERE/vo/timeline.json'))['dur'])"); export DUR

# events and camera speed from the page, then score, foley, mix (about -16 LUFS before the master)
node core/render/events.mjs "$HERE" --out "$HERE/out/events.json"
node "$HERE/tools/camspeed.mjs" "$HERE/out/camspeed.json"
"$PY" -I "$HERE/audio/compose.py"
"$PY" -I "$HERE/audio/foley.py" "$HERE/out/events.json" "$HERE/out/camspeed.json" "$HERE/music/harmony.json" "$HERE/out/sfx.wav"
"$PY" -I "$HERE/audio/mix.py" "$HERE/music/score.wav" "$HERE/out/sfx.wav" "$HERE/out/mix.wav" -4

# picture and master (mux.sh brings the mix to -14 LUFS)
node "$HERE/tools/frames.mjs" --fps $FPS --workers $WORKERS --q "n=$N"          # resumable: rerun after a crash and it carries on
(cd "$HERE/out/frames" && ffmpeg -v error -y -framerate $FPS -i f_%05d.jpg -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p ../video.mp4)
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" $FPS 0

# subtitles, reading time, poster
python3 -c "import json;L=json.load(open('$HERE/vo/timeline.json'))['lines'];json.dump([{'t0':l['t0'],'t1':l['t1']+.35,'text':l['zh']} for l in L],open('$HERE/out/cues.json','w'))"
"$PY" core/render/srt.py "$HERE/out/cues.json" "$HERE/$NAME.srt"
node core/render/readcheck.mjs "$HERE" > "$HERE/out/readcheck.txt" && echo "readcheck ok" || { tail -20 "$HERE/out/readcheck.txt"; exit 1; }
node core/render/still.mjs "$HERE" $POSTER --q "nosub=1&n=$N" --out "$HERE/out" --prefix poster_
mv "$HERE/out/poster_$POSTER.jpg" "$HERE/poster.jpg"
echo "done: $HERE/$NAME.mp4"
