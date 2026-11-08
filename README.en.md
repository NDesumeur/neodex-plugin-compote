# Compote

A fruit-merging game: drop fruit into a crate, and when two identical fruits touch, they merge into a bigger one. Climb from the cherry to the pumpkin without letting the crate overflow.

*Version française : [README.md](README.md)*

## Controls

- **Mouse** or **← →**: aim; a line shows where the fruit will fall.
- **Click**, **Space** or **↓**: drop the fruit.
- The next fruit is shown at the top right.

## Rules

- Fruits fall, roll and push each other like real objects: big ones shove small ones aside.
- Two **identical** fruits that touch merge into the next fruit up, halfway between them. A merge can trigger others in a cascade.
- Only the five smallest fruits are dropped (cherry, strawberry, grape, tangerine, apple); bigger ones only come from merging.
- **Two pumpkins** that touch disappear and earn a big bonus.
- The game ends when a fruit stays still above the red line for about two seconds: the line flashes as a warning.

## The 11 fruits

Cherry → strawberry → grape → tangerine → apple → pear → peach → pineapple → melon → watermelon → pumpkin. The **Fruits** panel shows the ladder; those you have not reached yet stay greyed out.

## Points

Each merge is worth more the bigger the resulting fruit: 3 points for a strawberry, 6 for a grape… up to 66 for a pumpkin. Two pumpkins disappearing are worth 178 points.

## Statistics

The Records panel shows your **best score**, the number of **games** and the **biggest fruit** ever made.

## Data and sync

Your record, games and biggest fruit are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Compote → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
