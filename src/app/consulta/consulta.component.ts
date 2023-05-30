import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { Reunion } from '../shared/reunion.model';
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  lobby: boolean = true;
  login: boolean = false;
  registrar: boolean = false;
  reportForm: FormGroup;
  reportURL: string = environment.reportURL;
  id_Reunion: string = '';
  reunion = {
    tema: "",
    desde: "",
    hasta: "",
    fecha: "",
    lugar: "",
    correoElectronico: "",
    estatus: true
  }


  constructor(private fb: FormBuilder, private app: AppService, private activatedRoute: ActivatedRoute) {
    this.reportForm = this.fb.group({
      reunionId: ['', [Validators.required]]
    })
  }

  downloadFile(url: string, params: any) {
    fetch(
      url,
      { method: "post", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } }
    )
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        const reportName = `listado_participación_${(Math.random() + 1).toString(36).substring(7)}.${params.reportFormat}`;
        console.log(reportName);
        aElement.setAttribute(
          "download",
          reportName
        );
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      });
  }

  ngAfterViewInit(): void {
    const button = document.getElementById("btn");
    console.log(button)
    if (button !== null) {
      button.addEventListener('click', () => {
        const params = {
          "reportPath": "Reuniones",
          "reportName": "Listado_Reuniones",
          "reportFormat": "pdf",
          "params": {
            "reunionId": +this.id_Reunion
          }
        };
        this.downloadFile(this.reportURL, params);
      })
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.id_Reunion = params['id'];
      console.log(this.id_Reunion)
      this.app.getReunion(this.id_Reunion).subscribe(data => {
        console.log(data)
        this.reunion.tema = data.data.tema;
        this.reunion.fecha = data.data.fecha.slice(0, 10);
        this.reunion.hasta = data.data.hasta.slice(11, 16);
        this.reunion.desde = data.data.desde.slice(11, 16);
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    })
  }




  getReport() {

  }


  get reunionId() {
    return this.reportForm.get('reunionId')
  }
}
