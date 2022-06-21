interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
    usuario : string;
}

(function() {
    const $ = (query: string): HTMLInputElement | null => 
            document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }            

    function patio() {
        function ler():Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        
        function adicionar(veiculo: Veiculo, salva?: boolean){
            const row = document.createElement("tr");

                                    

            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td data-time="${veiculo.entrada}">
                    ${veiculo.entrada.toLocaleString("pt-BR",{
                        hour: "numeric",
                        minute: "numeric",
                    })}
                </td>
                <td>${veiculo.usuario}</td>
                <td>
                    <button class="delete" 
                            data-placa="${veiculo.placa}">x
                    </button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function (){
                remover(this.dataset.placa)
            });

            $("#patio")?.appendChild(row);

           if(salva) salvar([...ler(), veiculo]);

        }
        function remover(placa: string){
            const { entrada, nome} = ler().find((veiculo) => veiculo.placa === placa);

            const tempo =  calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        
        function render(){
            $("#patio")!.innerHTML = '';
            const patio = ler();

            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return { ler, adicionar, remover, salvar, render};

    }    
    
    patio().render();

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        const check = $("#logista")?.checked;
        let usuario = "Cliente";
        

        if (check) usuario = "Logísta";
        
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }

        patio().adicionar({ nome, placa, entrada: new Date().toISOString(), usuario }, true);
    });
})();