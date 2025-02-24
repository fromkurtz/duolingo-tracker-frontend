document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://duolingo-tracker-backend.onrender.com"; // URL do backend no Render
    const downloadBtn = document.getElementById("downloadBtn");
    const loading = document.getElementById("loading");
    const listaDiv = document.getElementById("listaResultados");
    const resultadosDiv = document.getElementById("resultados");

    function enviarDados() {
        const users = document.getElementById("users").value.split("\n").map(u => u.trim()).filter(u => u);
        const meta_xp = document.getElementById("meta_xp").value;

        // Validação dos dados
        if (users.length === 0 || !meta_xp) {
            alert("⚠ Preencha todos os campos antes de continuar.");
            return;
        }

        // Oculta o botão de download e exibe o loader
        downloadBtn.classList.add("hidden");
        loading.classList.remove("hidden");
        resultadosDiv.classList.add("hidden"); // Esconde a div de resultados antes de carregar

        // Faz a requisição para o back-end
        fetch(`${API_URL}/processar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ users: users, meta_xp: parseInt(meta_xp) }) // Converte meta_xp para número
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta do back-end:", data);

            // Exibe o botão de download se a planilha foi gerada
            if (data.file_url) {
                downloadBtn.href = `${API_URL}${data.file_url}`; // Ajusta para a URL completa do Render
                downloadBtn.classList.remove("hidden"); // Exibe o botão de download
            }

            // Exibe os resultados se houver dados
            if (data.dados && data.dados.length > 0) {
                mostrarListaXP(data.dados);
                resultadosDiv.classList.remove("hidden"); // Mostra a div de resultados
            }

            // Exibe uma mensagem de sucesso
            alert(data.message || "Dados processados com sucesso!");
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Ocorreu um erro ao processar os dados. Verifique o console para mais detalhes.");
        })
        .finally(() => {
            loading.classList.add("hidden"); // Esconde o loader, independentemente do resultado
        });
    }

    function mostrarListaXP(dados) {
        listaDiv.innerHTML = ""; // Limpa o conteúdo anterior

        let table = `<table class="w-full border-collapse border border-gray-300 dark:border-gray-700 mt-4">
            <thead>
                <tr class="bg-gray-200 dark:bg-gray-700">
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">Usuário</th>
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">XP Total</th>
                    <th class="border border-gray-300 dark:border-gray-600 px-4 py-2">Meta XP</th>
                </tr>
            </thead>
            <tbody>`;

        dados.forEach(user => {
            table += `<tr>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["Usuário"]}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["XP Total"]}</td>
                <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${user["Meta XP"]}</td>
            </tr>`;
        });

        table += `</tbody></table>`;
        listaDiv.innerHTML = table;
    }

    // Adiciona o evento ao botão apenas quando o DOM estiver carregado
    document.querySelector("button").addEventListener("click", enviarDados);
});