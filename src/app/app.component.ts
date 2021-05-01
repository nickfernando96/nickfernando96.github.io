import { cursos } from './app.component.model';
import { AppLerDbJson } from './service/service-ler-db-json';
import { Component, OnInit } from '@angular/core';

declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  //input range de valor
  rangePagar = 1500;
  //boolean de trava botão adicionar
  travaButton = true;
  //campos linkados com o html
  cidade = "";
  curso = "";
  isChecked = true;
  isCheckedEad = true;
  //Array de objetos lidos no arquivo db.json
  objetosJson: Array<cursos> = [];
  //Array de copia para validações
  objetoJsonDefault: Array<cursos> = [];

  objJsonIncluir: Array<any> = [];
  
  objFavoritos: Array<cursos> = [];
  //Array de cidades do db.json para o select no html
  opcoes_cidade = [];
  //Array filtrado
  opcoes_cidade_filtrado = [];
  //Array de cursos do db.json para o select no html
  opcoes_curso = [];
  //Array filtrado
  opcoes_curso_filtrado = [];

  
  constructor(private appLerDbJson : AppLerDbJson) { }

  ngOnInit(){
    this.lerJsonDb();
    this.lerLocalStorage();
  }

  onClickAbrirModal(){
    const body = document.querySelector('html');
    const modal = document.getElementById('background-modal');
    modal.classList.add('mostrar');
    body.style.overflowY = 'hidden';
    this.valoresPadrao();
    this.marcaBolsasAdicionadasAntes();
  }

  onClickFecharModal(){
    const modal = document.getElementById('background-modal');
    const body = document.querySelector('html');
    modal.classList.remove('mostrar')
    body.style.overflowY = 'scroll'
    this.valoresPadrao();
  }

  onClickCheckboxBolsa(id){
    let item = id;
    if (this.objJsonIncluir.includes(item)) {
      let index = -1;
      for (let i = 0; i < this.objJsonIncluir.length; i++) {
        if (this.objJsonIncluir[i] == item) {
          index = i;
        }
      }
      if (index !== -1) {
        this.objJsonIncluir.splice(index, 1);
      }
    } else {
      this.objJsonIncluir.push(item);
    }
    this.objJsonIncluir.sort();
    this.travaButtonAdd();
  }
  
  onClickAddBolsas(){
    for(let i = 0; i < this.objJsonIncluir.length; i++){
      const id: string = '#' + this.objJsonIncluir[i];
      $(id).prop('checked', false);
      for (let j = 0; j < this.objetosJson.length;j++){
        if(this.objJsonIncluir[i]==this.objetosJson[j].id){
          this.objFavoritos.push(this.objetosJson[j]);
        }
      }      
    }
    this.onClickFecharModal();
    this.salvaLocalStore();
  }

  onClickExcluirBolsas(id){
    const objFav = this.objFavoritos[id];
    this.objFavoritos.splice(id,1);

    const idArray: string = '#' + objFav.id;
    $(idArray).prop('checked', false);
    $(idArray).prop('disabled', false);

    this.salvaLocalStore();
  }

  onClickFiltraSemestre(nBtn){
    this.lerLocalStorage();
    document.getElementById('todos_semestres').classList.remove('selecao-atual');
    document.getElementById('primeiro-semestre').classList.remove('selecao-atual');
    document.getElementById('segundo-semestre').classList.remove('selecao-atual');
    if(nBtn==1){
      document.getElementById('segundo-semestre').classList.add('selecao-atual');
      this.objFavoritos = this.objFavoritos.filter(obj => obj.enrollment_semester =='2019.2');
    }else if(nBtn==2){
      document.getElementById('primeiro-semestre').classList.add('selecao-atual');
      this.objFavoritos = this.objFavoritos.filter(obj => obj.enrollment_semester =='2020.1');
    }else {
      document.getElementById('todos_semestres').classList.add('selecao-atual');
    }    
  }
  
  onChangeFilter(campo){
    //Refaz o Array seguindo uma copia
    this.objetosJson = this.objetoJsonDefault;
    //Filtra as cidades e cursos conforme marcado
    this.filtraCidadesCursos();
    //Filtra conforme modalidade marcada
    this.filtraModalidade();
    //Filtra pelo preço
    this.filtrarPreco();
  }

  lerLocalStorage(){
    this.objFavoritos = [];
    if (localStorage.hasOwnProperty("bolsasFav")) {
      this.objFavoritos = JSON.parse(localStorage.getItem("bolsasFav"))
    }
  }

  salvaLocalStore(){
    localStorage.setItem("bolsasFav",JSON.stringify(this.objFavoritos));
  }

  lerJsonDb(){
    this.appLerDbJson.getJSON().subscribe(
      (response) => {
        const resp: any = response;
        this.listaobj(resp);
      }); 
  }

  listaobj(resp){
    this.objetosJson = resp;
    this.objetosJson.sort((a, b) => (a.university.name < b.university.name) ? -1 : 1);
    for(let i=0;i < this.objetosJson.length;i++){
      this.objetosJson[i].id=i;
    }
    this.objetoJsonDefault = this.objetosJson;
    this.fazerListaCidades();
    this.fazerListaCursos();
  }


  marcaBolsasAdicionadasAntes(){
    this.lerLocalStorage();
    this.objFavoritos.forEach(element => {
      const id: string = '#' + element.id;
      $(id).prop('checked', true);
      $(id).prop('disabled', true);
    });

  }

  travaButtonAdd(){
    if(this.objJsonIncluir.length > 0){
      this.travaButton = false;
    }else {
      this.travaButton = true;
    }
  }

  fazerListaCidades() {
    this.opcoes_cidade = [];
    for (let i = 0; i < this.objetosJson.length; i++) {
      this.opcoes_cidade.push(this.objetosJson[i].campus.city);
    }
    this.filtrarRepeticoes();
  }

  filtrarRepeticoes() {
    this.opcoes_cidade_filtrado = [];
    var arr = this.opcoes_cidade;
    this.opcoes_cidade_filtrado = arr.filter((e, i) => arr.indexOf(e) === i);
  }

  fazerListaCursos() {
    this.opcoes_curso = [];
    for (let i = 0; i < this.objetosJson.length; i++) {
      this.opcoes_curso.push(this.objetosJson[i].course.name)
    }
    this.filtrarRepeticoesCursos();
  }
  
  filtrarRepeticoesCursos() {
    this.opcoes_curso_filtrado = [];
    var arrCursos = this.opcoes_curso;
    this.opcoes_curso_filtrado = arrCursos.filter((e, i) => arrCursos.indexOf(e) === i);
  }

  filtraCidadesCursos(){
    const city = this.cidade;
    const course = this.curso;
    if(city && course){
      this.objetosJson = this.objetosJson.filter(obj => obj.campus.city == city && obj.course.name == course);    
    } else if (city){
      this.objetosJson = this.objetosJson.filter(obj => obj.campus.city == city);
    } else if (course){
      this.objetosJson = this.objetosJson.filter(obj => obj.course.name == course);
    }else {
      this.objetosJson = this.objetoJsonDefault;
    }
  }

  filtraModalidade(){
    if (this.isChecked == false && this.isCheckedEad == true){
      this.objetosJson = this.objetosJson.filter(obj => obj.course.kind == 'EaD');
    }else if(this.isChecked == true && this.isCheckedEad == false){
      this.objetosJson = this.objetosJson.filter(obj => obj.course.kind == 'Presencial');
    }else if(this.isChecked == false && this.isCheckedEad == false){
      this.objetosJson = [];
    }
  }

  filtrarPreco(){
    document.getElementById('valor-pd-pgar').innerHTML = "R$ "+this.rangePagar;
    this.objetosJson = this.objetosJson.filter(obj => this.rangePagar>=obj.price_with_discount);    
  }

  valoresPadrao(){
    this.rangePagar = 1500;
    document.getElementById('valor-pd-pgar').innerHTML = "R$ 1500";
    this.cidade = "";
    this.curso = "";
    this.objetosJson=this.objetoJsonDefault;
    this.objJsonIncluir = [];
    this.travaButtonAdd();
  }

}
