---
layout: base.njk
title: Work
permalink: "/"
---

### GAMES

{% for game in collections.games %}
{% gameOverlay game.data.screenshot, game.data.alt, game.data.title + " (" + game.data.year + ")", (game.url | url), game.data.role %}
{% endfor %}


## OTHER WORK

{% gameOverlay "src/screenshots/talk.png", "talk screenshot", "CURATING THE WORLD OF BABY STEPS - TALK (2026)", "https://gdcvault.com/play/1035806/Curating-the-World-of-Baby" %}


{% gameOverlay "src/screenshots/fifthtrailer.jpg", "talk screenshot", "DESPELOTE: FIFTH TRAILER (2026)", "https://www.youtube.com/watch?v=_MXKlgMZ3Jc" %}

