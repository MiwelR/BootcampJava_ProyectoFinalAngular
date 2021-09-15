import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactosService } from 'src/app/services/contactos.service';

@Component({
  selector: 'app-contactos-detalles',
  templateUrl: './contactos-detalles.component.html',
  styleUrls: ['./contactos-detalles.component.scss']
})
export class ContactosDetallesComponent implements OnInit {

  myGroup = new FormGroup({
    id: new FormControl(),
    email: new FormControl(),
    first_name: new FormControl(),
    last_name: new FormControl(),
    avatar: new FormControl(),
  });

  loading = false;
  titulo = 'Editar usuario'
  
  contactos: any[] = [];
  contactoSeleccionado = {
    id: 0,
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
  };


  cargandoTarea: boolean = true



  constructor(private formBuilder:FormBuilder, private service: ContactosService, private _route: ActivatedRoute) {

  }


  getContactos() {
    this.service.getContactos().subscribe(
      (respuesta) => {
        // respuesta es el json con una clave data donde está la lista
        // por lo tanto accedemos a "data"
        this.contactos = respuesta.data;

      },
      (error) => alert(`Ha ocurrido un error al obtener los contactos: ${error}`),
      () => console.log('Lista de contactos obtenida con éxito')
    )

  }

  // Método que se ejecuta cuando hacemos click en un contacto de la lista
  // Recibe el ID para saber cuál es el contacto seleccionado de la lista y así poder
  // guadarlo en la variable contactoSeleccionado
  seleccionarContacto(id: number) {

    this.service.getContacto(id).subscribe(
      (respuesta) => {
        // Dentro de respuesta está "data" y dentro los datos del contacto
        this.contactoSeleccionado = respuesta.data;
      },
      (error) => alert(`Ha habido un error al obtener el detalle del contacto: ${error}`),
      () => console.log(`Ha habido un error al obtener el detalle del contacto: ${this.contactoSeleccionado}`)
    );
  }

  ngOnInit(): void {

    // ? OBTENEMOS LOS CONTACTOS
    this._route.queryParams.subscribe(
      (params) => {
        console.log('QUERY PARAMS', params);
        if (params.id || params.email || params.first_name || params.last_name || params.avatar) {
          this.contactoSeleccionado = {
            id: params.id,
            email: params.email,
            first_name: params.first_name,
            last_name: params.last_name,
            avatar: params.avatar,
              
          }

          this.myGroup = this.formBuilder.group({
            id: params.id,
            email: params.email,
            first_name: params.first_name,
            last_name: params.last_name,
            avatar: params.avatar,
          });
          this.cargandoTarea = false;
        }
      },
      (error) => alert('Ha habido un error al cargar la tarea'),
      () => console.log(`Tarea Obtenida de la ruta: ${this.contactoSeleccionado}`)
    )

    

}
}
