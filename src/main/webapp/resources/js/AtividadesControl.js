var WidgetAtividadesControl = SuperWidget.extend({
    //método iniciado quando a widget é carregada
    init: function () {
        intervalAutoRefresh = null;
        LoadingCarregandoRelatorio = FLUIGC.loading('#divListaAtividades');

        setMesEAnoParaAtual();
        ExecutaRelatorio();
        setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh);
        $("#panelFiltros .panel-body").hide();
        $("#MedicoesInseridas, #MedicoesAprovadas, #ParcelasAprovadas, #ContratosAditivosRescisoes, #EnvioDasMedicoes").hide();


        $("#autoRefresh").on("change", function () {
            setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh);
        });
        $("#panelFiltros .panel-heading").on("click", function () {
            $("#panelFiltros .panel-body").slideToggle();
        });
        $("#Relatorio, #MesFiltro, #AnoFiltro").on("change", function () {
            ExecutaRelatorio();
        });
        $("#btnExportarDados").on("click", function () {
            ExportarDados();
        });
    }
});



function setIntevaloDeExecucaoDoRelatorio(intervalAutoRefresh) {
    clearInterval(intervalAutoRefresh);

    if ($("#autoRefresh").val() != "Desativado") {
        intervalAutoRefresh = setInterval(() => {
            ExecutaRelatorio();
        }, $("#autoRefresh").val() * 60 * 1000);
    }
}

async function ExecutaRelatorio() {
    LoadingCarregandoRelatorio.show();

    var relatorio = $("#Relatorio").val();
    $("#MedicoesInseridas, #MedicoesAprovadas, #ParcelasAprovadas, #ContratosAditivosRescisoes, #AtividadesControl, #EnvioDasMedicoes").hide();

    if (relatorio == "Todas as Atividades") {
        await CriaListaAtividadeControl();
        $("#AtividadesControl").show();
    }
    else if (relatorio == "Inserção de Medições") {
        await CriaListaDeMedicoesInseridas();
        $("#MedicoesInseridas").show();
    }
    else if (relatorio == "Aprovação de Medição") {
        await CriaListaDeMedicoesAprovadas();
        $("#MedicoesAprovadas").show();
    }
    else if (relatorio == "Aprovação de Parcelas(1.1.98)") {
        await CriaListaDeAprovacoesDeParcelas();
        $("#ParcelasAprovadas").show();
    }
    else if (relatorio == "Contratos, Aditivos e Rescisões") {
        await CriaListaDeContratosAditivosRescisoes();
        $("#ContratosAditivosRescisoes").show();
    }
    else if (relatorio == "Envio das Medições") {
        await CriaListaDeEnvioDasMedicoes();
        $("#EnvioDasMedicoes").show();
    }

    LoadingCarregandoRelatorio.hide();
}

async function CriaListaAtividadeControl() {
    var ListaDeAtividades = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';

    const SeMostraColunaHoje = ValidaSeMesEAnoSaoOsAtuais();

    stringHTML +=
        "<tr>\
        <td>Recebimento Fiscal</td>\
        <td>" + ListaDeAtividades[0].Parcelas + "</td>\
        " + (SeMostraColunaHoje ? "<td>" + ListaDeAtividades[0].ParcelasHoje + "</td>" : "") + "\
    </tr>";

    stringHTML +=
        "<tr>\
        <td>Medições Inseridas</td>\
        <td>" + ListaDeAtividades[0].MedicoesInseridas + "</td>\
        " + (SeMostraColunaHoje ? "<td>" + ListaDeAtividades[0].MedicoesInseridasHoje + "</td>" : "") + "\
    </tr>";

    stringHTML +=
        "<tr>\
        <td>Medições Aprovadas</td>\
        <td>" + ListaDeAtividades[0].MedicoesAprovadas + "</td>\
        " + (SeMostraColunaHoje ? "<td>" + ListaDeAtividades[0].MedicoesAprovadasHoje + "</td>" : "") + "\
    </tr>";

    stringHTML +=
        "<tr>\
        <td>Contratos, Aditivos e Rescisões</td>\
        <td>" + ListaDeAtividades[0].ContratosAditivosRescisoes + "</td>\
        " + (SeMostraColunaHoje ? "<td>" + ListaDeAtividades[0].ContratosAditivosRescisoesHoje + "</td>" : "") + "\
    </tr>";


    if (SeMostraColunaHoje) {
        $("#columnHoje").show();
    }
    else {
        $("#columnHoje").hide();
    }

    $("#tbodyAtividadesControl").html(stringHTML);

    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val().padStart(2, '0');
        var ano = $("#AnoFiltro").val();
        var dia = new Date().getDate().toString().padStart(2, '0');


        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "AtividadesControl", "AtividadesControl", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST),
            DatasetFactory.createConstraint("Dia", dia, dia, ConstraintType.MUST)
        ], null);
    }
}

async function CriaListaDeMedicoesAprovadas() {
    var ListaDeMedicoes = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';
    for (const Medicao of ListaDeMedicoes) {
        stringHTML += "<tr>";
        stringHTML += "<td>" + Medicao.DATA.split("-").reverse().join("/") + "</td>";
        stringHTML += "<td>" + Medicao.MEDICOES + "</td>";
        stringHTML += "</tr>";
    }

    $("#tbodyMedicoesAprovadas").html(stringHTML);
    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val();
        var ano = $("#AnoFiltro").val();
        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "SolicitacoesDeMedicaoAprovadas", "SolicitacoesDeMedicaoAprovadas", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST)
        ], null);
    }
}

async function CriaListaDeMedicoesInseridas() {
    var ListaDeMedicoes = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';
    for (const Medicao of ListaDeMedicoes) {
        stringHTML += "<tr>";
        stringHTML += "<td>" + Medicao.DATA.split("-").reverse().join("/") + "</td>";
        stringHTML += "<td>" + Medicao.MEDICOES + "</td>";
        stringHTML += "</tr>";
    }

    $("#tbodyMedicoesInseridas").html(stringHTML);
    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val();
        var ano = $("#AnoFiltro").val();
        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "SolicitacoesDeMedicaoInseridas", "SolicitacoesDeMedicaoInseridas", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST)
        ], null);
    }
}

async function CriaListaDeAprovacoesDeParcelas() {
    var ListaDeParcelas = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';
    for (const Parcela of ListaDeParcelas) {
        stringHTML += "<tr>";
        stringHTML += "<td>" + Parcela.DATA.split("-").reverse().join("/") + "</td>";
        stringHTML += "<td>" + Parcela.PARCELAS + "</td>";
        stringHTML += "</tr>";
    }

    $("#tbodyParcelasAprovadas").html(stringHTML);
    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val();
        var ano = $("#AnoFiltro").val();
        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "SolicitacoesDeMedicaoApAprovacoesDeParcelasrovadas", "SolicitacoesDeMedicaoApAprovacoesDeParcelasrovadas", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST)
        ], null);
    }
}

async function CriaListaDeContratosAditivosRescisoes() {
    var ListaAtividades = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';
    for (const Dia of ListaAtividades) {
        stringHTML += "<tr>";
        stringHTML += "<td>" + Dia.DATA.split("-").reverse().join("/") + "</td>";
        stringHTML += "<td>" + Dia.ADITIVOS + "</td>";
        stringHTML += "<td>" + Dia.CONTRATOS + "</td>";
        stringHTML += "<td>" + Dia.RESCISÔES + "</td>";
        stringHTML += "</tr>";
    }

    $("#tbodyContratosAditivosRescisoes").html(stringHTML);
    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val();
        var ano = $("#AnoFiltro").val();
        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "SolicitacoesDeContratosAditivosRescisoes", "SolicitacoesDeContratosAditivosRescisoes", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST)
        ], null);
    }
}

async function CriaListaDeEnvioDasMedicoes() {
    var ListaMedicoesEnviadas = await BuscaListagemDasAtividadesDaControladoria();
    var stringHTML = '';
    for (const Dia of ListaMedicoesEnviadas) {
        stringHTML += "<tr>";
        stringHTML += "<td>" + Dia.DATA.split("-").reverse().join("/") + "</td>";
        stringHTML += "<td>" + Dia.OBRA + "</td>";
        stringHTML += "<td>" + Dia.SOLICITANTE + "</td>";
        stringHTML += "<td>" + Dia.QUANTIDADE + "</td>";
        stringHTML += "</tr>";
    }

    $("#tbodyEnvioDasMedicoes").html(stringHTML);
    async function BuscaListagemDasAtividadesDaControladoria() {
        var mes = $("#MesFiltro").val();
        var ano = $("#AnoFiltro").val();
        return await ExecutaDataset("ListaAtividadesDaControladoriaNoFluig", null, [
            DatasetFactory.createConstraint("Operacao", "DataDeEnvioDasMedicoes", "DataDeEnvioDasMedicoes", ConstraintType.MUST),
            DatasetFactory.createConstraint("Mes", mes, mes, ConstraintType.MUST),
            DatasetFactory.createConstraint("Ano", ano, ano, ConstraintType.MUST)
        ], null);
    }
}

function setMesEAnoParaAtual() {
    var dateNow = new Date();
    $("#MesFiltro").val(dateNow.getMonth() + 1);
    $("#AnoFiltro").val(dateNow.getFullYear());

}

function ExportarDados() {
    var relatorio = $("#Relatorio").val();

    if (relatorio == "Todas as Atividades") {
        exportTableToCsv("AtividadesControl", "AtividadesControl");
    }
    else if (relatorio == "Inserção de Medições") {
        exportTableToCsv("MedicoesInseridas", "MedicoesInseridas");
    }
    else if (relatorio == "Aprovação de Medição") {
        exportTableToCsv("MedicoesAprovadas", "MedicoesAprovadas");
    }
    else if (relatorio == "Aprovação de Parcelas(1.1.98)") {
        exportTableToCsv("ParcelasAprovadas", "ParcelasAprovadas");
    }
    else if (relatorio == "Contratos, Aditivos e Rescisões") {
        exportTableToCsv("ContratosAditivosRescisoes", "ContratosAditivosRescisoes");
    }
    else if (relatorio == "Envio das Medições") {
        exportTableToCsv("EnviodasMedições", "EnvioDasMedicoes");
    }


    function exportTableToCsv(filename, target) {
        var csv = [];
        var rows = document.querySelectorAll("#" + target + " tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) {
                row.push(cols[j].innerText);
            }

            csv.push(row.join(";"));
        }

        // Cria um elemento <a> invisível
        var link = document.createElement("a");
        link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv.join("\n")));
        link.setAttribute("download", filename);

        // Simula o clique no link para iniciar o download
        link.click();
    }
}

function ExecutaDataset(DatasetName, Fields, Constraints, Order) {
    return new Promise((resolve, reject) => {
        DatasetFactory.getDataset(DatasetName, Fields, Constraints, Order, {
            success: (ds => {
                console.log(ds)
                if (!ds || !ds.values || ds.values.length == 0 || ds.values[0][0] == "deu erro! ") {
                    $("#MedicoesInseridas, #MedicoesAprovadas, #ParcelasAprovadas, #ContratosAditivosRescisoes").hide();

                    console.error("Erro ao executar o Dataset: " + DatasetName);
                    console.error(ds);
                    FLUIGC.toast({
                        title: "Erro ao executar o Dataset: " + DatasetName,
                        message: "",
                        type: "warning"
                    });
                    reject();
                }
                else {
                    resolve(ds.values);
                }
            }),
            error: (e => {
                console.error("Erro ao executar o Dataset: " + DatasetName);
                console.error(e);
                FLUIGC.toast({
                    title: "Erro ao executar o Dataset: " + DatasetName,
                    message: "",
                    type: "warning"
                });
                reject();
            })
        })
    });
}

function ValidaSeMesEAnoSaoOsAtuais() {
    var Mes = $("#MesFiltro").val();
    var Ano = $("#AnoFiltro").val();
    var dateNow = new Date();

    if (parseInt(Mes) == (dateNow.getMonth() + 1) && parseInt(Ano) == dateNow.getFullYear()) {
        return true;
    }
    return false;
}