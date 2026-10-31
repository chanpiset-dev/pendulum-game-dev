# The Physics Behind Pendulum Game

A beginner-friendly English guide to the actual v0.1.0 implementation, tag
`v0.1.0`, commit `6335b08f56a9b66a5734fd4dfe7955ccbdf334e0`.

## Files

- `pendulum-physics.pdf`: finished guide.
- `pendulum-physics.tex`: editable LaTeX source, with vector TikZ diagrams.
- `figures/*.pdf`: numerical plots embedded in the guide.
- `figures/model-data.json`: raw numerical data from the game's solver.
- `generate-data.mjs` and `figures/make-plots.py`: optional reproduction scripts.

## Build the PDF

Use a reasonably complete TeX Live installation with TikZ/PGF, tcolorbox,
amsmath, lmodern, microtype, hyperref and the standard table/layout packages.
Run from this directory:

```sh
pdflatex -interaction=nonstopmode -halt-on-error pendulum-physics.tex
pdflatex -interaction=nonstopmode -halt-on-error pendulum-physics.tex
pdflatex -interaction=nonstopmode -halt-on-error pendulum-physics.tex
```

Existing plot PDFs make a LaTeX-only rebuild self-contained; Node and Python are
not needed unless you want to regenerate numerical plots.

## Regenerate plots (optional)

Use Node.js and Python with NumPy/Matplotlib. Check out the release solver at the
commit above before regenerating, so the figures describe the same implementation.

```sh
node generate-data.mjs /path/to/pendulum-game-dev
MPLCONFIGDIR=/tmp/pendulum-mpl python figures/make-plots.py
```

These experiments deliberately switch damping off and omit stage event rules.
Their assumptions and parameters are explained in the PDF. All schematic diagrams
are original vector drawings; they illustrate concepts rather than reproducing a
particular stage layout to scale.
