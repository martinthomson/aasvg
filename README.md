# empty-goat

This is a direct port of the diagram rendering from
[markdeep](https://casual-effects.com/markdeep/) to nodejs.

This is inspired by [goat](https://github.com/blampe/goat) but rather than a
reimplementation, this code uses the original markdeep code.

## Usage

Install with `npm install -g aasvg`.

Feed `aasvg` with an image and it will write an SVG.  For example:

```
$ aasvg < example.txt > example.svg
```

## Changes

By default, this does not place text characters on a grid one-by-one.  This
improves accessibility at the cost of having characters less precisely placed.
The textGrid option can be used to enable precise placement.
