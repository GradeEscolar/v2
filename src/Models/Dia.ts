export default class Dia {
    dia: number;
    nome: string;
    ativo: boolean;

    constructor() {
        this.dia = 2;
        this.nome = 'segunda-feira'
        this.ativo = true
    }

    static dias(): Dia[] {
        return [
            { dia: 2, nome: 'segunda-feira', ativo: false },
            { dia: 3, nome: 'terça-feira', ativo: false },
            { dia: 4, nome: 'quarta-feira', ativo: false },
            { dia: 5, nome: 'quinta-feira', ativo: false },
            { dia: 6, nome: 'sexta-feira', ativo: false },
            { dia: 7, nome: 'sábado', ativo: false },
            { dia: 1, nome: 'domingo', ativo: false }
        ];
    }

    static meses(): string[] {
        return [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
    }

    static montarTodos(dias: string): Dia[] {
        let todos = this.dias();
        todos.forEach(t => t.ativo = dias.indexOf(t.dia.toString()) != -1);
        return todos;
    }

    static montarAtivos(dias: string): Dia[] {
        return this.dias().filter(t => dias.indexOf(t.dia.toString()) != -1);
    }

    static desmontar(dias: Dia[]): string {
        return dias.filter(d => d.ativo).map(d => d.dia.toString()).join(';');
    }

    static obterDia(isoDate: string): Dia | undefined {
        let dt = new Date(`${isoDate}T00:00:00.000-03:00`);
        let dia = dt.getDay() + 1;
        let dias = this.dias();
        return dias.find(d => d.dia == dia);
    }

    static dataAtual(): Date {
        return new Date(Date.now() - 180 * 60 * 1000);
    }

    static mesAtual(): string {
        let data = this.dataAtual();
        return data.toISOString().substring(0, 7);
    }

    static obterMes(data: Date): string {
        return data.toISOString().substring(0, 7);
    }

    static dataCompleta(data: Date): string {
        return `${this.dias().find(d => d.dia == data.getDay() + 1)!.nome}, ${data.getDate()} de ${this.meses()[data.getMonth()]} de ${data.getFullYear()}`;
    }
}