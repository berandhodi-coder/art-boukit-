# Configuration de Supabase & Commandes Cash on Delivery — Art Bouquet

Ce guide détaille la mise en place de la base de données Supabase, l’application des migrations SQL et le modèle de sécurité pour les commandes en espèces à la livraison (Cash on Delivery).

---

## 1. Création du projet Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com) et connectez-vous.
2. Créez une nouvelle organisation ou sélectionnez votre organisation existante.
3. Cliquez sur **New project**.
4. Renseignez :
   - **Name** : `art-bouquet-store`
   - **Database Password** : Définissez un mot de passe fort et conservez-le.
   - **Region** : Choisissez la région la plus proche de votre audience marocaine (ex: `eu-west-1` / `eu-central-1` ou `eu-west-3` Paris).
5. Patientez pendant l'initialisation du projet (environ 1 minute).

---

## 2. Variables d'environnement requises

Dans votre tableau de bord Supabase :
- Allez dans **Project Settings** > **API**.

Créez un fichier `.env.local` à la racine de `art-bouquet-store` (à partir du modèle `.env.example`) :

```bash
# 1. URL publique de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co

# 2. Clé anonyme (publique)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 3. Clé secrète de service (SECRET SERVEUR UNIQUE)
# Trouvée dans Project Settings > API > Project API keys > "service_role" (secret)
# IMPORTANT : Ne JAMAIS préfixer par NEXT_PUBLIC_ ni exposer au navigateur.
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 3. Application de la migration SQL

La migration est stockée dans :
`supabase/migrations/20261111000000_create_orders_schema.sql`

### Méthode via l'interface Supabase Studio (SQL Editor)
1. Dans le tableau de bord Supabase, cliquez sur **SQL Editor** dans le menu latéral gauche.
2. Cliquez sur **+ New query**.
3. Copiez l'intégralité du contenu du fichier `supabase/migrations/20261111000000_create_orders_schema.sql`.
4. Collez le code dans l'éditeur SQL et cliquez sur **Run** (ou `Ctrl+Enter`).
5. Vérifiez l'affichage du message `Success. No rows returned`.

### Tables créées
- **`public.orders`** : Table principale des commandes (référence unique, coordonnées client, ville, adresse, sous-total, statut `cod` / `pending`, frais de livraison et montant total `NULL` au départ).
- **`public.order_items`** : Instantanés historiques de chaque création florale commandée (ID, nom, prix unitaire en MAD, quantité, sous-total de ligne).

---

## 4. Modèle de sécurité et Row Level Security (RLS)

Pour garantir la confidentialité stricte des clients et des commandes :
1. **RLS activé** sur `orders` et `order_items`.
2. **Accès public en lecture (SELECT) refusé** (`TO anon, authenticated USING (false)`).
   - Les visiteurs anonymes et le navigateur ne peuvent en aucun cas lister ni inspecter les commandes d'autres clients.
3. **Accès direct en écriture (INSERT / UPDATE / DELETE) refusé au public**.
4. **Insertion sécurisée côté serveur** :
   - Le serveur Next.js (Server Action `submitOrder`) vérifie le panier par rapport au catalogue authentique, recalcule les prix côté serveur, génère une référence de commande non devinable (`AB-XXXX-XXXXXX`), puis insère la commande via la clé secrète `SUPABASE_SERVICE_ROLE_KEY` ou la fonction PostgreSQL transactionnelle `create_order_with_items`.

---

## 5. Politique des frais de livraison (Status "À confirmer")

Conformément aux règles de gestion de la Maison Art Bouquet :
- Les frais de livraison exacts par ville marocaine (Casablanca, Rabat, Marrakech, Tanger, etc.) ne sont pas figés dans l'interface et dépendent de l'adresse exacte et des créneaux.
- En base de données : `delivery_fee_mad` est enregistré à `NULL` et `total_amount_mad` reste à `NULL`.
- Le système **ne prétend jamais** que la livraison est gratuite.
- Le client est explicitement averti que le montant exact des frais lui sera communiqué par appel téléphonique de confirmation avant expédition.
- Lors de l'appel téléphonique, l'administrateur de la boutique met à jour la commande avec les frais convenus.

---

## 6. Test d'une commande réelle

1. Assurez-vous que `.env.local` est configuré avec vos clés Supabase.
2. Démarrez le serveur (`npm run dev`).
3. Ajoutez un bouquet au panier depuis `/bouquets` ou `/bouquets/rose-marrakech`.
4. Rendez-vous sur `/checkout`.
5. Renseignez un nom (ex: `Kawtar Benjelloun`) et un numéro marocain valide (ex: `06 61 22 33 44`).
6. Sélectionnez une ville (ex: `Casablanca`) et une adresse.
7. Cochez l'acceptation des conditions et cliquez sur **Confirmer ma commande**.
8. Vous êtes redirigé vers `/order-confirmation?ref=AB-...` et le panier est vidé.
9. Dans Supabase Studio > **Table Editor** > `orders`, vérifiez que la ligne apparaît bien avec `payment_method = 'cod'`, `subtotal_mad`, et ses lignes associées dans `order_items`.
