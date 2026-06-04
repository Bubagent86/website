---
layout: base.njk
title: Work
permalink: "/"
---

## GAMES

{% for game in collections.games %}
{% gameOverlay game.data.screenshot, game.data.alt, game.data.title + "  " + game.data.year + "", (game.url | url), game.data.role %}
{% endfor %}


## OTHER WORK

{% for item in collections.otherWork %}
{% gameOverlay item.data.screenshot, item.data.alt, item.data.title + "  " + item.data.year + "", (item.url | url), item.data.role %}
{% endfor %}

