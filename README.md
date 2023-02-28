# Plan Général

**Table des matières**

# Contexte

<aside>
💡 Projet FISC = Files Infrastruture Sharing Cloud

</aside>

## Besoin de l’entreprise

Migrer le stockage des fichiers partagés en local de l’entreprise sur une solution de partage SaaS.

Besoins :

- Partager les fichiers
- Répartir les droits
- Sécuriser les données
- Avoir une sauvegarde

## Objectif

Déployer une solution de partage de fichier pour une entreprise en quelques “clics”.

Possibilité de personnaliser l’infrastructure (création de comptes, mise en cluster etc..)

Le tous disponible depuis une interface web

## Index des technos

- Docker
- Ansible
- Terraform
- React + JS

## Tableau Comparatif des solutions

| Solutions | Avantages | Inconvénients |
| --- | --- | --- |
| Nextcloud | -Interopérabilité avec de nombreux autres services et protocoles (CalDAV, CardDAV, etc.)
- Forte communauté et soutien développeur
- Grande variété d'applications disponibles (y compris des applications tierces)
- Possibilité de l'héberger soi-même ou de l'utiliser en tant que service hébergé | - Configuration et administration plus compliquées que d'autres options similaires
- Certaines fonctionnalités peuvent nécessiter des connaissances en développement
- Certaines applications peuvent nécessiter des connaissances en développement |
| CozyCloud | - Interface utilisateur simple et intuitive
- Fonctionnalités de gestion de la vie privée robustes
- Gratuite pour une utilisation personnelle
- Possibilité de l'héberger soi-même | - Moins d'applications disponibles que Nextcloud ou Owncloud
- Moins de soutien développeur que Nextcloud
- Configuration et administration plus compliquées que d'autres options similaires |
| Owncloud | -Interopérabilité avec de nombreux autres services et protocoles (CalDAV, CardDAV, etc.)
- Grande variété d'applications disponibles (y compris des applications tierces)
- Possibilité de l'héberger soi-même ou de l'utiliser en tant que service hébergé | -Configuration et administration plus compliquées que d'autres options similaires
- Certaines fonctionnalités peuvent nécessiter des connaissances en développement
- Certaines applications peuvent nécessiter des connaissances en développement
- Moins de soutien développeur et moins de mises à jour que Nextcloud |

Automatisation via Ansible

| Système | Possibilités d'automatisation avec Ansible |
| --- | --- |
| Nextcloud | Forte intégration avec Ansible. De nombreux modules Ansible disponibles pour Nextcloud, ainsi que des scripts et des exemples de playbooks pour automatiser le déploiement et la maintenance. |
| Owncloud | Peut être automatisé avec Ansible. Il peut être nécessaire de développer des scripts ou des playbooks Ansible spécifiques pour Owncloud car il n’y en a pas beaucoup existant. Une fois en place, ils peuvent fournir une automatisation solide pour le système. |
| Cozycloud | La possibilité d'automatiser Cozycloud avec Ansible est limitée par le nombre de scripts et des playbooks Ansible disponibles pour ce système. Il  y a peu de modules Ansible ou de scripts disponibles pour Cozycloud par rapport à Nextcloud ou Owncloud, ce qui peut rendre l'automatisation avec Ansible plus difficile. |

[Taches Suivi de Projet](https://www.notion.so/d9917e0bb1c14faeab48efe2f4b795bb)













# fisc

# Contexte

<aside>
💡 Projet FISC = Files Infrastruture Sharing Cloud
</aside>

## Besoin de l’entreprise

Migrer le stockage des fichiers partagés en local de l’entreprise sur une solution de partage SaaS.

Besoins :

- Partager les fichiers
- Répartir les droits
- Sécuriser les données
- Avoir une sauvegarde

## Objectif

Déployer une solution de partage de fichier pour une entreprise en quelques “clics”.

Possibilité de personnaliser l’infrastructure (création de comptes, mise en cluster etc..)

Le tous disponible depuis une interface web

## Index des technos

- Docker
- Ansible
- Terraform
- React + JS
