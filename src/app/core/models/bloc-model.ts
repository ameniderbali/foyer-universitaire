export class BlocModel {
	idBloc: number;
	nomBloc: string;
	capaciteBloc: number;

	constructor() {
		this.idBloc = 0;
		this.nomBloc = "";
		this.capaciteBloc = 0;
	}

}

export interface IBlocList {
	idBloc: number;
	nomBloc: string;
	capaciteBloc: number;
}

