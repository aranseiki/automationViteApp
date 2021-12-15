const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');

var camposFormulario = [];

async function montaBase() {

    global.camposFormulario
    const gerenciadorArquivos = require('fs')
    var linhas = ''

    try{

        arquivo = gerenciadorArquivos.readFileSync('./baseDados/base_dados_13.12.2021.csv', 'utf8')

    } catch(error) {

        console.log(error)

    }

    linhas = arquivo.split('\r\n')

    for (var i = 1; i < linhas.length; i++) {

        colunas = linhas[i].split(',')

        camposFormulario.push({

            nome: colunas[0],
            rg: colunas[1],
            cpf: colunas[2],
            dataNascimento: gerarData(colunas[3]),
            dataAdmissao: gerarData(colunas[4]),
            cargo: colunas[5]

        });

    }    

}

async function abrir_navegador() {

    navegador = await new webdriver.Builder().forBrowser('firefox').build();
    
}

async function pegar_url() {

    await navegador.get('http://ec2-18-216-30-118.us-east-2.compute.amazonaws.com/');

}

async function executar_script() {

    const actions = navegador.actions();


    for (var i = 0; i < camposFormulario.length; i++) {

        var nome = await encontrarElementoPorID("nameInput", 1)
        var rg = await encontrarElementoPorID("rgInput", 1)
        var cpf = await encontrarElementoPorID("cpfInput", 1)
        var dataNascimento = await encontrarElementoPorID("birthdayInput", 1)
        var dataAdmissao = await encontrarElementoPorID("admissionInput", 1)
        var cargo = await encontrarElementoPorID("jobroleInput", 1)

        nome.click()
        nome.sendKeys(camposFormulario[i].nome)
        await navegador.sleep(300)

        rg.click()
        rg.sendKeys(camposFormulario[i].rg)
        await navegador.sleep(300)

        cpf.click()
        cpf.sendKeys(camposFormulario[i].cpf)
        await navegador.sleep(300)

        await preencherData( dataNascimento, camposFormulario[i].dataNascimento )
        await navegador.sleep( 1000 )
        
        await preencherData( dataAdmissao, camposFormulario[i].dataAdmissao )
        await navegador.sleep(1000)
        
        cargo.click()
        cargo.sendKeys(camposFormulario[i].cargo)
        await navegador.sleep(300)

        var botaoSalvar = encontrarElementoPorXPath("(//button[contains(text(), '')])[2]")
        botaoSalvar.click()
        await navegador.sleep(1000)

    }

    function preencherData(elemento, dado) {

        actions.click(elemento).sendKeys('12212021').perform();
        actions.click(elemento).keyDown(webdriver.Key.ESCAPE).keyUp(webdriver.Key.ESCAPE).perform();
        navegador.sleep(1000);

    }

    function encontrarElementoPorID(id, indice) {
        return navegador.findElement(By.xpath(`//input[@id="${id}"][${indice}]`));
    }

    function encontrarElementoPorTexto(tag, texto, indice) {
        return navegador.findElement(By.xpath(`(//${tag}[contains(text(), '${texto}')])[${indice}]`))
    }

    function encontrarElementoPorXPath(caminho) {
        return navegador.findElement(By.xpath(caminho))
    }

}

async function fechar_navegador() {
    await navegador.sleep(5000).then(() => {
        navegador.close()
        }
    )
}

async function error() {
    return console.log('Oops!')
}

function gerarData(data) {
    var date = new Date(data);
    date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    return date
}


abrir_navegador()
    .catch(error)
    .then(montaBase)
    .then(pegar_url)
    .then(executar_script)
    .finally(fechar_navegador)