export class FoyerModel {
  idFoyer: number = 0;
  nomFoyer: string = "";
  capaciteFoyer: number = 0;
  blocs: any[] = [];
}

export interface IFoyerList {
  idFoyer: number;
  nomFoyer: string;
  capaciteFoyer: number;
  blocs: any[];
}