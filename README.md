# aasvg

Convert ASCII art diagrams into SVG.

This uses a heavily modified copy of
[markdeep](https://casual-effects.com/markdeep/).

## Usage

Install with `npm install -g aasvg`.

Feed `aasvg` an image and it will write an SVG.  For example:

```
$ aasvg < example.txt > example.svg
```

![example](./example.svg)


## Controlling Character Placement

By default, this does not place text characters on a grid one-by-one
as the original markdeep code did.

The **spaces** command-line option controls how text is merged.
By default, `spaces=1` ensures that text is split at every space.
Merging strings that contain spaces is achieved with `spaces=2` or higher.

Use either `spaces=0` to disable text merging,
with every character placed individually,
unless it is recognized as a graphic.
THis is precise and avoids text distortion, but makes for a larger SVG
that is harder to search and less accessible to screen readers.

Long spans of text can end up being either too wide or too narrow
because the font metrics will not precisely match the grid used (16px wide).

The **stretch** option stretches text to fit.
This might not be supported in some viewers,
but the main reason not to use it is the small distortion to the text.


## Display Tweaking

These options change how things are displayed in various ways.

* **fill** drops the `width` and `height` attributes on the output SVG.
  This will cause it to expand to fit available space.

* **width=n** and **height=n** directly set `width` and `height`
  on the SVG, specified in characters.
  If the value you set smaller than the input, the SVG will overflow.
  If large, padding will be added to the right or bottom of the image.

* **arrow=line** changes arrowheads to be lines, rather than solid.
  **arrow=solid** is the default, which has fille triangle arrowheads.

* **key=value**, if not recognized as another option,
  will set attributes on the output SVG.
  Note that some styling attributes will be overridden by the stylesheet,
  which takes precedence over attributes.

* **backdrop** adds a partially transparent backdrop to the image.
  Helpful if you can't rely on light/dark mode working and transparency
  is causing rendering issues.  See also **compatible** below.


## Embedding and Extracting Source

Sometimes, it is useful to have a single file that you can edit.

* **embed** takes the text input and embeds it in the output SVG.

* **extract** indicates that the input contains an SVG that has embedded text,
  as embeeded with the **embed** option.
  That embedded text will be used as input.

To use these, first create a dummy file:

```sh
echo '-->' | aasvg embed > file.svg
```

Then you can edit the file.  Due to the vagaries of stdio,
it is best to use a temporary file.

```sh
tmp=$(mktemp)
aasvg embed extract <file.svg >"$tmp"
mv "$tmp" file.svg
```


## Other Debugging Options

These options help show what is going on internally:

* **disable-text** removes any text elements from the image.
  Sometimes, things like '|' will look like they are proper lines,
  but they are really text, which can be annoying.

* **grid** renders a grid under the image,
  using color to indicate where characters have been turned into
  lines or text.

* **source** renders the input source characters over the image.

* **compatible** avoids features that are known to break some software.
  Presently, this just disables light/dark mode for tools
  like [inkscape](https://inkscape.org), which can't handle CSS `var()`.
