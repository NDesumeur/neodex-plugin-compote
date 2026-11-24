# Compote

A fruit-merging game: drop fruit into a crate, and when two identical fruits touch, they merge into a bigger one. Climb from the cherry to the pumpkin without letting the crate overflow.

*Version française : [README.md](README.md)*

## Daily challenge (new in 1.2.0)

The **DAILY CHALLENGE** button starts a game where the fruit sequence (frozen and rotten ones included) is drawn from the date: everyone gets the same fruits all day long, so you can compare. Your best score of the day and your number of tries are kept, and **COPY MY DAILY SCORE** puts a ready-made sentence in the clipboard to send to your friends.

## Controls

- **Mouse** or **← →**: aim; a line shows where the fruit will fall.
- **Click**, **Space** or **↓**: drop the fruit.
- The next fruit is shown at the top right.
- **P**: pause. **Gamepad**: d-pad or left stick to aim, **A** to drop, **Start** to pause.
- **FULLSCREEN**: the crate fills the screen; otherwise it fits the window size.

## Rules

- Fruits fall, roll and push each other like real objects: big ones shove small ones aside.
- Two **identical** fruits that touch merge into the next fruit up, halfway between them. A merge can trigger others in a cascade.
- Only the five smallest fruits are dropped (cherry, strawberry, grape, tangerine, apple); bigger ones only come from merging.
- When merging, the two fruits slide into each other, the new one is born swelling up then settles, and juice splashes.
- **Special fruits** (after the first 15 drops, about one in eight): a **frozen** fruit in its ice cube does not merge until it has melted (about twelve seconds) or a merge has happened right next to it; a **rotten** fruit never merges, it rots away after about twenty seconds, or gets squashed (5 points) when a merge happens against it.
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
