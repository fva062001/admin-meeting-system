import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { Reunion } from '../shared/reunion.model';
import {Router} from '@angular/router';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  loading: boolean = false;
  lobby: boolean = true;
  login: boolean = false;
  registrar: boolean = false;
  report: boolean = false;
  reunionForm: FormGroup;

  reunionQuery: boolean = true;

  constructor(private fb: FormBuilder, private app: AppService,private router:Router) {

    this.reunionForm = this.fb.group({
      tema: ['', [Validators.required, Validators.maxLength(50)]],
      horaInicio: [, [Validators.required]],
      horaFin: [, [Validators.required]],
      fecha: ['', [Validators.required]],
      lugar: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  change(caso: number) {
    switch (caso) {
      case 1:
        this.lobby = false;
        this.registrar = true;
        break;
      case 2:
        this.router.navigate(['reporte'])
      break;
    }
  }

  convertTimeFormat(timeString: string): any {
    var currentDate = new Date();
    var [hours, minutes] = timeString.split(":");
    currentDate.setHours(Number(hours));
    currentDate.setMinutes(Number(minutes));
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    return currentDate.toISOString();
  }

  registerReunion() {
    this.loading = true;
    let tempReunion: any = this.reunionForm.value;
    this.reunionQuery = false;

    let reunion: Reunion = {
      tema: tempReunion.tema,
      desde: this.convertTimeFormat(tempReunion.horaInicio),
      hasta: this.convertTimeFormat(tempReunion.horaFin),
      fecha: new Date(tempReunion.fecha),
      lugar: tempReunion.lugar,
      correoElectronico: tempReunion.email,
    }
    this.app.postReunion(reunion).subscribe(data => {
      Swal.fire({
        title: 'Gracias!',
        text: `Se ha registrado la reunión con exito`,
        icon: 'success',
        confirmButtonText: 'Entendido'
      })
      this.lobby = true;
      this.registrar = false;
      this.reunionQuery = true;
      this.loading = false;
    }, error => {
      this.loading = false;
      Swal.fire({
        title: 'Error!',
        text: `Error al registrar la reunión`,
        icon: 'error',
        confirmButtonText: 'Entendido'
      })
      this.reunionForm.reset();
    }
    )
  }


  get horaInicio() {
    return this.reunionForm.get('horaInicio');
  }

  get horaFin() {
    return this.reunionForm.get('horaFin');
  }

  get fecha() {
    return this.reunionForm.get('fecha');
  }

  get lugar() {
    return this.reunionForm.get('lugar');
  }

  get tema() {
    return this.reunionForm.get('tema');
  }

  get area() {
    return this.reunionForm.get('area');
  }

  get email() {
    return this.reunionForm.get('email');
  }
}
