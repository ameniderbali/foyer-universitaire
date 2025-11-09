export class ChambreModel {
	idChambre: number;
	numeroChambre: number;
	typeC: TypeChambre;

	constructor() {
		this.idChambre = 0;
		this.numeroChambre = 0;
		this.typeC = 1;
	}

}

export enum TypeChambre {
	SIMPLE,
	DOUBLE,
	TRIPLE
}

export interface IChambreList {
	idChambre: number;
	numeroChambre: number;
	typeC: string;
}

