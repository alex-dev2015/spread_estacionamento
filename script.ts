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
    
    function tabValue(tempo: number){
        if (tempo <= 15) {
            return 0;
        }else{
            return 1;
        }
    }
    
    function clearInput(){
        $("#nome").value = "";
        $("#placa").value = "";
        $("#lojista").checked = false;

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
                <td class="center">${veiculo.placa}</td>
                <td data-time="${veiculo.entrada}">
                    ${veiculo.entrada.toLocaleString("pt-BR", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                </td>
                <td>${veiculo.usuario}</td>
                <td class="center">
                    <button class="button-delete" 
                            data-placa="${veiculo.placa}">delete
                    </button>
                </td>
            `;

            row.querySelector(".button-delete")?.addEventListener("click", function (){
                remover(this.dataset.placa)
            });

            $("#patio")?.appendChild(row);

         
           if(salva) salvar([...ler(), veiculo]);

        }
        function remover(placa: string){
            const { entrada, nome} = ler().find((veiculo) => veiculo.placa === placa);

            const tempo =  calcTempo(new Date().getTime() - new Date(entrada).getTime());

            const licenciado = ler().filter((cliente) => cliente.placa == placa)
                    .find(element => element.usuario !== 'Cliente');

            if (licenciado) {
                alert('Acesso liberado!');
            }else{

                const total = tabValue(parseInt(tempo));
            
                if(total == 0){
                    if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. \n Saída Liberada!`)) return;
                }else{
                    if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. \n Total a pagar: R$ = 5,00!`)) return;
                }
                
            }

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

    $("#button-input")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        const check = $("#lojista")?.checked;
        let usuario = "Cliente";
       

        if (check) usuario = "Lojista";
        
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
            
        

        patio().adicionar({ nome, placa, entrada: new Date().toISOString(), usuario }, true);
        clearInput();
    });
})();