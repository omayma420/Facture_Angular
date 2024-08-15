// Si `FactureItem` est défini dans le même fichier, ajoutez ceci en haut de votre fichier `facture.component.ts` :
interface factureItems {

  reference: string;
  designation: string;
  quantity: number;
  pricePerUnitHT: number;
  tva: number;
  remise: number;
  total: number;
}



