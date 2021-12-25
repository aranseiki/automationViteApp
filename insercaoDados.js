const webdriver = require( 'selenium-webdriver' );
const { By } = require( 'selenium-webdriver' );


var camposFormulario = [];
var camposLog = [];
var url = 'http://ec2-18-216-30-118.us-east-2.compute.amazonaws.com/';
arquivoBase = './baseDados/insercaoDados/base_dados.csv'
arquivoLog = './baseDados/insercaoDados/base_log.csv'


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

        camposFormulario.push({

            nome: colunas[0],
            rg: colunas[1],
            cpf: colunas[2],
            dataNascimento: colunas[3].toString(),
            dataAdmissao: colunas[4].toString(),
            cargo: colunas[5]

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
    // var mensagemRodape = ''

    try{

        for( var i = 0; i < camposFormulario.length; i++ ) {

            // mensagemRodape = ''

            var nome = await encontrarElementoPorID( "nameInput", 1 )
            var rg = await encontrarElementoPorID( "rgInput", 1 )
            var cpf = await encontrarElementoPorID( "cpfInput", 1 )
            var dataNascimento = await encontrarElementoPorID( "birthdayInput", 1 )
            var dataAdmissao = await encontrarElementoPorID( "admissionInput", 1 )
            var cargo = await encontrarElementoPorID( "jobroleInput", 1 )

            await nome.click()
            await nome.sendKeys( camposFormulario[i].nome )
            await navegador.sleep(300)

            await rg.click()
            await rg.sendKeys( camposFormulario[i].rg )
            await navegador.sleep(300)

            await cpf.click()
            await cpf.sendKeys( camposFormulario[i].cpf )
            await navegador.sleep(300)

            await preencherData( dataNascimento, camposFormulario[i].dataNascimento )
            await navegador.sleep(1000)

            await preencherData( dataAdmissao, camposFormulario[i].dataAdmissao )
            await navegador.sleep(1000)

            await cargo.click()
            await cargo.sendKeys( camposFormulario[i].cargo )
            await navegador.sleep(300)

            var botaoSalvar = await encontrarElementoPorXPath( "(//button[contains(text(), '')])[2]" )
            await botaoSalvar.click()
            await navegador.sleep( 1000 )

            // mensagemRodape = navegador.findElement(By.xpath("//div[contains(@class, 'fixed py-3 px-6 text-white bottom-4 right-4 rounded flex items-center')]/span")).getText()

            camposLog.push( {
                "nome"              :       camposFormulario[i].nome,
                "rg"                :       camposFormulario[i].rg,
                "cpf"               :       camposFormulario[i].cpf,
                "dataNascimento"    :       camposFormulario[i].dataNascimento,
                "dataAdmissao"      :       camposFormulario[i].dataAdmissao,
                "cargo"             :       camposFormulario[i].cargo,
                "Status"            :       "OK",
                "Observacao"        :       "Concluido com sucesso"
            } )

        }

    } catch( e ) {

        camposLog.push( {

            "nome"              :       camposFormulario[i].nome,
            "rg"                :       camposFormulario[i].rg,
            "cpf"               :       camposFormulario[i].cpf,
            "dataNascimento"    :       camposFormulario[i].dataNascimento,
            "dataAdmissao"      :       camposFormulario[i].dataAdmissao,
            "cargo"             :       camposFormulario[i].cargo,
            "Status"            :       "NOK",
            "Observacao"        :       "Concluido com erro"

        } )

    }


    async function preencherData( elemento, dado ) {

        var actions = navegador.actions();
        await actions.click( elemento ).sendKeys( dado.toString() ).perform()
        await actions.keyDown( webdriver.Key.ESCAPE ).perform()
        actions = await ""

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

}

async function gerarLog() {

    global.camposLog
    const gerenciadorArquivos = require( 'fs' )

    gerenciadorArquivos.writeFileSync( arquivoLog, [ "nome", "rg", "cpf", "dataNascimento", "dataAdmissao", "cargo", "Status", "Observacao" ].toString() + "\r\n", 'utf-8' )

    for( var i = 0; i < camposLog.length; i++ ) {

        try{

            gerenciadorArquivos.appendFileSync( arquivoLog, [
                camposLog[i].nome,
                camposLog[i].rg, camposLog[i].cpf,
                camposLog[i].dataNascimento,
                camposLog[i].dataAdmissao,
                camposLog[i].cargo,
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

    return console.log( 'Oops!' )

}


abrirNavegador()
    .catch(capturarErro)
    .then(montarBase)
    .then(acessarUrl)
    .then(executarScript)
    .then(gerarLog)
    .finally(fecharNavegador)
