# Compote

Un jeu de fusion de fruits : lâche des fruits dans une caisse, et quand deux fruits pareils se touchent, ils fusionnent en un fruit plus gros. Grimpe de la cerise jusqu'à la citrouille sans que la caisse déborde.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** ou **← →** : viser ; un trait montre où le fruit va tomber.
- **Clic**, **Espace** ou **↓** : lâcher le fruit.
- Le prochain fruit est affiché en haut à droite.

## Règles

- Les fruits tombent, roulent et se poussent comme de vrais objets : les gros écartent les petits.
- Deux fruits **identiques** qui se touchent fusionnent en celui du rang au-dessus, à mi-chemin entre les deux. La fusion peut en déclencher d'autres en cascade.
- On ne lâche que les cinq plus petits fruits (cerise, fraise, raisin, mandarine, pomme) ; les plus gros ne s'obtiennent qu'en fusionnant.
- **Deux citrouilles** qui se touchent disparaissent et rapportent un gros bonus.
- La partie s'arrête quand un fruit reste immobile au-dessus de la ligne rouge pendant environ deux secondes : la ligne clignote pour prévenir.

## Les 11 fruits

Cerise → fraise → raisin → mandarine → pomme → poire → pêche → ananas → melon → pastèque → citrouille. Le panneau **Les fruits** montre l'échelle ; ceux que tu n'as pas encore atteints restent grisés.

## Points

Chaque fusion rapporte d'autant plus que le fruit obtenu est gros : 3 points pour une fraise, 6 pour un raisin… jusqu'à 66 pour une citrouille. Deux citrouilles qui disparaissent valent 178 points.

## Statistiques

Le panneau Records montre ton **meilleur score**, le nombre de **parties** et le **plus gros fruit** jamais obtenu.

## Données et synchronisation

Ton record, tes parties et ton plus gros fruit sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Compote → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
