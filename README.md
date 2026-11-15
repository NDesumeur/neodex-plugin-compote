# Compote

Un jeu de fusion de fruits : lâche des fruits dans une caisse, et quand deux fruits pareils se touchent, ils fusionnent en un fruit plus gros. Grimpe de la cerise jusqu'à la citrouille sans que la caisse déborde.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Souris** ou **← →** : viser ; un trait montre où le fruit va tomber.
- **Clic**, **Espace** ou **↓** : lâcher le fruit.
- Le prochain fruit est affiché en haut à droite.
- **P** : pause. **Manette** : croix ou stick gauche pour viser, **A** pour lâcher, **Start** pour la pause.
- **PLEIN ÉCRAN** : la caisse prend tout l'écran ; sinon elle s'adapte à la taille de la fenêtre.

## Règles

- Les fruits tombent, roulent et se poussent comme de vrais objets : les gros écartent les petits.
- Deux fruits **identiques** qui se touchent fusionnent en celui du rang au-dessus, à mi-chemin entre les deux. La fusion peut en déclencher d'autres en cascade.
- On ne lâche que les cinq plus petits fruits (cerise, fraise, raisin, mandarine, pomme) ; les plus gros ne s'obtiennent qu'en fusionnant.
- À la fusion, les deux fruits glissent l'un vers l'autre, le nouveau naît en gonflant puis se pose, et le jus gicle.
- **Fruits spéciaux** (après les 15 premiers lâchers, environ un sur huit) : un fruit **gelé** dans son glaçon ne fusionne pas tant qu'il n'a pas fondu (une douzaine de secondes) ou qu'une fusion ne s'est pas faite juste à côté ; un fruit **gâté** ne fusionne jamais, il pourrit et disparaît au bout d'une vingtaine de secondes, ou s'écrase (5 points) quand une fusion se fait contre lui.
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
