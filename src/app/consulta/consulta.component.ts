import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';





@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  loading: boolean = false;
  lobby: boolean = true;
  login: boolean = false;
  registrar: boolean = false;
  reportForm: FormGroup;
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
  fullReunion: any;


  constructor(private fb: FormBuilder, private app: AppService, private activatedRoute: ActivatedRoute) {
    this.reportForm = this.fb.group({
      reunionId: ['', [Validators.required]]
    })
  }
  convertTimestamp(timestamp: any) {
    const dt = new Date(timestamp);
    const options = { hour: 'numeric', minute: '2-digit' };
    return dt.toLocaleTimeString('en-US');
  }



  generatePDF() {
    const doc = new jsPDF('l', 'mm', [297, 210]);

    const title = [['Lista de participación']];

    const titleData = [[`Tema: ${this.fullReunion.tema}`], [`Fecha: ${moment(this.fullReunion.fecha).format("YYYY-MM-DD")}`], [`Lugar: ${this.fullReunion.lugar}`], [`Hora: ${this.convertTimestamp(this.fullReunion.desde)} - ${this.convertTimestamp(this.fullReunion.hasta)}`]]

    autoTable(doc, {
      head: title,
      body: titleData,
      theme: 'grid',
      headStyles: { fillColor: [82, 109, 130], halign: 'center' }
    })

    const header = [['#', 'Nombre', 'Cargo', 'Institución', 'Correo Electronico', 'Sexo', 'Telefono', 'Tipo Documento', 'Documento', 'Fecha Registro']];
    const reportData = this.fullReunion.participantes.map((e: any, index: any) => [index + 1, e.nombreCompleto, e.cargo, e.institucion, e.correoElectronico, e.sexo, e.telefono, e.tipoDocumento, e.documento, moment(e.fechaRegistro).format("YYYY-MM-DD")]);


    autoTable(doc, {
      head: header,
      body: reportData,
      headStyles: { fillColor: [82, 109, 130] }
      })

    doc.save(`${this.fullReunion.tema.replace(" ", "")}-reporte.pdf`);
  }

  convertTimeFormat(isoString: string): string {
    var date = new Date(isoString);
    var hours = date.getHours();
    var minutes = date.getMinutes();

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }


  // downloadFile(url: string, params: any) {
  //   fetch(
  //     url,
  //     { method: "post", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } }
  //   )
  //     .then((res) => res.blob())
  //     .then((res) => {
  //       const aElement = document.createElement("a");
  //       const reportName = `listado_participación_${(Math.random() + 1).toString(36).substring(7)}.${params.reportFormat}`;
  //       aElement.setAttribute(
  //         "download",
  //         reportName
  //       );
  //       const href = URL.createObjectURL(res);
  //       aElement.href = href;
  //       aElement.setAttribute("target", "_blank");
  //       aElement.click();
  //       URL.revokeObjectURL(href);
  //     });
  // }

  // ngAfterViewInit(): void {
  //   const button = document.getElementById("btn");
  //   if (button !== null) {
  //     button.addEventListener('click', () => {
  //       const params = {
  //         "reportPath": "Reuniones",
  //         "reportName": "Listado_Reuniones",
  //         "reportFormat": "pdf",
  //         "params": {
  //           "reunionId": +this.id_Reunion
  //         }
  //       };
  //       this.downloadFile(this.reportURL, params);
  //     })
  //   }
  // }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.id_Reunion = params['id'];
      this.app.getReunion(this.id_Reunion).subscribe(data => {
        this.fullReunion = data;
        this.reunion.tema = data.tema;
        this.reunion.fecha = `${moment(data.fecha).format("YYYY-MM-DD")}`;
        this.reunion.hasta = this.convertTimestamp(data.hasta);
        this.reunion.desde = this.convertTimestamp(data.desde);
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    })
  }


  get reunionId() {
    return this.reportForm.get('reunionId')
  }
}
