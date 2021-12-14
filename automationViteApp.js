const webdriver = require('selenium-webdriver');
const {By} = require('selenium-webdriver');
const { debug } = require('util');

async function abrir_navegador() {

    navegador = await new webdriver.Builder().forBrowser('firefox').build();
    
}

async function pegar_url() {

    await navegador.get('http://ec2-18-216-30-118.us-east-2.compute.amazonaws.com/');

}

async function executar_script() {

    var camposFormulario = [ "nome", "rg", "cpf", "dataNascimento", "dataAdmissao", "cargo" ];

    camposFormulario.push( {
        nome : '',
        rg : '',
        cpf : '',
        dataNascimento : '',
        dataAdmissao : '',
        cargo : ''
    } );

    let nome = navegador.findElement( By.xpath( "(*//label[contains(text(), 'Nome completo')])[1]" ) );
    let rg = navegador.findElement( By.xpath( "(*//label[contains(text(), 'RG')])[1]" ) );
    let cpf = navegador.findElement( By.xpath( "(*//label[contains(text(), 'CPF')])[1]" ) );
    let dataNascimento = navegador.findElement( By.xpath( "(*//label[contains(text(), 'Data de nascimento')])[1]" ) );
    let dataAdmissao = navegador.findElement( By.xpath( "(*//label[contains(text(), 'Data de admissão')])[1]" ) );
    let cargo = navegador.findElement( By.xpath( "(*//label[contains(text(), 'Cargo')])[1]" ) );

    nome.click()
    nome.sendKeys('qualquer nome')
    sleep(2000)

    rg.click()
    rg.sendKeys('444444444')
    sleep(2000)

    cpf.click()
    cpf.sendKeys('99999999999')
    sleep(2000)

    dataNascimento.click()
    dataNascimento.sendKeys('11/11/1111')
    sleep(2000)

    dataAdmissao.click()
    dataAdmissao.sendKeys('22/22/2222')
    sleep(2000)

    cargo.click()
    cargo.sendKeys('qualquer um')
    sleep(2000)

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

abrir_navegador()
    .catch(error)
    .then(pegar_url)
    .then(executar_script)
    .finally(fechar_navegador)