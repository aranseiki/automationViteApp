# Automação web em aplicação CRUD

## Introdução

#### Esse projeto tem como propósito resolver um desafio de automação em uma aplicação web.

#### O desafio consiste em automatizar as operações CRUD na aplicação do repositório https://github.com/ayelsew/api-express-ts .

#### Essa aplicação web, por sua vez, é um desafio proposto em uma entrevista ao Wesley. Daí surgiu uma brincadeira de automatizar as interações.

# Pré-requisitos

#### Como pré-requisito da execução do script é necessário ter um navegador compatível com as tecnologias mencionadas, assim como as mesmas:

* Visual Studio Code
* Node.JS
* Selenium WebDriver
* WebDriver do navegador

# Instalação das dependências

* Visual Studio Code:
  #### Para a instalação do Visual Studio Code siga os passos contido no link abaixo:

  #### https://code.visualstudio.com/docs/setup/windows
* Node.JS
  #### Para a instalação do Node.JS siga os passos contigo no link abaixo:

  #### https://nodejs.dev/learn/how-to-install-nodejs
* SeleniumWebDriver e WebDriver do navegador
  #### Para a instalação do SeleniumWebDriver siga os passos contigo no link abaixo:

  #### https://www.selenium.dev/documentation/en/selenium_installation/installing_selenium_libraries/

  #### Para a instalação do WebDriver do navegador siga os passos contigo no link abaixo:

  #### https://www.selenium.dev/documentation/en/webdriver/driver_requirements/

# Executando o script

#### Uma vez com todos os pré-requisitos atendidos, crie uma pasta para seu projeto e a nomeie como preferir;

#### Após, copie os arquivos contidos nesse repositório. Caso prefira, clone este repositório para a pasta recém-criada;

#### Abra o Visual Studio Code nessa pasta;

#### Caso queira alterar as informações da base de dados, modifique as informações contidos no arquivo csv dentro do caminho ``.\basedados\`` seguido da pasta com o nome da ação que queira realizar:

* O layout do arquivo ``baseDados.csv`` para ``.\basedados\insercaoDados`` é:

nome,rg,cpf,dataNascimento,dataAdmissao,cargo
Gilmar Pinho,212212345,31405863021,10/17/1988,01/18/1972,Analista Financeiro
Juliano Barreto,302345176,52070860260,11/27/1967,06/18/2020,Atendente

* O layout do arquivo ``baseDados.csv`` para ``.\basedados\remocaoDados`` é:


#### Abra o terminal do sistema dentro do Visual Studio Code. Copie o código abaixo para o terminal e pressione Enter:

``npm install selenium-webdriver``

#### Execute o comando abaixo para efetivamente colocar em produção o script a depender da ação que queira:

Para inserir dados:

``node .\insercaoDados.js``

Para remover dados:

``node .\remocaoDados.js``

#### Ao final do processo, um arquivo de log será gerado seguindo o mesmo critério de escolha da base de dados:

* O layout do arquivo ``baseLog.csv`` para ``.\basedados\insercaoDados`` é:

nome,rg,cpf,dataNascimento,dataAdmissao,cargo,Status,Observacao
Juliano Barreto,302345176,52070860260,11/27/1967,06/18/2020,Atendente,OK,Concluido com sucesso
Benedito Maciel,222204023,52233204689,12/08/1997,11/21/1972,Auxiliar de expedição,OK,Concluido com sucesso

* O layout do arquivo ``baseLog.csv`` para ``.\basedados\remocaoDados`` é:

nome,cpf,Status,Observacao
Gilmar Pinho,314.058.630-21,NOK,Nao foi possivel encontrar o nome na pagina
Juliano Barreto,520.708.602-60,OK,Concluido com sucesso

# Autores

* Automação Web - Allan de Oliveira Almeida
* Aplicação Web - Wesley ( @ayelsew )

# Agradecimentos

#### Agradeço o Wesley por me deixar fazer esse desafio. :)
