const webdriver = require( 'selenium-webdriver' );
const { By } = require( 'selenium-webdriver' );


var camposFormulario = [];
var camposLog = [];
var url = 'http://ec2-18-216-30-118.us-east-2.compute.amazonaws.com/';
arquivoBase = './baseDados/remocaoDados/base_dados.csv'
arquivoLog = './baseDados/remocaoDados/base_log.csv'


async function montarBase() {

    global.camposFormulario
    const gerenciadorArquivos = require('fs')
    var linhas = ''

    try {

        arquivo = gerenciadorArquivos.readFileSync( arquivoBase, 'utf8')

    } catch (error) {

        console.log(error)

    }

    linhas = arquivo.split('\r\n')

    for (var i = 1; i < linhas.length; i++) {

        colunas = linhas[i].split(',')

        if (colunas[0] == ' ' || colunas[0] == '' ) {

            continue

        }

        camposFormulario.push({

            nome: colunas[0],
            cpf: colunas[1]

        });

    }

}

async function abrirNavegador() {

    navegador = new webdriver.Builder().forBrowser('firefox').build();

}

async function acessarUrl() {

    await navegador.get(url);

}

async function executarScript() {

    // global.camposLog
    // var mensagemRodape = ''
    var validacaoNome = false
    var validacaoCPF = false

    try{

        for( var i = 0; i < camposFormulario.length; i++ ) {

            // mensagemRodape = ''

            try {

                var nome = await encontrarElementoPorTexto('h4', camposFormulario[i].nome, 1)
                validacaoNome = true

            } catch (e) {

                validacaoNome = false

            }

            if ( validacaoNome ) {

                try {

                    var cpf = await encontrarElementoPorTexto('p', camposFormulario[i].cpf, 1)
                    validacaoCPF = true

                } catch (e) {

                    validacaoCPF = false

                }

                if ( validacaoCPF ) {

                    await apagarElemento(camposFormulario[i].nome, camposFormulario[i].cpf)

                } else if ( validacaoCPF == false ) {

                    camposLog.push({
                        "nome": camposFormulario[i].nome,
                        "cpf": camposFormulario[i].cpf,
                        "Status": "NOK",
                        "Observacao": "Nao foi possivel encontrar o cpf na pagina"
                    })

                    continue

                } else {

                    camposLog.push({
                        "nome": camposFormulario[i].nome,
                        "cpf": camposFormulario[i].cpf,
                        "Status": "NOK",
                        "Observacao": "Algo de errado aconteceu"
                    })

                    continue

                }

            } else if ( validacaoNome == false ) {

                camposLog.push({
                    "nome": camposFormulario[i].nome,
                    "cpf": camposFormulario[i].cpf,
                    "Status": "NOK",
                    "Observacao": "Nao foi possivel encontrar o nome na pagina"
                })

                continue

            } else {

                camposLog.push({
                    "nome": camposFormulario[i].nome,
                    "cpf": camposFormulario[i].cpf,
                    "Status": "NOK",
                    "Observacao": "Algo de errado aconteceu"
                })

                continue

            }

            await navegador.sleep(1500)

            camposLog.push( {
                "nome"              :       camposFormulario[i].nome,
                "cpf"               :       camposFormulario[i].cpf,
                "Status"            :       "OK",
                "Observacao"        :       "Concluido com sucesso"
            } )

        }

    } catch( e ) {

        camposLog.push( {
            "nome"              :       camposFormulario[i].nome,
            "cpf"               :       camposFormulario[i].cpf,
            "Status"            :       "NOK",
            "Observacao"        :       "Concluido com erro"
        } )

    }

    function encontrarElementoPorID( id, indice ) {

        return navegador.findElement(By.xpath(`//input[@id="${id}"][${indice}]`));

    }

    function encontrarElementoPorTexto( tag, texto, indice ) {

        return navegador.findElement(By.xpath(`(//${tag}[contains(text(), '${texto}')])[${indice}]`))

    }

    function encontrarElementoPorXPath( caminho ) {

        return navegador.findElement( By.xpath( caminho ) )

    }

    async function apagarElemento( nome, cpf ) {

        var botaoApagar = await ''
        var botaoContinuarConfirmacao = await ''

        try {

            botaoApagar = await encontrarElementoPorXPath(`(//div/h4[ contains ( text(), '${nome}' ) ]/following::p[contains(text(), '${cpf}')]/ancestor::div[1]/ancestor::div[1])[1]/div[last()]/button/span[ contains ( text(), 'Apagar' ) ]//ancestor::button[1]`)
            await botaoApagar.click()

            await navegador.sleep(1000)

            botaoContinuarConfirmacao = await encontrarElementoPorXPath("//button[ contains ( @id, 'btnContinueDelete' ) ]")
            await botaoContinuarConfirmacao.click()

        } catch (e) { }

    }

}

async function gerarLog() {

    global.camposLog
    const gerenciadorArquivos = require( 'fs' )

    gerenciadorArquivos.writeFileSync( arquivoLog, [ "nome", "cpf", "Status", "Observacao" ].toString() + "\r\n", 'utf-8' )

    for( var i = 0; i < camposLog.length; i++ ) {

        try{

            gerenciadorArquivos.appendFileSync( arquivoLog, [
                camposLog[i].nome,
                camposLog[i].cpf,
                camposLog[i].Status,
                camposLog[i].Observacao].toString() + "\r\n",
            'utf-8')

        } catch ( error ) {

            console.log( error )

        }

    }

}

async function fecharNavegador() {

    await navegador.sleep( 5000 ).then(

        () => {

            navegador.close()

        }

    )

}

async function capturarErro() {

    gerarLog()

    return console.log( 'Oops!' )

}


abrirNavegador()
    .catch(capturarErro)
    .then(montarBase)
    .then(acessarUrl)
    .then(executarScript)
    .then(gerarLog)
    .finally(fecharNavegador)
