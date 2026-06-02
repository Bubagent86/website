---
layout: base.njk
title: News
---

# News

{% set posts = collections.news -%}
{% if posts and posts.length -%}
<ul class="post-list">
{%- for post in posts | reverse %}
<li><a href="{{ post.url | url }}">{{ post.data.title }}</a> <time datetime="{{ post.date | dateISO }}">{{ post.date | dateReadable }}</time></li>
{%- endfor %}
</ul>
{%- else %}
No news yet. Check back soon.
{%- endif %}
