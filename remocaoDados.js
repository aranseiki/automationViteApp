const webdriver = require( "selenium-webdriver" )
const { By } = require( "selenium-webdriver" )


var camposFormulario = []
var camposLog = []
var url = "http://ec2-18-216-30-118.us-east-2.compute.amazonaws.com/"
arquivoBase = "./baseDados/remocaoDados/baseDados.csv"
arquivoLog = "./baseDados/remocaoDados/baseLog.csv"


async function montarBase() {

    global.camposFormulario
    const gerenciadorArquivos = require("fs")
    var linhas = ''


    try {

        arquivo = gerenciadorArquivos.readFileSync( arquivoBase, "utf8")

    } catch (error) {

        console.log(error)

    }

    linhas = arquivo.split("\n")

    for (var i = 1; i < linhas.length; i++) {

        colunas = linhas[i].split(",")

        if (colunas[0] == " " || colunas[0] == "" ) {

            continue

        }

        camposFormulario.push({

            nome: colunas[0],
            cpf: formatarCPF(colunas[1])

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


    global.camposLog
    await navegador.sleep( 3000 )
    var Status = ""
    var Observacao = ""

    for (var i = 0; i < camposFormulario.length; i++) {

        Status = ""
        Observacao = ""

        try {

            try {

                var nome = await encontrarElementoPorTexto('h4', camposFormulario[i].nome, 1)
                var validacaoNome = await true

            } catch (e) {

                var validacaoNome = await false

            }

            if( validacaoNome == true ) {

                try {

                    var cpf = await encontrarElementoPorTexto('p', camposFormulario[i].cpf, 1)
                    var validacaoCPF = await true

                } catch (e) {

                    var validacaoCPF = await false

                }

                if( validacaoCPF == true ) {

                    await apagarElemento( camposFormulario[i].nome, camposFormulario[i].cpf )

                    Status = await "OK"
                    Observacao = await "Concluido com sucesso"

                } else if ( validacaoCPF == false ) {

                    Status = "NOK"
                    Observacao = "Nao foi possivel encontrar o cpf na pagina"

                    throw await new Error('')

                } else {

                    throw new Error('')

                }

            } else if ( validacaoNome == false ) {

                Status = await "NOK"
                Observacao = await "Nao foi possivel encontrar o nome na pagina"

                throw new Error('')

            } else {

                throw new Error('')

            }

            await navegador.sleep(1500)

        } catch (e) {

            if( Observacao != "Nao foi possivel encontrar o cpf na pagina" &
                Observacao != "Nao foi possivel encontrar o nome na pagina" ) {

                Status = await "NOK"
                Observacao = await "Algo de errado aconteceu"

            }

        } finally {

            camposLog.push({
                "nome": camposFormulario[i].nome,
                "cpf": camposFormulario[i].cpf,
                "Status": Status,
                "Observacao": Observacao
            })

        }

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

        var botaoApagar = await ""
        var botaoContinuarConfirmacao = await ""

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

function formatarCPF(texto) {

    var formatado = ''

    formatado = texto[0] +
                texto[1] +
                texto[2] +
                "." +
                texto[3] +
                texto[4] +
                texto[5] +
                "." +
                texto[6] +
                texto[7] +
                texto[8] +
                "-" +
                texto[9] +
                texto[10]

    return formatado

}


montarBase()
    .then(abrirNavegador)
    .then(acessarUrl)
    .then(executarScript)
    .then(gerarLog)
    .catch(capturarErro)
    .finally(fecharNavegador)
