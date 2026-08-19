# My Notes

A personal wiki / commonplace book / digital garden.

## Writing an article

Create a Markdown file in:

content/articles/

The first line should be the title:

# Evolution

Immediately after the title, declare its topics:

topics:
  - Biology
  - Science > Biology
  - Philosophy > Philosophy of Science

Then leave a blank line and start writing.

## Internal links

Link to another article using:

[[Evolution]]

You can also give the link different text:

[[Evolution|the theory of evolution]]

The article must exist somewhere in `content/articles/`.

## External links

Normal Markdown links work:

[Wikipedia](https://wikipedia.org)

## Footnotes

Use Markdown footnotes:

Something worth citing.[^1]

[^1]: Author, *Book*, Publisher, 2024.

## Topics

Topics can be nested with `>`:

Science
Science > Biology
Science > Biology > Genetics
Science > Physics
History
History > Ancient History

An article can have multiple topics:

topics:
  - Science > Biology
  - Philosophy > Philosophy of Science
  - History

The article will appear in every relevant branch.

## Building locally

Install dependencies:

npm install

Build:

npm run build

The generated site will be in:

_site/

To preview it:

npm run dev

## Publishing

Push to `main`.

GitHub Actions will build and deploy the site automatically.
