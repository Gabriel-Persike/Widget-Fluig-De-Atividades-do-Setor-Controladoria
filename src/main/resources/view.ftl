<div id="WidgetAtividadesControl_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="WidgetAtividadesControl.instance()">
    <script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>


    <h3>Atividades Controladoria</h3>
    <div id="FiltrosData" class="row">
        <div class="col-md-6">
            <label for="MesFiltro">Mês:</label>
            <select name="MesFiltro" id="MesFiltro" class="form-control">
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
            </select>
        </div>
        <div class="col-md-6">
            <label for="AnoFiltro">Ano:</label>
            <select name="AnoFiltro" id="AnoFiltro" class="form-control">
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
            </select>
        </div>
    </div>
    <div id="FiltroRelatorio" class="row">
        <div class="col-md-12">
            <label for="Relatorio">Relatório:</label>
            <select name="Relatorio" id="Relatorio" class="form-control">
                <option value="Todas as Atividades">Todas as Atividades</option>
                <option value="Inserção de Medições">Inserção de Medições</option>
                <option value="Aprovação de Medição">Aprovação de Medição</option>
                <option value="Aprovação de Parcelas(1.1.98)">Aprovação de Parcelas(1.1.98)</option>
                <option value="Contratos, Aditivos e Rescisões">Contratos, Aditivos e Rescisões</option>
                <option value="Envio das Medições">Envio das Medições</option>
            </select>
        </div>
    </div>
    <br>
    <div id="divListaAtividades">
        <div id="MedicoesInseridas">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>QNTD</th>
                    </tr>
                </thead>
                <tbody id="tbodyMedicoesInseridas">
                    
                </tbody>
            </table>
        </div>
        <div id="MedicoesAprovadas">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>QNTD</th>
                    </tr>
                </thead>
                <tbody id="tbodyMedicoesAprovadas">
                    
                </tbody>
            </table>
        </div>
        <div id="ParcelasAprovadas">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>QNTD</th>
                    </tr>
                </thead>
                <tbody id="tbodyParcelasAprovadas">
                    
                </tbody>
            </table>
        </div>
        <div id="ContratosAditivosRescisoes">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Contratos</th>
                        <th>Aditivos</th>
                        <th>Rescisões</th>
                    </tr>
                </thead>
                <tbody id="tbodyContratosAditivosRescisoes">

                </tbody>
            </table>
        </div>
        <div id="AtividadesControl">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Atividade</th>
                        <th>QNTD</th>
                    </tr>
                </thead>
                <tbody id="tbodyAtividadesControl">

                </tbody>
            </table>
        </div>
        <div id="EnvioDasMedicoes">
            <table class="table table-bordered table-striped table-condensed">
                <thead>
                    <tr>
                        <th>Dia</th>
                        <th>Obra</th>
                        <th>Usuario</th>
                        <th>QNTD</th>
                    </tr>
                </thead>
                <tbody id="tbodyEnvioDasMedicoes">

                </tbody>
            </table>
        </div>
    </div>
    <br>
    <div style="text-align: right;">
        <button class="btn btn-primary" id="btnExportarDados">
            <i class="flaticon flaticon-export icon-sm" aria-hidden="true"></i>
        </button>
    </div>
</div>


